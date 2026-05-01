# 🔬 ANALYSE COMPLÈTE — ÉTAT DU PROJET RENOMAG

> Date d'analyse : 2026-05-01
> Branche : `feature/dashboard-prive`
> Dernier commit : `2407195` — "feat: implement 12 epics"

---

## 📊 RÉSUMÉ EXÉCUTIF

Le projet RENOMAG est une **marketplace de rénovation énergétique** (type Effy/MaPrimeRénov') construite avec **Next.js 14 App Router**, **Prisma**, **Supabase**, **Tailwind + shadcn/ui**.

**Bilan :**
- ✅ **Infrastructure solide** : Auth, DB, Cache, Rate-limiting, Emails, Search, Analytics, PWA
- ✅ **Site public avancé** (~95%) : Homepage, Annuaire, Blog, Devis, SEO
- ✅ **12 EPICS majeurs implémentés** dans le commit `2407195`
- ⚠️ **Mais** : plusieurs features métier critiques manquent encore pour un MVP production-ready
- ⚠️ **Schema Prisma** : manque des modèles essentiels (Paiement, Devis, Projet, Document)
- ⚠️ **Tests** : très peu de couverture (17 tests seulement)
- ⚠️ **Déploiement** : non vérifié en production

---

## ✅ CE QUI EST DÉJÀ FAIT (Commit 2407195)

### EPICS IMPLÉMENTÉS (12/12 du V2)

| # | Epic | Statut | Détails |
|---|------|--------|---------|
| 1 | **Profil Artisan Connecté** | ✅ FAIT | Page `espace-pro/profil` en Server Component, données réelles, score dynamique, upload logo/galerie |
| 2 | **Messagerie Interactive** | ✅ FAIT | `ChatApp.tsx` partagé, `sendMessage` + `markMessagesAsRead`, fonctionne côté pro & propriétaire |
| 3 | **Gestion des Leads Artisan** | ✅ FAIT | `updateLeadStatus`, `updateLeadNotes`, mapping statut UI ↔ DB, `useTransition` |
| 4 | **Admin : CRUD Artisans** | ✅ FAIT | `getAllArtisanCompanies()`, stats réelles (COUNT), `updateArtisanStatus` |
| 5 | **Admin : Gestion Contenu (Blog)** | ✅ FAIT | `ArticleForm.tsx`, `createArticle`, `updateArticle`, `deleteArticle` |
| 6 | **Admin : Suppression Agents Hermes** | ✅ FAIT | `app/admin/agents/page.tsx` SUPPRIMÉ, menu nettoyé |
| 7 | **Analytics Temps Réel** | ✅ FAIT | `MONTHLY` via `GROUP BY` Prisma, `CHANNEL_DATA` via agrégation `lead.source` |
| 8 | **Propriétaire : Mon Projet Dynamique** | ✅ FAIT | `ProjectSubsidy.tsx`, `calculateSubsidy()` enrichi |
| 9 | **Seed & Données Référentielles** | ✅ FAIT | 101 départements français dans `prisma/seed.ts` |
| 10 | **Clean Code & a11y** | 🟡 PARTIEL | Quelques `htmlFor` fixés, mais ~11 `console.log` restent, ESLint non vérifié |
| 11 | **Paramètres Fonctionnels** | ✅ FAIT | Admin (`Setting` table), Pro (`updateArtisanProfileForm`), Propriétaire (`updateProfileForm`) |
| 12 | **Tests & Qualité** | 🟡 PARTIEL | Quelques tests unitaires mis à jour, mais **pas de CI/CD GitHub Actions** |

### INFRASTRUCTURE DÉJÀ EN PLACE

- [x] Next.js 14 + TypeScript strict + Tailwind
- [x] Prisma + PostgreSQL (Supabase)
- [x] Supabase Auth (email + Google OAuth)
- [x] RBAC middleware (ADMIN / ARTISAN / USER)
- [x] Rate limiting (Upstash Redis + fallback mémoire)
- [x] Emails transactionnels (Resend)
- [x] Upload fichiers (Supabase Storage)
- [x] Search full-text (Meilisearch)
- [x] Analytics (PostHog)
- [x] Error tracking (Sentry)
- [x] PWA (manifest + Service Worker)
- [x] i18n (next-intl, locale fixé à `fr`)
- [x] Logging (Pino)
- [x] Sécurité : CSP, HSTS, X-Frame-Options dans `next.config.js`
- [x] SEO : sitemap dynamique, robots.txt, JSON-LD
- [x] Dashboard privé séparé (auth cookie)

---

## 🔴 EPICS / MANQUANTS CRITIQUES (P0 — À FAIRE AVANT PROD)

### 🔴 EPIC 13 — Système de Paiement & Abonnements
**Pourquoi critique** : Le modèle `Subscription` existe mais **aucune logique de paiement** n'est implémentée. Les artisans ne peuvent pas payer.

**Manquants :**
- [ ] Intégration **Stripe** (ou Mollie) — Checkout, webhooks
- [ ] `Customer` / `Price` / `Product` models ou gestion via Stripe
- [ ] Webhook route `app/api/webhooks/stripe/route.ts`
- [ ] Gestion des plans (Free / Basic / Premium) avec features gating
- [ ] Factures / historique de paiement
- [ ] Quota de leads par plan (ex: Free = 3 leads/mois, Premium = illimité)
- [ ] Page `espace-pro/abonnement` 100% fonctionnelle
- [ ] Renouvellement / expiration automatique

**Effort estimé** : 3-4 jours

---

### 🔴 EPIC 14 — Génération & Gestion des Devis (Quotes)
**Pourquoi critique** : Le formulaire de devis crée un `Lead`, mais il n'y a **aucun modèle Devis**. Un artisan ne peut pas créer un devis structuré.

**Manquants :**
- [ ] Nouveau modèle Prisma `Quote` (lignes, prix unitaires, total HT/TTC)
- [ ] Nouveau modèle `QuoteLineItem` (désignation, quantité, prix unitaire, total)
- [ ] Server Action `createQuote(leadId, lines[])`
- [ ] Server Action `sendQuote(quoteId)` → envoie email au propriétaire
- [ ] Page/Modal dans `espace-pro/leads` pour créer un devis
- [ ] Page dans `espace-proprietaire` pour voir les devis reçus
- [ ] Acceptation / refus de devis par le propriétaire
- [ ] Template email "Nouveau devis reçu"
- [ ] PDF generation du devis (Puppeteer / Playwright / react-pdf)

**Effort estimé** : 4-5 jours

---

### 🔴 EPIC 15 — Modèle Projet & Cycle de Vie
**Pourquoi critique** : Un `Lead` n'est qu'une demande. Il faut un objet `Project` pour suivre les travaux de A à Z.

**Manquants :**
- [ ] Modèle Prisma `Project` (lié à `Lead`, `User`, `ArtisanCompany`)
- [ ] Statuts projet : `QUOTE_REQUESTED` → `QUOTES_RECEIVED` → `QUOTE_ACCEPTED` → `WORK_SCHEDULED` → `IN_PROGRESS` → `COMPLETED` → `REVIEWED`
- [ ] Tableau de bord projet côté propriétaire
- [ ] Suivi d'avancement côté artisan
- [ ] Upload de documents (DPE, contrats, photos avant/après)
- [ ] Date de début / fin des travaux

**Effort estimé** : 3-4 jours

---

### 🔴 EPIC 16 — Matching / Distribution Automatique des Leads
**Pourquoi critique** : Actuellement `Lead.artisanId` est nullable. Aucun algorithme n'assigne les leads aux artisans.

**Manquants :**
- [ ] Algorithme de matching : géolocalisation (rayon en km) + spécialité + disponibilité
- [ ] Géocodage des adresses (Google Maps / Mapbox API)
- [ ] Modèle `LeadAssignment` (historique des assignments)
- [ ] Notification email "Nouveau lead compatible" aux artisans
- [ ] Limite de leads par artisan selon abonnement
- [ ] Page "Mes leads potentiels" pour les artisans

**Effort estimé** : 3-4 jours

---

## 🟠 EPICS IMPORTANTS (P1)

### 🟠 EPIC 17 — Documents & Fichiers Structurés
**Manquants :**
- [ ] Modèle `Document` (type: DPE, DEVIS, CONTRAT, PHOTO, FACTURE)
- [ ] Upload multi-fichiers par projet
- [ ] Visualisation / téléchargement sécurisé
- [ ] Actuellement `gallery` est un `Json?` sur `ArtisanCompany` — à remplacer par une vraie relation

### 🟠 EPIC 18 — Notifications Push & Temps Réel
**Manquants :**
- [ ] Supabase Realtime **vraiment connecté** dans `ChatApp` (actuellement `router.refresh()`)
- [ ] Notifications push navigateur (Web Push API)
- [ ] Notifications in-app avec badge/compteur dynamique
- [ ] Sonner / toast sur nouveau message
- [ ] SMS (Twilio) pour alertes critiques

### 🟠 EPIC 19 — Système d'Avis Vérifiés (Reviews)
**Manquants :**
- [ ] `Review.userId` (actuellement `author` est un string anonyme)
- [ ] Vérification que le reviewer a bien eu un projet avec l'artisan
- [ ] Modération admin des avis
- [ ] Photo avant/après dans les avis
- [ ] Calcul auto de la note moyenne

### 🟠 EPIC 20 — CRM / Suivi des Contacts (Follow-ups)
**Manquants :**
- [ ] Modèle `ContactAttempt` (appel, email, visite)
- [ ] Timeline d'activité par lead
- [ ] Rappels / tâches pour les artisans
- [ ] Notes structurées (pas juste un champ `notes` texte)

### 🟠 EPIC 21 — Analytics & KPIs Avancés
**Manquants :**
- [ ] Table `KPI` toujours inutilisée — créer un job d'agrégation quotidien
- [ ] Funnels de conversion (visiteur → devis → lead → devis signé → projet)
- [ ] Analytics côté artisan : taux de conversion, revenu estimé
- [ ] Export CSV/PDF des rapports
- [ ] Période selector 7j/30j/6m/1an (UI probablement en place mais à vérifier)

### 🟠 EPIC 22 — Favoris & Partages
**Manquants :**
- [ ] Modèle `Favorite` (User ↔ ArtisanCompany)
- [ ] Modèle `FavoriteArticle` (User ↔ Article)
- [ ] Bouton "Ajouter aux favoris" sur les fiches artisans
- [ ] Page "Mes artisans favoris" côté propriétaire

### 🟠 EPIC 23 — Recherche & Annuaire Avancé
**Manquants :**
- [ ] Carte interactive (Leaflet / Mapbox) avec géolocalisation des artisans
- [ ] Recherche par distance ("artisans à moins de 30km")
- [ ] Autocomplétion d'adresse (Google Places / Mapbox Geocoding)
- [ ] Filtres avancés : disponibilité, prix moyen, certifications multiples
- [ ] Meilisearch **auto-indexation** (actuellement manuel ?)

### 🟠 EPIC 24 — Internationalisation Complète
**Manquants :**
- [ ] `messages/en.json` existe mais **toutes les pages ne sont pas traduites**
- [ ] Contenu du blog en anglais
- [ ] SEO multilingue (hreflang)
- [ ] Détection auto de la langue

---

## 🟡 AMÉLIORATIONS TECHNIQUES (P2)

### 🟡 EPIC 25 — Clean Code & Dette Technique
- [ ] Supprimer les **mock fallbacks** dans `lib/data/db.ts` et `lib/data/dashboard.ts` (ou les garder derrière `NODE_ENV === 'development'` avec warnings)
- [ ] Nettoyer les **11+ `console.log/error`** dans `app/actions/*.ts`
- [ ] Unifier le handling d'erreurs dans les Server Actions (mix de strings, throws, `{success,error}`)
- [ ] Dedupliquer `changePassword` (existe dans `auth.ts` ET `data.ts`)
- [ ] Dedupliquer `submitLead` (existe dans `data.ts` ET `leads.ts`)
- [ ] Supprimer `OutreachCampaign` et `OutreachContact` du schema + migration
- [ ] Ajouter `receiver` relation dans `Message` (actuellement `receiverId` sans `@relation`)
- [ ] Soft delete (`deletedAt`) sur les modèles clés
- [ ] Audit fields (`createdBy`, `updatedBy`)

### 🟡 EPIC 26 — Tests & CI/CD
- [ ] **Unit tests** pour toutes les Server Actions (`login`, `signup`, `submitLead`, `sendMessage`, `updateLeadStatus`, etc.)
- [ ] **E2E** : messagerie complète, édition profil artisan, gestion leads, CRUD admin
- [ ] **E2E** : flow de paiement (Stripe test mode)
- [ ] **Mock** Redis / Supabase pour les tests unitaires
- [ ] **GitHub Actions** workflow : lint → unit tests → build → E2E
- [ ] Coverage report (CodeCov / Coveralls)

### 🟡 EPIC 27 — Performance & Cache
- [ ] **Cache invalidation** automatique après mutations (actuellement jamais invalidé)
- [ ] React Server Components + Streaming
- [ ] Image optimization (Sharp / CDN)
- [ ] Pagination côté serveur pour tous les listings (admin leads, artisans, messages)
- [ ] Débounce sur les recherches annuaire

### 🟡 EPIC 28 — Sécurité & Conformité
- [ ] RGPD : export des données personnelles (`/api/gdpr/export`)
- [ ] RGPD : anonymisation / suppression de compte avec cascade
- [ ] 2FA (TOTP) pour les comptes admin
- [ ] Rate limiting sur les uploads
- [ ] Scan anti-virus sur les uploads
- [ ] CSP plus strict (actuellement présent mais à durcir)

### 🟡 EPIC 29 — Monitoring & Ops
- [ ] Health check déjà présent (`/api/health`) — à enrichir avec Stripe, Meilisearch
- [ ] Alerts (Sentry alerts, Uptime monitoring)
- [ ] DB backups automatisés (Supabase le fait déjà)
- [ ] Log aggregation structurée

---

## 🔵 FEATURES AVANCÉES (POST-MVP)

### 🔵 EPIC 30 — Intelligence Artificielle
- [ ] Chatbot RAG pour guider les propriétaires (base de connaissances articles)
- [ ] Génération automatique de descriptions d'artisans
- [ ] Scoring de leads avancé (ML)
- [ ] Matching intelligent artisan-projet

### 🔵 EPIC 31 — Programme de Parrainage
- [ ] Modèle `Referral`
- [ ] Code unique par artisan
- [ ] Crédits offerts pour parrainage

### 🔵 EPIC 32 — Marketplace Multi-Regions
- [ ] Support DOM-TOM
- [ ] i18n espagnol, italien (marchés européens)

---

## 📋 SCHEMA PRISMA — MODÈLES MANQUANTS

### À ajouter impérativement :

```prisma
// P0 — Devis structuré
model Quote {
  id          String      @id @default(uuid())
  leadId      String
  artisanId   String
  status      QuoteStatus @default(DRAFT)
  totalHT     Float
  totalTTC    Float
  tvaRate     Float       @default(0.20)
  validityDays Int        @default(30)
  notes       String?
  acceptedAt  DateTime?
  rejectedAt  DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  lead        Lead        @relation(fields: [leadId], references: [id])
  artisan     ArtisanCompany @relation(fields: [artisanId], references: [id])
  lineItems   QuoteLineItem[]
}

model QuoteLineItem {
  id          String   @id @default(uuid())
  quoteId     String
  designation String
  quantity    Float
  unitPrice   Float
  total       Float
  quote       Quote    @relation(fields: [quoteId], references: [id])
}

enum QuoteStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
  EXPIRED
}

// P0 — Projet de rénovation
model Project {
  id          String        @id @default(uuid())
  leadId      String        @unique
  ownerId     String
  artisanId   String
  status      ProjectStatus @default(QUOTE_REQUESTED)
  startDate   DateTime?
  endDate     DateTime?
  finalPrice  Float?
  rating      Int?
  review      String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  lead        Lead          @relation(fields: [leadId], references: [id])
  owner       User          @relation(fields: [ownerId], references: [id])
  artisan     ArtisanCompany @relation(fields: [artisanId], references: [id])
  documents   Document[]
}

enum ProjectStatus {
  QUOTE_REQUESTED
  QUOTES_RECEIVED
  QUOTE_ACCEPTED
  WORK_SCHEDULED
  IN_PROGRESS
  COMPLETED
  REVIEWED
  CANCELLED
}

// P0 — Paiement Stripe
model Payment {
  id            String   @id @default(uuid())
  stripePaymentId String @unique
  userId        String
  amount        Float
  currency      String   @default("EUR")
  status        String
  description   String?
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id])
}

// P1 — Documents structurés
model Document {
  id          String       @id @default(uuid())
  projectId   String?
  artisanId   String?
  userId      String?
  type        DocumentType
  name        String
  url         String
  size        Int?
  mimeType    String?
  createdAt   DateTime     @default(now())
  project     Project?     @relation(fields: [projectId], references: [id])
}

enum DocumentType {
  DPE
  DEVIS
  CONTRAT
  FACTURE
  PHOTO_AVANT
  PHOTO_APRES
  CERTIFICATION
  OTHER
}

// P1 — Favoris
model Favorite {
  id        String   @id @default(uuid())
  userId    String
  artisanId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  artisan   ArtisanCompany @relation(fields: [artisanId], references: [id])
  @@unique([userId, artisanId])
}

// P1 — Historique d'assignation des leads
model LeadAssignment {
  id         String   @id @default(uuid())
  leadId     String
  artisanId  String
  assignedAt DateTime @default(now())
  accepted   Boolean?
  acceptedAt DateTime?
  reason     String?
}

// P1 — Tentatives de contact CRM
model ContactAttempt {
  id          String   @id @default(uuid())
  leadId      String
  artisanId   String
  type        String   // CALL, EMAIL, VISIT, SMS
  notes       String?
  outcome     String?  // ANSWERED, NO_ANSWER, MEETING_SCHEDULED
  createdAt   DateTime @default(now())
}

// P2 — Audit log
model AuditLog {
  id        String   @id @default(uuid())
  userId    String?
  action    String
  entity    String
  entityId  String?
  oldValue  String?
  newValue  String?
  ip        String?
  createdAt DateTime @default(now())
}
```

### À supprimer :
- [ ] `OutreachCampaign` (jamais utilisé)
- [ ] `OutreachContact` (jamais utilisé)
- [ ] `KPI` (inutilisé — remplacer par agrégations dynamiques ou un vrai système)

---

## 🗺️ ROADMAP RECOMMANDÉE

### Phase 1 — MVP Production (Semaines 1-3)
**Objectif : Mettre en ligne un produit qui génère des revenus**

1. **Stripe & Abonnements** (EPIC 13)
2. **Matching / Distribution des leads** (EPIC 16)
3. **Nettoyage technique** (EPIC 25 — mocks, console.log, OutreachCampaign)
4. **Tests E2E critiques** (EPIC 26 — auth, devis, paiement)
5. **Déploiement Vercel + vérification prod**

### Phase 2 — Cycle de Vie Complet (Semaines 4-6)
**Objectif : Un propriétaire peut passer de la demande à l'avis**

6. **Modèle Projet** (EPIC 15)
7. **Génération de Devis** (EPIC 14)
8. **Documents & Uploads** (EPIC 17)
9. **Avis Vérifiés** (EPIC 19)
10. **Notifications Push** (EPIC 18)

### Phase 3 — Scale & Optimisation (Semaines 7-8)
**Objectif : Robustesse et conversion**

11. **Carte interactive & recherche avancée** (EPIC 23)
12. **Favoris** (EPIC 22)
13. **CRM / Follow-ups** (EPIC 20)
14. **Analytics avancés** (EPIC 21)
15. **CI/CD + Coverage** (EPIC 26)

### Phase 4 — International & AI (Semaines 9-12)
**Objectif : Expansion**

16. i18n complète (EPIC 24)
17. Chatbot RAG (EPIC 30)
18. Programme de parrainage (EPIC 31)

---

## ⚠️ RISQUES IDENTIFIÉS

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Mock fallback masque des bugs DB | Élevée | Élevé | Supprimer les fallbacks en prod |
| Aucun paiement = pas de revenus | Certain | Critique | Prioriser Stripe |
| Pas de matching = artisans insatisfaits | Élevée | Élevé | Algorithme de base rapidement |
| Faible couverture de tests | Élevée | Moyen | E2E sur les flows critiques avant prod |
| Double source de vérité (Prisma vs Supabase) | Moyenne | Élevé | Normaliser sur Prisma uniquement |
| Cache jamais invalidé | Élevée | Moyen | Ajouter `revalidateTag` / `deleteCache` après mutations |

---

## 📁 FICHIERS CLÉS À MODIFIER (Par Priorité)

### P0
```
prisma/schema.prisma              → Ajouter Quote, Project, Payment, Document, Favorite
app/api/webhooks/stripe/          → NOUVEAU
app/espace-pro/abonnement/        → Connecter Stripe
lib/data/db.ts                    → Supprimer fallback mocks
lib/data/dashboard.ts             → Supprimer fallback mocks
```

### P1
```
app/actions/data.ts               → Splitter / dédupliquer
app/espace-pro/leads/             → Ajouter création devis
app/espace-proprietaire/          → Ajouter "Mes devis", "Mes projets"
components/messages/ChatApp.tsx   → Connecter Supabase Realtime
```

### P2
```
.github/workflows/ci.yml          → NOUVEAU
__tests__/                        → Ajouter tests Server Actions
app/api/gdpr/                     → NOUVEAU (export données)
```

---

## 🎯 PROCHAINES ACTIONS IMMÉDIATES (Si tu veux avancer demain)

1. **Commit & Push** le travail actuel (`git status` montrait des modifs — vérifie que tout est commit)
2. **Créer une branche** `feature/stripe-payments`
3. **Installer Stripe** : `npm install stripe @stripe/stripe-js`
4. **Créer la migration Prisma** avec `Quote`, `Project`, `Payment`
5. **Créer** `app/api/webhooks/stripe/route.ts` pour gérer les événements Stripe
6. **Connecter** la page `espace-pro/abonnement` à Stripe Checkout

---

*Fin du rapport. Ce document peut être mis à jour au fur et à mesure de l'avancement du projet.*
