# 🔬 Analyse poussée du projet RENOMAG — Frontend & Backend

> Date d'analyse : 2026-05-01  
> Exclusions volontaires : Email (Resend), Stripe/Paiements  
> Objectif : Lister les epics restants pour finaliser le projet

---

## 1. Vue d'ensemble architecturale

**Stack technique :**
- **Framework** : Next.js 14 (App Router, React Server Components)
- **Langage** : TypeScript strict
- **Styling** : Tailwind CSS + shadcn/ui (composants custom dans `components/ui/`)
- **Auth** : Supabase Auth (Email/MDP + Google OAuth) + synchronisation Prisma
- **Base de données** : PostgreSQL via Prisma ORM + fallback Supabase direct
- **Cache** : Upstash Redis (sliding window rate limit + cache query)
- **Analytics** : PostHog (events, pageviews)
- **Monitoring** : Sentry (erreurs + performance)
- **Search** : Meilisearch (indexation artisans & articles)
- **Tests** : Vitest (unit) + Playwright (E2E)
- **i18n** : next-intl (fr/en prêt, mais locale fixée à `fr`)

**Architecture des rôles :**
| Rôle | Espace | Middleware |
|------|--------|------------|
| `USER` | `/espace-proprietaire/` | ✅ protégé |
| `ARTISAN` | `/espace-pro/` | ✅ protégé |
| `ADMIN` | `/admin/` | ✅ protégé |
| — | `/dashboard-prive/` | Auth séparée (cookie + mot de passe) |

**Schéma Prisma :** 18 modèles, 2 enums. Base solide avec indexes sur tous les champs de filtrage.

---

## 2. État par domaine — Matrice de complétude

### ✅ Domaines fonctionnels (≥ 85%)

| Domaine | État | Détails |
|---------|------|---------|
| **Site public (marketing)** | ~90% | Home, annuaire (SSR + filtres + pagination), blog (SSR), wizard devis 5 étapes, pages légales, SEO complet |
| **Authentification** | ~85% | Supabase Auth email/MDP, Google OAuth, middleware rôles, callback OAuth, reset MDP, double auth dashboard-prive |
| **Formulaire devis** | ~90% | Wizard 5 étapes (Zod + RHF), scoring automatique, estimation aides, rate limiting, fallback DB |
| **Dashboard privé (interne)** | ~90% | Auth par mot de passe, KPIs réels, liste users/leads, filtres multi-critères, export CSV, CRUD leads |
| **SEO technique** | ~95% | Sitemap dynamique, robots.txt, JSON-LD (Organization, LocalBusiness, Article), metadata enrichies, CSP headers |
| **Infrastructure** | ~90% | Health check, rate limiting Upstash + fallback in-memory, cache Redis, upload Supabase Storage, analytics PostHog, Sentry, PWA (SW + manifest) |

### ⚠️ Domaines partiellement fonctionnels (40–70%)

