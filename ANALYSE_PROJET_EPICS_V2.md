# 🔬 Analyse poussée du repo GitHub — RENOMAG

> Date d'analyse : 2026-05-01  
> Source : `https://github.com/Arcturian42/renomag1` (branche `main`)  
> Exclusions : Email (Resend), Stripe/Paiements  
> ⚠️ **Important** : le code local contient des fonctionnalités non commitées sur GitHub (voir section 6)

---

## 1. Architecture réelle sur GitHub

**Stack :** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · Supabase Auth · Upstash Redis (rate limit)

**Dépendances clés (package.json) :**
- Next.js 14.2.35, React 18, Prisma 5.22, Supabase SSR
- Zod, React Hook Form, Recharts, Framer Motion, Sentry
- Tests : Vitest + Playwright
- **Absent du repo** : next-intl, Meilisearch, Resend, PostHog, Pino

**Auth :** Supabase Auth (email/mdp + Google OAuth) + synchronisation Prisma (`user_metadata.role`). Middleware Edge qui appelle `/api/auth/role`.

**Data layer :** Prisma primaire + fallback Supabase direct pour les leads. Fallback mocks en mémoire si DB vide.

---

## 2. État par domaine — Matrice de complétude (basée sur le VRAI code GitHub)

### ✅ Fonctionnel (≥ 80%)

| Domaine | Complétude | Preuve |
|---------|-----------|--------|
| **Site public** | ~90% | Home, annuaire (SSR + filtres Prisma), blog, wizard devis, pages légales |
| **Auth** | ~85% | Login/signup OAuth, middleware RBAC, reset MDP, sync Prisma/Supabase |
| **Wizard devis** | ~90% | 5 étapes Zod, scoring `calculateLeadScore`, rate limiting Upstash, fallback Supabase |
| **Dashboard privé** | ~85% | Auth cookie, KPIs réels, users/leads/répartition avec vraies données |
| **Admin — Vue d'ensemble** | ~75% | KPIs réels (`getKPIs`), activité récente, agents hardcodés |
| **Admin — Leads** | ~80% | Liste réelle, graphiques depuis données |
| **Admin — Utilisateurs** | ~80% | Liste réelle, actions activer/supprimer |
| **Admin — Contenu** | ~70% | Articles réels, stats trafic/IA **hardcodées** |
| **Espace Pro — Dashboard** | ~80% | Stats temps réel (leads, CA, conversion, note), quota mensuel, score profil |
| **Espace Pro — Leads** | ~60% | **Lecture réelle** via `getArtisanLeads`. Statuts frontend ≠ DB. Pas d'update fonctionnel |
| **Espace Pro — Messages** | ~50% | **Lecture réelle** Prisma. **Pas d'envoi** (input sans action) |
| **Espace Pro — Analytics** | ~65% | Données réelles mais période fixe "6 mois", variations "+0%" statiques |
| **Espace Pro — Abonnement** | ~60% | Lit le vrai `subscription`. Pas d'intégration paiement (Stripe exclu anyway) |
| **Espace Propriétaire — Dashboard** | ~80% | Timeline, stats, quick actions |
| **Espace Propriétaire — Mon projet** | ~60% | Lead réel MAIS estimation aides **hardcodée** (3900€), calendrier statique |
| **Espace Propriétaire — Messages** | ~50% | Même implémentation lecture seule que l'espace pro |
| **SEO technique** | ~90% | Sitemap dynamique, robots, JSON-LD, CSP headers, HSTS |
| **Sécurité** | ~80% | CSP strict, HSTS, rate limiting, validation Zod sur `submitLead` |

### ❌ Non fonctionnel / Statique

