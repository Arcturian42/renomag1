# 🔍 Prompt de vérification — RENOMAG + Supabase

> Objectif : Vérifier que l'application fonctionne correctement avec Supabase (DB + Auth) et résoudre tous les problèmes bloquants.

---

## 1. Vérifier la connexion base de données

**Fichiers à inspecter :**
- `.env` — doit contenir `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `prisma/schema.prisma` — vérifier que le `datasource db` utilise bien l'env var `DATABASE_URL`

**Actions :**
```bash
# Tester la connexion Prisma
npx prisma db pull
npx prisma migrate status
```

**Si échec :** Diagnostiquer pourquoi (firewall, mauvais host, mauvais mot de passe, port bloqué) et proposer une solution alternative (pooler Supabase, psql, TablePlus, etc.)

---

## 2. Vérifier les tables et le schéma

**Actions :**
```bash
npx prisma db pull --print | head -50
```

**Vérifier que ces tables existent :**
- `User`, `Profile`, `ArtisanCompany`, `Lead`, `Article`
- `Specialty`, `Certification`, `Review`, `Category`
- `Conversation`, `Message`, `Notification`, `Project`, `Quote`, `Subscription`, `Payment`, `Visit`, `AdminAction`
- `OutreachCampaign`, `OutreachContact`

**Si des tables manquent :** Générer le SQL de migration (`npx prisma migrate diff --from-empty --to-schema-datamodel`) et l'exécuter sur la base.

---

## 3. Vérifier les permissions `service_role`

**Test à faire via curl ou script Node.js :**
```bash
curl -s "https://[REF].supabase.co/rest/v1/User?limit=1" \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [SERVICE_ROLE_KEY]"
```

**Si "permission denied" :** Les tables créées manuellement n'ont pas les bons `GRANT`. Solutions :
- Option A : Exécuter `GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;` via psql/TablePlus
- Option B : Boucle PL/pgSQL via SQL Editor
- Option C : Changer l'owner des tables : `ALTER TABLE "User" OWNER TO service_role;`

---

## 4. Vérifier le data layer (fallback mock → Prisma)

**Fichiers à inspecter et tester :**
- `lib/data/db.ts` — `getArtisans()`, `getArticles()`, etc. Doivent essayer Prisma d'abord, fallback mock si échec.
- `lib/data/dashboard.ts` — `getUsers()`, `getLeads()`, `getKpis()`, etc. Même pattern.
- `lib/data/dashboard-mocks.ts` — Doit contenir les données mock de fallback.

**Test manuel :**
```bash
# Créer un script de test rapide
node -e "
const { getArtisans } = require('./lib/data/db.ts');
getArtisans().then(data => console.log('Artisans:', data.length)).catch(e => console.error(e));
"
```

**Si Prisma renvoie toujours les mocks :** Vérifier que `DATABASE_URL` est correcte et que la base contient des données (sinon le fallback se déclenche car `db.length === 0`).

---

## 5. Vérifier les Server Actions

**Fichiers à tester :**
- `app/actions/leads.ts` — `submitLead()`
  - Doit insérer via Prisma en priorité
  - Fallback Supabase si Prisma échoue
  - Rate limiting actif
  - Zod validation
- `app/actions/auth.ts` — `createUserInDb()`, `getUserRoleByEmail()`
  - Doit créer l'utilisateur dans Prisma avec le bon rôle
  - Doit synchroniser le rôle dans `user.user_metadata` de Supabase Auth

**Test E2E :** Soumettre un lead via le formulaire `/devis` et vérifier qu'il apparaît dans la base.

---

## 6. Vérifier le middleware RBAC

**Fichier :** `middleware.ts`

**Vérifications :**
- `supabase.auth.getUser()` récupère l'utilisateur
- `user.user_metadata.role` est lu correctement
- Redirection vers `/connexion` si non authentifié
- Redirection vers l'espace approprié si mauvais rôle
- `/admin` → ADMIN, `/espace-pro` → ARTISAN, `/espace-proprietaire` → USER/ADMIN

**Test E2E :**
- Se connecter en tant que USER → essayer d'accéder à `/admin` → doit rediriger
- Se connecter en tant que ADMIN → accéder à `/espace-proprietaire` → doit fonctionner

---

## 7. Vérifier le build et les tests

```bash
# TypeScript
npx tsc --noEmit

# Build
npm run build

# Tests unitaires
npm test

# Tests E2E
npx playwright test
```

**Tout doit passer.** Si un test échoue :
1. Lire le message d'erreur
2. Identifier si c'est un sélecteur cassé, un changement de UI, ou un vrai bug
3. Corriger le test ou le code source

---

## 8. Vérifier le seed

**Fichier :** `scripts/seed-supabase.ts`

**Si la base est vide :**
```bash
npx tsx scripts/seed-supabase.ts
```

**Si ça échoue avec "permission denied" :** Voir section 3 ci-dessus (permissions service_role).

**Si ça échoue avec "ON CONFLICT" :** Vérifier que les colonnes `slug` (Specialty) et `code` (Certification) ont bien des contraintes `@unique` dans `prisma/schema.prisma`.

---

## 9. Vérifier l'environnement

**Vérifier que ces fichiers existent et sont corrects :**
- `.env` — **NE DOIT PAS être commité** (vérifier `.gitignore`)
- `.env.example` — Doit contenir toutes les clés sans valeurs sensibles
- `.env.local` — Pour Next.js, doit charger les mêmes vars que `.env`

**Si `.env` est dans git :** Le retirer immédiatement avec `git rm --cached .env` et l'ajouter à `.gitignore`.

---

## Checklist finale

| # | Vérification | Status |
|---|-------------|--------|
| 1 | Connexion DB OK | ⬜ |
| 2 | Toutes les tables existent | ⬜ |
| 3 | Permissions service_role OK | ⬜ |
| 4 | Data layer utilise Prisma | ⬜ |
| 5 | submitLead insère en DB | ⬜ |
| 6 | Middleware RBAC fonctionne | ⬜ |
| 7 | Build + tests passent | ⬜ |
| 8 | Seed fonctionne (si base vide) | ⬜ |
| 9 | Aucun secret dans git | ⬜ |

---

## Règles

- **Ne jamais** committer `.env`, `.env.local`, ou tout fichier contenant des secrets.
- **Toujours** vérifier le build (`npm run build`) avant de considérer une tâche terminée.
- **Toujours** vérifier TypeScript (`npx tsc --noEmit`) après toute modification.
- **Toujours** vérifier que les tests passent (`npm test` + `npx playwright test`).
- Faire des **changements minimaux** pour résoudre un problème.