| Domaine | État | Ce qui manque |
|---------|------|---------------|
| **Espace Pro (artisan)** | ~60% | Dashboard lecture OK. Profil **100% hardcodé**. Paramètres statiques. Messagerie **lecture seule** (pas d'envoi). Leads : select statut sans action, notes non persistées. Analytics : sélecteur période inactif. |
| **Espace Propriétaire** | ~65% | Dashboard OK. Mon projet : estimation aides **hardcodée** (3900€). Artisans matchés : prix **hardcodés**. Messagerie **lecture seule**. Compte : formulaire statique. |
| **Admin** | ~55% | Vue d'ensemble + leads réels OK. Artisans : **données mock statiques** (2418 total fictif). Contenu : stats trafic hardcodées, pas de création article. Analytics : données mensuelles **hardcodées**. Agents Hermes : **100% hardcodés** (8 agents fictifs). Paramètres : formulaires statiques. |
| **Messagerie** | ~20% | Hook temps réel Supabase existe. Affichage des conversations réelles. **Envoi de message non connecté** (input + bouton sans action) dans les 2 espaces. |
| **Abonnements** | ~10% | Schéma `Subscription` existe. Page `/espace-pro/abonnement` lit le plan. **Aucune logique métier** (création, renouvellement, changement de plan). |

### ❌ Domaines orphelins / non exploités

| Modèle/Table | État |
|--------------|------|
| `KPI` | Table jamais lue/écrite. Les KPIs affichés sont calculés en mémoire à chaque requête. |
| `Setting` | Table jamais utilisée. Tous les paramètres admin sont hardcodés. |
| `OutreachCampaign` + `OutreachContact` | Tables jamais utilisées hors schéma. |
| `Department` | Table non seedée. Seule `getDepartments()` existe mais retournera vide. |

---

## 3. Problèmes structurels identifiés

### A. Double source de vérité (Prisma vs Supabase)
- Prisma est la source primaire, mais Supabase est utilisé comme **fallback** pour les leads et pour la **messagerie temps réel** (`useRealtimeMessages.ts` lit directement Supabase).
- Risque de divergence de données si un lead est inséré via fallback Supabase mais jamais synchronisé dans Prisma.
- Le hook `useRealtimeMessages.ts` écoute `postgres_changes` sur la table `Message` de Supabase, mais les messages sont créés via Prisma (`app/actions/messages.ts`). Il faut s'assurer que Supabase Realtime est configuré sur les tables Prisma.

### B. Données mock omniprésentes
- `lib/data/db.ts` et `lib/data/dashboard.ts` fallback immédiatement sur des mocks si la DB est vide.
- Conséquence : l'application "semble" fonctionner sans données réelles, ce qui masque les problèmes en développement.
- Les mocks statiques (`artisans.ts`, `blog.ts`, `dashboard-mocks.ts`) devraient être retirés ou conditionnés à `NODE_ENV === 'development'` avec un warning explicite.

### C. Pas de gestion d'erreurs unifiée sur les Server Actions
- Certaines actions renvoient des strings d'erreur, d'autres throw, d'autres renvoient `{ success, error }`.
- Pas de pattern de `try/catch` global ni de toast systématique sur retour d'action.

### D. Cache invalidation manquante
- Le cache Redis est utilisé pour artisans/articles/users/leads, mais **aucune invalidation** n'est faite après un create/update/delete.
- Exemple : après `updateLeadStatus`, le cache des leads n'est pas invalidé.

---

## 4. 🎯 Epics priorisés pour finaliser le projet

> **Total : 14 epics** (hors Email & Stripe)  
> Priorité : `P0` = bloquant MVP, `P1` = important, `P2` = nice-to-have

---

### Epic 1 — Profil Artisan Connecté [P0]
**Description :** Rendre la page `/espace-pro/profil` fonctionnelle avec la base de données.

**Actuel :** Toutes les valeurs sont hardcodées (ThermoConfort Paris, SIRET factice, etc.). Bouton "Enregistrer" décoratif.

**TODO :**
- [ ] Créer une Server Action `updateArtisanProfile()` connectée à `ArtisanCompany` + `Profile`
- [ ] Pré-remplir le formulaire avec les vraies données de l'artisan connecté
- [ ] Connecter l'`ImageUpload` vers `uploadLogo()` et `uploadGalleryImage()`
- [ ] Permettre l'édition des spécialités (multi-select) et certifications
- [ ] Gérer la géolocalisation (lat/long) à partir du code postal
- [ ] Ajouter la validation Zod côté serveur
- [ ] Afficher le "score de profil" calculé dynamiquement (complétude des champs)
- [ ] Toast de confirmation / gestion d'erreur

**Fichiers concernés :** `app/espace-pro/profil/page.tsx`, `app/actions/data.ts`, `app/actions/upload.ts`

---

### Epic 2 — Messagerie Interactive [P0]
**Description :** Rendre l'envoi de messages fonctionnel dans les deux espaces protégés.

**Actuel :** Input + bouton "Envoyer" sans action attachée. Affichage lecture seule des conversations Prisma.

**TODO :**
- [ ] Connecter l'input d'envoi à `sendMessage()` (déjà implémentée dans `app/actions/messages.ts`)
- [ ] S'assurer que `useRealtimeMessages.ts` reçoit bien les INSERT via Supabase Realtime
- [ ] Marquer automatiquement les messages comme lus à l'ouverture de la conversation (`markMessagesAsRead`)
- [ ] Gérer l'état optimiste (UI update immédiate avant retour serveur)
- [ ] Ajouter une notification push/browser ou toast à la réception d'un nouveau message
- [ ] Afficher l'indicateur "en ligne" / "vu à..."
- [ ] Tests E2E : flow conversation complète entre propriétaire et artisan

**Fichiers concernés :** `app/espace-pro/messages/page.tsx`, `app/espace-proprietaire/messages/page.tsx`, `app/actions/messages.ts`, `lib/hooks/useRealtimeMessages.ts`

---

### Epic 3 — Gestion des Leads par l'Artisan [P0]
**Description :** Donner à l'artisan les outils pour traiter ses leads.

**Actuel :** Select de statut sans `onChange`, textarea "Notes" non persistée, boutons "Envoyer un devis" et "Appeler" décoratifs.

**TODO :**
- [ ] Connecter le changement de statut à `updateLeadStatus()`
- [ ] Ajouter un champ `notes` (JSON ou text) au modèle `Lead` ou créer un modèle `LeadNote`
- [ ] Implémenter "Envoyer un devis" : ouvre la messagerie pré-remplie avec le lead concerné
- [ ] Implémenter "Appeler" : lien `tel:` avec le numéro du propriétaire (anonymisé si RGPD)
- [ ] Afficher l'historique des interactions (timeline lead)
- [ ] Notifications lorsqu'un nouveau lead est attribué à l'artisan
- [ ] Quota mensuel : afficher le nombre de leads restants selon le plan d'abonnement

**Fichiers concernés :** `app/espace-pro/leads/page.tsx`, `app/actions/dashboard.ts`, `prisma/schema.prisma` (migration lead notes)

---

### Epic 4 — Admin : CRUD Artisans Réel [P1]
**Description :** Remplacer les données mock de la page admin Artisans par du vrai CRUD.

**Actuel :** Stats hardcodées (2418 total, 347 premium…). Boutons "Ajouter" / "Modifier" décoratifs.

**TODO :**
- [ ] Connecter la page à `getAllArtisanCompanies()` (déjà implémenté dans `data.ts`)
- [ ] Implémenter `createArtisanCompany()` (admin peut créer un artisan manuellement)
- [ ] Implémenter `updateArtisanCompany()` (édition inline ou modal)
- [ ] Implémenter `deleteArtisanCompany()` (soft delete ou vraie suppression)
- [ ] Ajouter des filtres fonctionnels (statut, région, spécialité, premium/verified)
- [ ] Afficher les vraies stats (COUNT agrégés via Prisma)
- [ ] Ajouter un toggle "Vérifier" / "Premium" / "Featured" rapide

**Fichiers concernés :** `app/admin/artisans/page.tsx`, `app/actions/data.ts`, `components/dashboard/DataTable.tsx`

---

### Epic 5 — Admin : Gestion du Contenu (Blog) [P1]
**Description :** Permettre à l'admin de créer, modifier, publier/dépublier des articles.

**Actuel :** Liste des articles réels affichée. Stats trafic/IA hardcodées. Bouton "Générer avec IA" décoratif. Pas de création.

**TODO :**
- [ ] Implémenter `createArticle()` avec validation Zod
- [ ] Implémenter `updateArticle()` (édition inline ou page dédiée)
- [ ] Implémenter `deleteArticle()` (soft delete via `published=false` ou vraie suppression)
- [ ] Formulaire d'édition riche (markdown ou éditeur WYSIWYG léger)
- [ ] Gestion des images d'article (upload Supabase Storage)
- [ ] Gestion des tags et catégories (CRUD Category)
- [ ] Toggle "À la une" / "Publié"
- [ ] Génération automatique du slug
- [ ] Preview avant publication

**Fichiers concernés :** `app/admin/contenu/page.tsx`, `app/actions/data.ts`, `lib/storage.ts`

---

### Epic 6 — Admin : Paramètres & Configuration [P1]
**Description :** Connecter les formulaires de paramètres à la table `Setting`.

**Actuel :** Tous les paramètres sont hardcodés. Toggle agents Hermes sans action. Boutons "Enregistrer" décoratifs.

**TODO :**
- [ ] Implémenter `getSetting(key)` et `updateSetting(key, value)`
- [ ] Connecter les formulaires admin (config plateforme, alertes, sécurité, maintenance)
- [ ] Implémenter le toggle "Activer les agents Hermes" comme un vrai setting
- [ ] Ajouter une page "Maintenance DB" avec actions (vacuum, reset cache, export)
- [ ] Gérer les variables d'environnement dynamiques via `Setting` (fallback sur `process.env`)
- [ ] Cache les settings en mémoire avec invalidation

**Fichiers concernés :** `app/admin/parametres/page.tsx`, `app/actions/data.ts`, `prisma/schema.prisma` (déjà prêt)

---

### Epic 7 — Espace Propriétaire : Mon Projet & Estimation d'Aides [P1]
**Description :** Calculer dynamiquement les aides à la rénovation selon le profil du lead.

**Actuel :** Estimation fixe à 3900€. Calendrier prévisionnel statique.

**TODO :**
- [ ] Implémenter `calculateSubsidy()` côté serveur (déjà présent dans `lib/utils.ts` mais à enrichir)
- [ ] Connecter le calcul aux données réelles du lead (type de travaux, revenus, âge du bien, localisation)
- [ ] Afficher le détail des aides : MaPrimeRénov', CEE, Éco-PTZ, aides locales région/département
- [ ] Calendrier prévisionnel dynamique selon le type de travaux (délai moyen par spécialité)
- [ ] Permettre au propriétaire de modifier son projet (met à jour le lead)
- [ ] Sauvegarder l'historique des estimations

**Fichiers concernés :** `app/espace-proprietaire/mon-projet/page.tsx`, `lib/utils.ts`, `lib/data/subsidies.ts`

---

### Epic 8 — Espace Propriétaire : Gestion du Compte [P1]
**Description :** Permettre au propriétaire de modifier son profil et son mot de passe.

**Actuel :** Formulaire entièrement statique.

**TODO :**
- [ ] Connecter le formulaire à `updateProfileForm()` (déjà implémenté)
- [ ] Permettre le changement de mot de passe via Supabase Auth (`updateUser`)
- [ ] Gérer la suppression de compte (RGPD) avec confirmation + cascade
- [ ] Afficher l'historique des projets / leads
- [ ] Gérer les préférences de notification

**Fichiers concernés :** `app/espace-proprietaire/compte/page.tsx`, `app/actions/auth.ts`, `app/actions/data.ts`

---

### Epic 9 — Analytics & KPIs Temps Réel [P1]
**Description :** Remplacer toutes les données hardcodées par des agrégations DB.

**Actuel :** Admin analytics : données mensuelles `MONTHLY` hardcodées. Espace Pro analytics : variations "+0%" statiques.

**TODO :**
- [ ] Connecter la table `KPI` : créer un job d'agrégation quotidien (cron ou serverless function)
- [ ] Remplacer `MONTHLY` et `CHANNEL_DATA` par des requêtes Prisma agrégées
- [ ] Implémenter le sélecteur de période (7j, 30j, 6 mois, 1 an) avec requêtes dynamiques
- [ ] Calculer les variations % vs période précédente
- [ ] Dashboard artisan : KPIs réels (leads reçus, taux de conversion, CA estimé)
- [ ] Graphiques dynamiques avec Recharts (déjà utilisé)
- [ ] Export des analytics (CSV/PDF)

**Fichiers concernés :** `app/admin/analytics/page.tsx`, `app/espace-pro/analytics/page.tsx`, `app/actions/data.ts`, `prisma/schema.prisma`

---

### Epic 10 — Agents Hermes : Décision Architecture [P2]
**Description :** Décider du sort du système "Agents Hermes".

**Actuel :** 8 agents entièrement hardcodés avec stats fictives (98.2% succès, 48230 tâches…).

**Options :**
1. **Masquer** la section admin Agents et retirer toutes les références du schéma/frontend.
2. **Implémenter un vrai système** de tâches automatisées (queue Redis/BullMQ, workers) pour des tâches comme : matching lead-artisan, relances, scoring, notifications.

**Recommandation :** Option 1 pour le MVP. L'option 2 est un projet à part entière.

**TODO (Option 1 - suppression) :**
- [ ] Retirer la page `app/admin/agents/page.tsx`
- [ ] Retirer "Agents Hermes" du menu admin
- [ ] Nettoyer les références dans les paramètres

**TODO (Option 2 - implémentation) :**
- [ ] Définir les agents (LeadMatcher, ReminderAgent, ScoringAgent, etc.)
- [ ] Mettre en place une queue de jobs (BullMQ / inngest / QStash)
- [ ] Table `AgentJob` (id, type, payload, status, result, scheduledAt, completedAt)
- [ ] Dashboard de monitoring des jobs

---

### Epic 11 — Outreach / Campagnes : Décision Architecture [P2]
**Description :** Décider du sort des tables `OutreachCampaign` et `OutreachContact`.

**Actuel :** Tables jamais utilisées.

**Options :**
1. **Supprimer** du schéma Prisma (migration) pour alléger.
2. **Implémenter** un mini-CRM d'outreach pour contacter les artisans prospects.

**Recommandation :** Option 1. Le besoin n'est pas démontré pour le MVP.

**TODO :**
- [ ] Si suppression : créer une migration Prisma `DROP TABLE OutreachCampaign, OutreachContact`
- [ ] Si conservation : implémenter CRUD campagnes + envoi d'emails + tracking

---

### Epic 12 — Données Référentielles & Seed [P1]
**Description :** Assurer que les données de base sont présentes et cohérentes.

**Actuel :** `Department` non seedé. Migrations incrémentales absentes.

**TODO :**
- [ ] Seeder les 101 départements français dans `Department`
- [ ] S'assurer que `prisma/seed.ts` crée les catégories d'articles de base
- [ ] Ajouter un script de vérification post-seed (`npm run db:verify`)
- [ ] Créer une migration de correction si des indexes manquent
- [ ] Documenter le processus de seed pour la prod

**Fichiers concernés :** `prisma/seed.ts`, `prisma/schema.prisma`

---

### Epic 13 — Espace Pro : Paramètres & Préférences [P2]
**Description :** Rendre fonctionnelle la page paramètres de l'artisan.

**Actuel :** Notifications, préférences leads, sécurité, facturation : tout statique.

**TODO :**
- [ ] Connecter les toggles de notification à la table `Setting` ou `Profile` (préférences JSON)
- [ ] Permettre de définir le rayon d'action (km) et les types de projets acceptés
- [ ] Gérer le changement de mot de passe
- [ ] Gérer la 2FA (TOTP via Supabase ou app externe)
- [ ] Préférences de contact (email, SMS, horaires)

**Fichiers concernés :** `app/espace-pro/parametres/page.tsx`, `app/actions/data.ts`

---

### Epic 14 — Qualité & Tests [P1]
**Description :** Augmenter la couverture de tests sur les fonctionnalités critiques.

**Actuel :** 17 tests (4 unit + 13 E2E). Couverture faible sur les server actions et les espaces protégés.

**TODO :**
- [ ] Tests unitaires des Server Actions (`auth.ts`, `leads.ts`, `messages.ts`, `dashboard.ts`)
- [ ] Tests E2E messagerie (envoi, réception, temps réel)
- [ ] Tests E2E espace pro (édition profil, gestion leads)
- [ ] Tests E2E espace propriétaire (mon projet, compte)
- [ ] Tests E2E admin (CRUD artisans, CRUD articles)
- [ ] Mock Redis/Supabase pour les tests unitaires
- [ ] Tests de rate limiting E2E (déjà partiellement fait)
- [ ] Tests de cache invalidation

**Fichiers concernés :** `__tests__/`, `e2e/`

---

## 5. 📋 Roadmap suggérée

### Phase 1 — Fondations (semaines 1-2)
| Epic | Tâche |
|------|-------|
| #12 | Seed departments + vérification DB |
| #14 | Tests E2E critiques (auth, devis) |
| #10 | Décision + suppression Agents Hermes |
| #11 | Décision + suppression Outreach |

### Phase 2 — Core fonctionnel (semaines 3-5)
| Epic | Tâche |
|------|-------|
| #1 | Profil Artisan connecté |
| #2 | Messagerie interactive |
| #3 | Gestion des leads par l'artisan |
| #7 | Estimation d'aides dynamique |

### Phase 3 — Admin & Configuration (semaines 6-7)
| Epic | Tâche |
|------|-------|
| #4 | CRUD Artisans réel |
| #5 | Gestion du contenu (blog) |
| #6 | Paramètres & Configuration |
| #9 | Analytics temps réel |

### Phase 4 — Polish (semaines 8)
| Epic | Tâche |
|------|-------|
| #8 | Compte propriétaire |
| #13 | Paramètres artisan |
| #14 | Complétion tests E2E |

---

## 6. Résumé des fichiers critiques à modifier

```
app/
├── espace-pro/
│   ├── profil/page.tsx              → Epic #1
│   ├── leads/page.tsx               → Epic #3
│   ├── messages/page.tsx            → Epic #2
│   ├── paramètres/page.tsx          → Epic #13
│   └── analytics/page.tsx           → Epic #9
├── espace-proprietaire/
│   ├── mon-projet/page.tsx          → Epic #7
│   ├── messages/page.tsx            → Epic #2
│   ├── compte/page.tsx              → Epic #8
│   └── artisans/page.tsx            → Epic #7
├── admin/
│   ├── artisans/page.tsx            → Epic #4
│   ├── contenu/page.tsx             → Epic #5
│   ├── parametres/page.tsx          → Epic #6
│   ├── analytics/page.tsx           → Epic #9
│   └── agents/page.tsx              → Epic #10
├── actions/
│   ├── data.ts                      → Epics #1, #4, #5, #6, #8
│   ├── messages.ts                  → Epic #2
│   ├── dashboard.ts                 → Epic #3, #9
│   └── upload.ts                    → Epic #1
├── api/
│   └── health/route.ts              → Epic #12 (ajouter check departments)
prisma/
├── schema.prisma                    → Epics #3, #10, #11, #12
├── seed.ts                          → Epic #12
└── migrations/                      → Epics #3, #10, #11
lib/
├── data/
│   ├── db.ts                        → Epic #4, #5
│   └── dashboard.ts                 → Epic #9
├── hooks/
│   └── useRealtimeMessages.ts       → Epic #2
├── utils.ts                         → Epic #7
└── cache.ts                         → Epic #6, #9
```

---

*Document généré par analyse automatisée du codebase. Dernière mise à jour : 2026-05-01.*