| Page | Problème |
|------|----------|
| `espace-pro/profil` | **100% hardcodé** (nom, SIRET, téléphone, description, spécialités, certifications). Bouton "Enregistrer" décoratif |
| `espace-pro/parametres` | Formulaires statiques (notifications, préférences leads, sécurité, facturation) |
| `espace-proprietaire/compte` | Formulaire statique (infos perso, logement, notifications, MDP) |
| `espace-proprietaire/artisans` | Hardcodé (prix devis, économies d'aides fictives) — à vérifier |
| `admin/artisans` | Utilise `ARTISANS` (mock statique de 6 artisans) au lieu de `getAllArtisanCompanies()` |
| `admin/agents` | **100% hardcodé** (8 agents Hermes fictifs avec stats inventées) |
| `admin/analytics` | `MONTHLY` et `CHANNEL_DATA` hardcodés. Sélecteur de période sans effet |
| `admin/parametres` | Formulaires globaux statiques. Toggles agents Hermes sans action |

---

## 3. 🚨 Problèmes structurels critiques

### A. Décalage des statuts de leads
**Frontend** (`espace-pro/leads/page.tsx`) utilise :
```ts
type LeadStatus = 'new' | 'contacted' | 'devis_sent' | 'won' | 'lost'
```
**Enum Prisma** utilise :
```prisma
enum LeadStatus { NEW CONTACTED QUALIFIED CONVERTED REJECTED }
```
→ Le mapping est fait à la volée dans le dashboard mais le `<select>` de changement de statut n'a **pas d'`onChange`**.

### B. Fallback mocks systématique
`lib/data/db.ts` et `lib/data/dashboard.ts` retournent immédiatement les mocks si `db.length === 0`. En développement avec DB vide, **toute l'app semble fonctionner** sans données réelles.

### C. Messagerie : affichage sans envoi
`espace-pro/messages/page.tsx` et `espace-proprietaire/messages/page.tsx` lisent les messages Prisma mais **l'input + bouton "Envoyer" n'ont aucune action**.  
→ La Server Action `sendMessage` **n'existe pas** sur GitHub (existe en local non commité).

### D. Profil artisan : action existante mais non branchée
`updateArtisanProfileForm()` existe dans `app/actions/data.ts` (ligne 320+) mais `espace-pro/profil/page.tsx` ne l'appelle pas.

### E. Tables orphelines dans le schéma
- `KPI` — jamais écrite/lue (les KPIs sont calculés en mémoire)
- `Setting` — jamais utilisée
- `OutreachCampaign` / `OutreachContact` — jamais utilisées
- `Department` — table vide (non seedée)

---

## 4. 🔍 Écarts : Code Local vs GitHub

Le working directory local contient **des fichiers non commités** sur GitHub :

| Fichier / Feature | Local | GitHub |
|-------------------|-------|--------|
| `i18n/` + `messages/` (next-intl) | ✅ | ❌ |
| `lib/email.ts` + `lib/email-templates.ts` (Resend) | ✅ | ❌ |
| `lib/search.ts` (Meilisearch) | ✅ | ❌ |
| `lib/analytics.ts` (PostHog) | ✅ | ❌ |
| `lib/cache.ts` (Redis cache query) | ✅ | ❌ |
| `lib/storage.ts` (Supabase Storage) | ✅ | ❌ |
| `app/actions/email.ts` | ✅ | ❌ |
| `app/actions/upload.ts` | ✅ | ❌ |
| `app/actions/messages.ts` (`sendMessage`) | ✅ | ❌ |
| `app/api/health/route.ts` | ✅ | ❌ |
| `lib/hooks/useRealtimeMessages.ts` | ✅ | ❌ |
| `components/providers/PostHogProvider.tsx` | ✅ | ❌ |
| `public/manifest.json` + `sw.js` | ✅ | ❌ |

**Interprétation :** soit ces features ont été développées en local et jamais pushées, soit elles ont été supprimées du repo. Dans tous les cas, **elles ne sont pas dans la source de vérité GitHub**.

---

## 5. 🎯 Epics priorisés — Liste mise à jour

> **Total : 12 epics** (hors Email & Stripe)  
> P0 = bloquant MVP · P1 = important · P2 = polish

---

### Epic 1 — Profil Artisan Connecté [P0]
**Actuel :** Tout est hardcodé. L'action `updateArtisanProfileForm` existe déjà dans `app/actions/data.ts` mais n'est pas branchée.

**TODO :**
- [ ] Pré-remplir le formulaire avec `dbUser.artisan` + `dbUser.profile`
- [ ] Transformer la page en Client Component avec `useTransition` ou utiliser `<form action={}>`
- [ ] Brancher `updateArtisanProfileForm` dans le `<form>`
- [ ] Gérer l'upload d'avatar (optionnel : utiliser un input file + FormData)
- [ ] Connecter les spécialités avec un multi-select vers `prisma.artisanCompany.update({ specialties: { set: [...] } })`
- [ ] Afficher le score de profil calculé dynamiquement (déjà partiellement fait dans le dashboard)

**Effort estimé :** 1-2 jours  
**Fichiers :** `app/espace-pro/profil/page.tsx`, `app/actions/data.ts`

---

### Epic 2 — Messagerie Interactive [P0]
**Actuel :** Lecture réelle Prisma, affichage des conversations. **Pas d'envoi**.

**TODO :**
- [ ] Créer la Server Action `sendMessage({ senderId, receiverId, content })` dans `app/actions/data.ts`
- [ ] Créer la Server Action `markMessagesAsRead(conversationPartnerId)`
- [ ] Brancher l'input d'envoi dans les deux espaces (`espace-pro/messages`, `espace-proprietaire/messages`)
- [ ] Gérer l'état optimiste (UI update immédiate)
- [ ] Rafraîchir la liste des conversations après envoi
- [ ] Tests E2E : flow conversation complet

**Effort estimé :** 2-3 jours  
**Fichiers :** `app/actions/data.ts`, `app/espace-pro/messages/page.tsx`, `app/espace-proprietaire/messages/page.tsx`

---

### Epic 3 — Gestion des Leads par l'Artisan [P0]
**Actuel :** Lecture réelle. Statuts frontend (`new/contacted/devis_sent/won/lost`) décalés de l'enum Prisma. Select sans `onChange`. Notes non persistées.

**TODO :**
- [ ] **Aligner les statuts** : soit mapper `devis_sent` → `QUALIFIED`, `won` → `CONVERTED`, `lost` → `REJECTED`, soit migrer l'enum Prisma
- [ ] Connecter le `<select>` de statut à `updateLeadStatus()` (déjà implémenté)
- [ ] Ajouter un champ `notes` (text) au modèle `Lead` OU créer `LeadNote` (id, leadId, content, createdAt)
- [ ] Persister les notes via une Server Action
- [ ] "Envoyer un devis" : rediriger vers la messagerie avec le lead pré-sélectionné
- [ ] "Appeler" : garder le `tel:` (déjà fonctionnel)

**Effort estimé :** 2-3 jours  
**Fichiers :** `app/espace-pro/leads/page.tsx`, `prisma/schema.prisma` (migration), `app/actions/data.ts`

---

### Epic 4 — Admin : CRUD Artisans Réel [P1]
**Actuel :** Utilise `ARTISANS` (mock de 6 artisans). `getAllArtisanCompanies()` existe et fonctionne.

**TODO :**
- [ ] Remplacer `ARTISANS` par `await getAllArtisanCompanies()`
- [ ] Afficher les vraies stats (COUNT via Prisma)
- [ ] Implémenter `updateArtisanStatus(id, { verified, premium, available })` pour les toggles rapides
- [ ] Ajouter un bouton "Voir la fiche" → `/annuaire/${slug}`
- [ ] Gérer la pagination côté serveur

**Effort estimé :** 1 jour  
**Fichiers :** `app/admin/artisans/page.tsx`, `app/actions/data.ts`

---

### Epic 5 — Admin : Gestion du Contenu (Blog) [P1]
**Actuel :** Liste réelle d'articles. Stats trafic/IA hardcodées. Pas de CRUD.

**TODO :**
- [ ] Implémenter `createArticle()`, `updateArticle()`, `deleteArticle()` dans `app/actions/data.ts`
- [ ] Créer une page/modal d'édition d'article
- [ ] Formulaire avec validation Zod (titre, slug, contenu, excerpt, catégorie, image, tags, published, featured)
- [ ] Génération auto du slug
- [ ] Upload d'image (base64 URL ou Supabase Storage)
- [ ] Remplacer les stats hardcodées par des vraies métriques (ou les masquer)

**Effort estimé :** 2-3 jours  
**Fichiers :** `app/admin/contenu/page.tsx`, `app/actions/data.ts`

---

### Epic 6 — Admin : Suppression Agents Hermes [P1]
**Actuel :** Page entièrement hardcodée avec 8 agents fictifs et stats inventées.

**TODO :**
- [ ] **Décision : supprimer la page** pour le MVP (pas de backend d'agents automatisés)
- [ ] Retirer `app/admin/agents/page.tsx`
- [ ] Retirer "Agents Hermes" du menu admin (`AdminLayoutClient.tsx`)
- [ ] Nettoyer les références agents dans `admin/page.tsx` et `admin/analytics/page.tsx`
- [ ] Nettoyer les toggles agents dans `admin/parametres/page.tsx`

**Alternative (si on garde) :** implémenter un vrai système de jobs (BullMQ/QStash) avec table `AgentJob`. Effort : 1-2 semaines. **Non recommandé pour le MVP.**

**Effort estimé :** 0.5 jour (suppression)  
**Fichiers :** `app/admin/agents/page.tsx`, `components/layout/AdminLayoutClient.tsx`, `app/admin/page.tsx`, `app/admin/analytics/page.tsx`

---

### Epic 7 — Analytics Temps Réel [P1]
**Actuel :** Données hardcodées dans `admin/analytics/page.tsx` (`MONTHLY`, `CHANNEL_DATA`). Espace pro analytics a des données réelles mais variations statiques.

**TODO :**
- [ ] Remplacer `MONTHLY` par une requête Prisma agrégée (`GROUP BY month` sur `Lead`)
- [ ] Remplacer `CHANNEL_DATA` par agrégation sur `lead.source`
- [ ] Connecter le sélecteur de période (7j / 30j / 6 mois / 1 an)
- [ ] Espace pro : calculer les variations % vs période précédente
- [ ] Admin : calculer l'ARR réel depuis les subscriptions

**Effort estimé :** 2 jours  
**Fichiers :** `app/admin/analytics/page.tsx`, `app/espace-pro/analytics/page.tsx`, `app/actions/data.ts`

---

### Epic 8 — Espace Propriétaire : Mon Projet Dynamique [P1]
**Actuel :** Estimation aides fixe à 3900€. Calendrier prévisionnel statique.

**TODO :**
- [ ] Enrichir `calculateSubsidy()` dans `lib/utils.ts` avec les vraies règles 2024-2025
- [ ] Connecter le calcul aux données du lead (type de travaux, revenus, âge du bien)
- [ ] Afficher le détail par aide (MaPrimeRénov', CEE, Éco-PTZ, TVA réduite)
- [ ] Calendrier prévisionnel dynamique selon le type de travaux
- [ ] Permettre la modification du projet (met à jour le lead)

**Effort estimé :** 2 jours  
**Fichiers :** `app/espace-proprietaire/mon-projet/page.tsx`, `lib/utils.ts`

---

### Epic 9 — Seed & Données Référentielles [P1]
**Actuel :** `Department` non seedé. `getDepartments()` retourne un tableau vide.

**TODO :**
- [ ] Ajouter les 101 départements français dans `prisma/seed.ts`
- [ ] Ajouter un script de vérification post-seed (`npm run db:verify`)
- [ ] Seed de données de test pour `Subscription` et `Message` (facultatif)

**Effort estimé :** 0.5 jour  
**Fichiers :** `prisma/seed.ts`

---

### Epic 10 — Clean Code & a11y [P2]
**Le TODO.md du repo identifie :**
- 5 labels sans `htmlFor` associé
- Divs cliquables sans `role="button"` / `tabIndex`
- `console.log` dans `lib/data/*`
- Code mort potentiel

**TODO :**
- [ ] Corriger les warnings ESLint (12 actuellement)
- [ ] Ajouter `aria-live` pour les messages d'erreur du wizard
- [ ] Vérifier le contraste des couleurs
- [ ] Supprimer les `console.log` de debug
- [ ] Vérifier et supprimer le code mort

**Effort estimé :** 1 jour  
**Fichiers :** Multiple

---

### Epic 11 — Paramètres Fonctionnels (Pro + Admin) [P2]
**Actuel :** Tous les formulaires de paramètres sont statiques (boutons "Enregistrer" décoratifs).

**TODO :**
- [ ] **Admin** : Connecter les formulaires à la table `Setting` (créer `getSetting`, `updateSetting`)
- [ ] **Pro** : Connecter les préférences leads (rayon, budget min, types de travaux) à `ArtisanCompany` ou `Profile`
- [ ] **Pro** : Sécurité — changer de mot de passe via Supabase Auth
- [ ] **Propriétaire** : Connecter le compte à `updateProfileForm`

**Effort estimé :** 2-3 jours  
**Fichiers :** `app/admin/parametres/page.tsx`, `app/espace-pro/parametres/page.tsx`, `app/espace-proprietaire/compte/page.tsx`

---

### Epic 12 — Tests & Qualité [P2]
**Actuel :** 17 tests (4 unitaires + 13 E2E). Couverture faible sur les server actions et espaces protégés.

**TODO :**
- [ ] Tests unitaires des Server Actions (`login`, `signup`, `submitLead`, `updateLeadStatus`)
- [ ] Tests E2E : profil artisan, messagerie, gestion leads
- [ ] Tests E2E : middleware RBAC (USER → /admin = redirect)
- [ ] CI/CD GitHub Actions (lint → test unit → build → test E2E)

**Effort estimé :** 2-3 jours  
**Fichiers :** `__tests__/`, `e2e/`, `.github/workflows/`

---

## 6. 📋 Roadmap suggérée

### Sprint 1 — Core fonctionnel (semaines 1-2)
| Epic | Focus |
|------|-------|
| #1 | Profil Artisan (action déjà existante, juste à brancher) |
| #2 | Messagerie (créer `sendMessage` + brancher UI) |
| #3 | Gestion Leads (aligner statuts + connecter select + notes) |
| #9 | Seed departments |

### Sprint 2 — Admin & Polish (semaines 3-4)
| Epic | Focus |
|------|-------|
| #4 | CRUD Artisans réel |
| #5 | Gestion du contenu (CRUD articles) |
| #6 | Suppression Agents Hermes |
| #7 | Analytics temps réel |

### Sprint 3 — Propriétaire & Qualité (semaines 5-6)
| Epic | Focus |
|------|-------|
| #8 | Mon projet dynamique |
| #11 | Paramètres fonctionnels |
| #10 | Clean code & a11y |
| #12 | Tests E2E complémentaires |

---

## 7. Résumé des fichiers critiques à modifier

```
app/
├── espace-pro/
│   ├── profil/page.tsx              → Epic #1 (brancher updateArtisanProfileForm)
│   ├── leads/page.tsx               → Epic #3 (aligner statuts, connecter select, notes)
│   ├── messages/page.tsx            → Epic #2 (brancher sendMessage)
│   └── parametres/page.tsx          → Epic #11
├── espace-proprietaire/
│   ├── mon-projet/page.tsx          → Epic #8 (calculateSubsidy dynamique)
│   ├── messages/page.tsx            → Epic #2 (brancher sendMessage)
│   └── compte/page.tsx              → Epic #11 (brancher updateProfileForm)
├── admin/
│   ├── artisans/page.tsx            → Epic #4 (getAllArtisanCompanies)
│   ├── contenu/page.tsx             → Epic #5 (CRUD articles)
│   ├── agents/page.tsx              → Epic #6 (SUPPRIMER)
│   ├── analytics/page.tsx           → Epic #7 (requêtes Prisma)
│   ├── parametres/page.tsx          → Epic #11 (table Setting)
│   └── page.tsx                     → Epic #6 (nettoyer refs agents)
├── actions/
│   └── data.ts                      → Epics #1, #2, #4, #5, #11
prisma/
├── schema.prisma                    → Epic #3 (lead notes), Epic #6 (optionnel)
└── seed.ts                          → Epic #9 (departments)
lib/
├── utils.ts                         → Epic #8 (calculateSubsidy)
└── data/
    ├── db.ts                        → Epic #4, #5
    └── dashboard.ts                 → Epic #7
```

---

## 8. Comparaison avec le TODO.md existant

Le `TODO.md` du repo met l'accent sur :
1. **Infrastructure / env vars** → Nécessaire pour le déploiement, pas pour le dev local
2. **Dashboard mocks → réel** → Partiellement résolu (dashboard privé utilise déjà `lib/data/dashboard.ts` avec fallback)
3. **Sécurité hardening** → CSP et HSTS déjà présents dans `next.config.js`
4. **a11y & clean code** → Couvert par l'Epic #10
5. **Tests** → Couvert par l'Epic #12
6. **Features métier** → Trop vague ; mon analyse la décompose en epics actionnables

**Ce que le TODO.md a oublié :**
- Le décalage des statuts leads (bug silencieux)
- La messagerie sans envoi (P0)
- Le profil artisan hardcodé (P0)
- La suppression des agents Hermes (P1)
- Les tables orphelines dans Prisma

---

*Document mis à jour après relecture complète du repo GitHub. Dernière mise à jour : 2026-05-01.*
