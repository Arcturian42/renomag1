# RENOMAG — Guide de déploiement

## Prérequis

- Node.js 20+
- Compte [Vercel](https://vercel.com)
- Projet [Supabase](https://supabase.com) configuré
- (Optionnel) Compte [Upstash](https://upstash.com) pour Redis

---

## 1. Variables d'environnement

Copier `.env.example` vers `.env.local` et remplir toutes les valeurs :

```bash
cp .env.example .env.local
```

### Obligatoires

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `DATABASE_URL` | URL PostgreSQL (pooler Supabase) | Supabase → Settings → Database |
| `DIRECT_URL` | URL PostgreSQL direct (migrations) | Supabase → Settings → Database |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service (server-side uniquement) | Supabase → Settings → API |
| `NEXT_PUBLIC_APP_URL` | URL de l'application en production | `https://renomag.fr` |
| `DASHBOARD_PASSWORD` | Mot de passe du dashboard privé | Générer un hash fort |

### Optionnelles

| Variable | Description | Fallback |
|----------|-------------|----------|
| `UPSTASH_REDIS_REST_URL` | URL Upstash Redis | Pas de cache |
| `UPSTASH_REDIS_REST_TOKEN` | Token Upstash Redis | Pas de cache |
| `SENTRY_DSN` | DSN Sentry | Pas de monitoring |
| `LOG_LEVEL` | Niveau de log pino | `warn` en prod, `debug` en dev |

---

## 2. Configuration Supabase

### Auth → URL de redirection

Ajouter dans **Authentication → URL Configuration** :

- Site URL : `https://renomag.fr`
- Redirect URLs :
  - `https://renomag.fr/auth/callback`
  - `http://localhost:3000/auth/callback` (pour le dev)

### Auth → Providers → Google

1. Créer des credentials OAuth 2.0 dans [Google Cloud Console](https://console.cloud.google.com/)
2. Autoriser les redirect URIs :
   - `https://renomag.fr/auth/callback`
   - `http://localhost:3000/auth/callback`
3. Copier le **Client ID** et **Client Secret** dans Supabase

### Auth → Providers → Email

- Désactiver **Confirm email** si tu veux une inscription directe
- Ou laisser activé pour plus de sécurité

---

## 3. Base de données

### Générer le client Prisma

```bash
npx prisma generate
```

### Créer et appliquer les migrations

```bash
npx prisma migrate dev --name init
```

En production (Vercel Build Command inclut déjà `prisma generate`) :

```bash
npx prisma migrate deploy
```

> ⚠️ À exécuter une seule fois lors du premier déploiement ou après un changement de schema.

### Seed (données de démonstration)

```bash
npx prisma db seed
```

---

## 4. Déploiement Vercel

### Build Settings

Dans les paramètres du projet Vercel :

- **Framework Preset** : Next.js
- **Build Command** : `prisma generate && next build` (déjà configuré dans `package.json`)
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### Variables d'environnement Vercel

Importer toutes les variables de `.env.local` dans **Project Settings → Environment Variables**.

> 🔒 Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` ou `DASHBOARD_PASSWORD` côté client.

---

## 5. Vérification post-déploiement

### Healthcheck

```bash
curl https://renomag.fr/api/health
```

Attendu :
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "version": "1.0.0",
  "checks": {
    "database": "ok",
    "auth": "ok",
    "cache": "ok"
  }
}
```

### Vérifier les flows critiques

- [ ] Page d'accueil charge
- [ ] Annuaire affiche les artisans
- [ ] Inscription email fonctionne
- [ ] Connexion email fonctionne
- [ ] Google OAuth fonctionne
- [ ] Devis wizard soumet un lead
- [ ] Dashboard privé accessible avec le bon mot de passe
- [ ] Middleware redirige les non-authentifiés

---

## 6. Sécurité

### Content Security Policy

Les headers sont définis dans `next.config.js`. En production, vérifier dans les DevTools que :
- `connect-src` inclut bien ton domaine Supabase (`https://[project].supabase.co`)
- Aucune erreur CSP dans la console

### Headers de sécurité déjà configurés

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy` (voir `next.config.js`)

---

## 7. Mise à jour

```bash
# Pull des changements
git pull origin main

# Appliquer les migrations si le schema a changé
npx prisma migrate deploy

# Redéployer (Vercel le fait automatiquement sur push)
git push origin main
```

---

## 8. Dépannage

### Build échoue avec une erreur Prisma

```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Cache Redis ne fonctionne pas

- Vérifier `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`
- L'application fonctionne sans Redis (fallback mémoire)

### Google OAuth échoue

- Vérifier que l'URL `https://ton-site.fr/auth/callback` est dans Supabase ET Google Cloud Console
- Vérifier que le Client ID/Secret sont corrects

### Erreur "Code OAuth manquant"

Le callback `/auth/callback` attend un `?code=...` de Supabase. Si l'URL n'est pas configurée côté Supabase, la redirection échoue.
