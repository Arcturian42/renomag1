# 🎯 RENOMAG — Roadmap Technique

> Dernière mise à jour : 2026-05-01
> État actuel : Build ✅ | Tests ✅ | TS 0 erreur | 12 warnings ESLint

---

## 🔴 EPIC 1 — Production Infrastructure
**Objectif** : Passer du mode développement (mocks) à une application connectée et déployée.

- [ ] **1.1** Créer `.env.local` avec toutes les variables requises
  - `DATABASE_URL` (PostgreSQL Supabase)
  - `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
  - `NEXT_PUBLIC_SITE_URL`
- [ ] **1.2** Créer `.env.example` (template sans valeurs sensibles)
- [ ] **1.3** Lancer `npx prisma migrate dev` pour créer les tables
- [ ] **1.4** Lancer `npm run db:seed` pour peupler la base
- [ ] **1.5** Vérifier que `lib/data/db.ts` utilise bien Prisma et non plus les mocks
- [ ] **1.6** Déployer sur Vercel avec les env vars configurées
- [ ] **1.7** Vérifier le rate limiting Upstash en production (tester `submitLead`)

**Dépendances** : Aucune (peut être fait immédiatement)

---

## 🔴 EPIC 2 — Dashboard & Data Layer (Mocks → Réel)
**Objectif** : Remplacer toutes les données mockées par des requêtes Prisma.

- [ ] **2.1** Analyser `lib/dashboard-data.ts` (500 lignes de mocks)
  - Identifier toutes les fonctions mockées
  - Mapper les modèles Prisma correspondants
- [ ] **2.2** Créer `lib/data/dashboard.ts` — requêtes Prisma pour :
  - Stats globales (leads, artisans, revenus)
  - Liste utilisateurs avec pagination/filtres
  - Détail utilisateur
  - Graphiques (évolution mensuelle, pipeline)
- [ ] **2.3** Adapter `app/dashboard-prive/*` pour utiliser les nouvelles requêtes
- [ ] **2.4** Supprimer `lib/dashboard-data.ts` quand tout est migré
- [ ] **2.5** Harmoniser `app/actions/leads.ts` — utiliser Prisma au lieu de Supabase direct

**Dépendances** : EPIC 1 (DB connectée)

---

## 🟠 EPIC 3 — Sécurité Hardening
**Objectif** : Sécuriser l'application au niveau production.

- [ ] **3.1** Ajouter CSP headers dans `next.config.js`
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline'` (pour Next.js)
  - `img-src 'self' data: https://*.unsplash.com https://ui-avatars.com`
  - `connect-src 'self' https://*.supabase.co https://*.upstash.io`
- [ ] **3.2** Ajouter HSTS header (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`)
- [ ] **3.3** Ajouter `Permissions-Policy` header
- [ ] **3.4** Implémenter un mécanisme de resync du rôle Prisma → Supabase metadata
  - Hook post-login ou cron pour s'assurer que `user_metadata.role` est à jour
- [ ] **3.5** Ajouter validation côté serveur sur toutes les Server Actions (pas seulement `submitLead`)
- [ ] **3.6** Mettre en place Sentry ou Vercel Analytics pour le monitoring d'erreurs

**Dépendances** : Aucune (hors 3.6 qui peut attendre le déploiement)

---

## 🟠 EPIC 4 — Accessibilité (a11y) & Clean Code
**Objectif** : Passer à 0 warning ESLint et respecter WCAG 2.1 AA.

- [ ] **4.1** Corriger les 5 labels sans `htmlFor` associé
  - `app/espace-pro/parametres/page.tsx`
  - `components/directory/AnnuaireFilters.tsx` (×2)
  - `app/(public)/devis/components/steps/LogementStep.tsx`
- [ ] **4.2** Corriger les divs cliquables sans `role="button"` / `tabIndex` / keyboard listener
  - `components/dashboard/DashboardMobileWrapper.tsx`
- [ ] **4.3** Remplacer les `console.log` par un vrai logger ou les supprimer
  - `lib/dashboard-data.ts` (×5)
- [ ] **4.4** Supprimer le code mort
  - `components/devis/steps/` (5 fichiers non utilisés)
  - Vérifier `components/directory/AnnuaireSearchBar.tsx` et `AnnuaireSidebar.tsx`
- [ ] **4.5** Ajouter `aria-live` pour les messages d'erreur du wizard de devis
- [ ] **4.6** Vérifier le contraste des couleurs (primary-500 sur fond blanc)

**Dépendances** : Aucune

---

## 🟡 EPIC 5 — Tests & Qualité
**Objectif** : Augmenter la couverture de tests et la confiance dans les déploiements.

- [ ] **5.1** Tests unitaires Server Actions
  - `submitLead` (validation Zod, rate limiting, insertion)
  - `createUserInDb` (création, doublon, rôle)
- [ ] **5.2** Tests E2E middleware RBAC
  - USER tente d'accéder à `/admin` → redirect
  - ARTISAN tente d'accéder à `/espace-proprietaire` → redirect
  - ADMIN accède à `/espace-proprietaire` → OK
- [ ] **5.3** Tests E2E dashboard privé
  - Login avec mauvais mot de passe
  - Navigation entre les pages du dashboard
  - Accès aux données sensibles
- [ ] **5.4** Tests E2E annuaire (filtres + pagination)
  - Filtrer par spécialité
  - Filtrer par région
  - Pagination
  - Recherche textuelle
- [ ] **5.5** CI/CD GitHub Actions
  - Workflow : lint → test unit → build → test E2E

**Dépendances** : EPIC 4 (code stable) pour éviter les tests sur du code mort

---

## 🟡 EPIC 6 — Features Métier
**Objectif** : Améliorer l'expérience utilisateur et la valeur produit.

- [ ] **6.1** Annuaire — Carte géographique des artisans (Leaflet/Mapbox)
- [ ] **6.2** Blog — Recherche full-text + filtres par catégorie
- [ ] **6.3** Devis — Envoi d'email de confirmation au user + notification aux artisans
- [ ] **6.4** Devis — Upload de photos/documents (Supabase Storage)
- [ ] **6.5** Espace Pro — Messagerie temps réel (Supabase Realtime)
- [ ] **6.6** Admin — Tableau de bord avec graphiques Recharts
- [ ] **6.7** SEO — Breadcrumb schema + canonical URLs dynamiques
- [ ] **6.8** i18n — Internationalisation si cible hors France

**Dépendances** : EPIC 1 + 2 (data réelle nécessaire)

---

## 📊 Priorisation

| Priorité | Epic | Impact | Effort | Raison |
|----------|------|--------|--------|--------|
| **P0** | 1 — Infrastructure | Critique | Moyen | Sans DB, c'est du faux |
| **P0** | 2 — Dashboard Data | Critique | Élevé | Le cœur métier est inutilisable |
| **P1** | 3 — Sécurité | Haut | Moyen | Obligatoire avant traffic réel |
| **P1** | 4 — a11y & Clean Code | Moyen | Faible | Rapide à faire, image pro |
| **P2** | 5 — Tests | Haut | Moyen | Sécurise les futures évolutions |
| **P3** | 6 — Features | Variable | Variable | Une fois la base solide |

---

## 🚧 En cours / Bloquant

| Problème | Statut | Bloque |
|----------|--------|--------|
| `DATABASE_URL` manquante | ❌ Non résolu | EPIC 1, 2, 6 |
| `UPSTASH_REDIS` manquant | ❌ Non résolu | Rate limiting en prod |
| Dashboard en mocks | 🟡 Partiel | EPIC 2 |
| Code mort (`components/devis/steps/`) | 🟡 Identifié | EPIC 4 |
