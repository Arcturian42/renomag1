# Admin Dashboard Setup

## Setting Up Admin User

The admin dashboard is accessible at `/admin` and requires the `ADMIN` role.

### Option 1: Via Supabase SQL Editor

1. Go to your Supabase project → SQL Editor
2. Run this query to grant admin role:

```sql
UPDATE public."User" 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

### Option 2: Via Supabase Dashboard

1. Go to Table Editor → User table
2. Find your user by email
3. Edit the `role` field to `ADMIN`
4. Save changes

### Option 3: Via Prisma Studio (Local Development)

```bash
npx prisma studio
```

1. Open the User table
2. Find your user
3. Change role to `ADMIN`
4. Save

## Admin Dashboard Features

### Dashboard Pages

- **`/admin`** - Main dashboard with KPIs and metrics
  - Total users (homeowners + artisans)
  - Total leads and conversion rates
  - Revenue estimates
  - Active Hermes agents
  - Recent activity feed

- **`/admin/utilisateurs`** - User Management
  - List all users with role, email, created date
  - Filter by role (USER, ARTISAN, ADMIN)
  - Suspend/unsuspend users
  - Delete users
  - Search by email or name

- **`/admin/artisans`** - Artisan Management
  - List all artisans with company info
  - Verify/unverify RGE certification
  - Toggle premium status
  - Toggle featured status
  - View artisan profiles

- **`/admin/leads`** - Lead Management
  - List all leads with homeowner info
  - Filter by status (NEW, CONTACTED, QUALIFIED, CONVERTED)
  - Filter by temperature (HOT, COLD)
  - Manually assign leads to artisans
  - Update lead scores

- **`/admin/devis`** - Quote Management (NEW)
  - List all quotes with artisan and lead info
  - Filter by status (DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED)
  - View conversion metrics
  - Track total accepted value

- **`/admin/parametres`** - Settings
  - Configure lead pricing (HOT, COLD)
  - Manage featured artisans
  - Update platform parameters

- **`/admin/agents`** - Hermes Agents
  - Monitor AI agent status
  - View task counts
  - Manage agent operations

- **`/admin/analytics`** - Platform Analytics
  - Traffic and engagement metrics
  - User growth trends
  - Revenue analytics

- **`/admin/contenu`** - Content Management
  - Manage blog articles
  - Publish/unpublish content
  - SEO optimization

## Server Actions

All admin operations use server actions with proper authentication:

### User Actions
- `suspendUser(userId)` - Suspend a user account
- `unsuspendUser(userId)` - Reactivate a user account
- `deleteUserAdmin(userId)` - Delete a user and all related data

### Artisan Actions
- `verifyArtisan(artisanId)` - Verify RGE certification
- `unverifyArtisan(artisanId)` - Remove verification
- `togglePremiumArtisan(artisanId)` - Toggle premium status
- `toggleFeaturedArtisan(artisanId)` - Toggle featured status

### Lead Actions
- `assignLeadToArtisan(leadId, artisanId)` - Manually assign lead
- `updateLeadScore(leadId, score)` - Update lead quality score
- `updateLeadTemperature(leadId, temperature)` - Mark as HOT or COLD

### Settings Actions
- `updateLeadPricing(hotPrice, coldPrice)` - Configure lead prices
- `getLeadPricing()` - Get current lead pricing

## Security

- All admin routes protected by middleware
- Server actions verify ADMIN role
- Unauthorized access redirects to appropriate space
- Session validation on every request

## Access Control

The middleware (`middleware.ts`) enforces role-based access:

```typescript
const ROLE_ROUTES = {
  '/admin': ['ADMIN'],
  '/espace-pro': ['ARTISAN'],
  '/espace-proprietaire': ['USER', 'ADMIN'],
}
```

- ADMIN users can access:
  - `/admin/*` - Admin dashboard
  - `/espace-proprietaire/*` - Owner space (for testing)
  
- Attempts to access `/admin` without ADMIN role redirect to the user's appropriate space
