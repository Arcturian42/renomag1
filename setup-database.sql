-- ============================================================
-- RENOMAG — Setup complet DB (schéma + données de démo)
-- Coller dans Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- === SCHÉMA ===

CREATE TYPE "Role" AS ENUM ('USER', 'ARTISAN', 'ADMIN');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'REJECTED');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT NOT NULL DEFAULT 'Direct',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

CREATE TABLE "ArtisanCompany" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "avatar" TEXT,
    "logoUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "yearsExperience" INTEGER NOT NULL DEFAULT 0,
    "responseTime" TEXT,
    "since" INTEGER,
    "gallery" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArtisanCompany_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ArtisanCompany_userId_key" ON "ArtisanCompany"("userId");
CREATE UNIQUE INDEX "ArtisanCompany_slug_key" ON "ArtisanCompany"("slug");
CREATE UNIQUE INDEX "ArtisanCompany_siret_key" ON "ArtisanCompany"("siret");

CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Certification_code_key" ON "Certification"("code");

CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Specialty_slug_key" ON "Specialty"("slug");

CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "city" TEXT,
    "department" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "description" TEXT,
    "budget" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "score" DOUBLE PRECISION,
    "source" TEXT NOT NULL DEFAULT 'Formulaire devis',
    "campaign" TEXT NOT NULL DEFAULT 'Organic',
    "country" TEXT NOT NULL DEFAULT 'France',
    "artisanId" TEXT,
    "specialtyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "image" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "author" TEXT,
    "authorRole" TEXT,
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "tags" JSONB,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "density" DOUBLE PRECISION,
    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "author" TEXT,
    "avatar" TEXT,
    "date" TEXT,
    "project" TEXT,
    "artisanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutreachCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutreachCampaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutreachContact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "OutreachContact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "artisanId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Subscription_artisanId_key" ON "Subscription"("artisanId");

CREATE TABLE "KPI" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "KPI_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

CREATE TABLE "_ArtisanCompanyToCertification" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_ArtisanCompanyToCertification_AB_unique" ON "_ArtisanCompanyToCertification"("A", "B");
CREATE INDEX "_ArtisanCompanyToCertification_B_index" ON "_ArtisanCompanyToCertification"("B");

CREATE TABLE "_ArtisanCompanyToSpecialty" ("A" TEXT NOT NULL, "B" TEXT NOT NULL);
CREATE UNIQUE INDEX "_ArtisanCompanyToSpecialty_AB_unique" ON "_ArtisanCompanyToSpecialty"("A", "B");
CREATE INDEX "_ArtisanCompanyToSpecialty_B_index" ON "_ArtisanCompanyToSpecialty"("B");

-- Foreign keys
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ArtisanCompany" ADD CONSTRAINT "ArtisanCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "ArtisanCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "ArtisanCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutreachContact" ADD CONSTRAINT "OutreachContact_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "OutreachCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "ArtisanCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "_ArtisanCompanyToCertification" ADD CONSTRAINT "_ArtisanCompanyToCertification_A_fkey" FOREIGN KEY ("A") REFERENCES "ArtisanCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ArtisanCompanyToCertification" ADD CONSTRAINT "_ArtisanCompanyToCertification_B_fkey" FOREIGN KEY ("B") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ArtisanCompanyToSpecialty" ADD CONSTRAINT "_ArtisanCompanyToSpecialty_A_fkey" FOREIGN KEY ("A") REFERENCES "ArtisanCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ArtisanCompanyToSpecialty" ADD CONSTRAINT "_ArtisanCompanyToSpecialty_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Prisma internal migration tracking table
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ,
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- SEED — Données de démonstration
-- ============================================================

-- Users artisans
INSERT INTO "User" ("id", "email", "role", "status", "source", "updatedAt") VALUES
  ('usr-a1', 'artisan1@renomag.fr', 'ARTISAN', 'active', 'Seed', NOW()),
  ('usr-a2', 'artisan2@renomag.fr', 'ARTISAN', 'active', 'Seed', NOW()),
  ('usr-a3', 'artisan3@renomag.fr', 'ARTISAN', 'active', 'Seed', NOW()),
  ('usr-a4', 'artisan4@renomag.fr', 'ARTISAN', 'active', 'Seed', NOW()),
  ('usr-a5', 'artisan5@renomag.fr', 'ARTISAN', 'active', 'Seed', NOW()),
  ('usr-a6', 'artisan6@renomag.fr', 'ARTISAN', 'active', 'Seed', NOW())
ON CONFLICT ("email") DO NOTHING;

-- Certifications
INSERT INTO "Certification" ("id", "name", "code") VALUES
  ('cert-rge',       'RGE',         'RGE'),
  ('cert-qualipac',  'QualiPAC',    'QualiPAC'),
  ('cert-qualisol',  'QualiSol',    'QualiSol'),
  ('cert-qualibois', 'Qualibois',   'Qualibois'),
  ('cert-qualipv',   'QualiPV',     'QualiPV'),
  ('cert-eco',       'Eco Artisan', 'EcoArtisan')
ON CONFLICT ("code") DO NOTHING;

-- Specialties
INSERT INTO "Specialty" ("id", "name", "slug") VALUES
  ('spec-isolation',  'Isolation thermique',  'isolation-thermique'),
  ('spec-pac',        'Pompe à chaleur',       'pompe-a-chaleur'),
  ('spec-pv',         'Photovoltaïque',        'photovoltaique'),
  ('spec-solaire',    'Chauffe-eau solaire',   'chauffe-eau-solaire'),
  ('spec-vmc',        'VMC Double flux',       'vmc-double-flux'),
  ('spec-ite',        'ITE',                   'ite'),
  ('spec-combles',    'Isolation combles',     'isolation-combles'),
  ('spec-menuiserie', 'Menuiserie',            'menuiserie'),
  ('spec-biomasse',   'Chaudière biomasse',    'chaudiere-biomasse'),
  ('spec-granules',   'Poêle à granulés',      'poele-a-granules')
ON CONFLICT ("slug") DO NOTHING;

-- Artisan companies
INSERT INTO "ArtisanCompany" ("id","userId","slug","name","siret","description","address","city","zipCode","department","region","phone","email","website","avatar","verified","premium","available","rating","reviewCount","projectCount","yearsExperience","responseTime","since","gallery","updatedAt") VALUES
(
  'art-1','usr-a1','thermoconfort-paris','ThermoConfort Paris','12345678900012',
  'Spécialiste de l''isolation thermique et des pompes à chaleur depuis 15 ans.',
  '12 rue de la Paix, 75002 Paris','Paris','75002','75','Île-de-France',
  '01 23 45 67 89','contact@thermoconfort-paris.fr','https://thermoconfort-paris.fr',
  'https://ui-avatars.com/api/?name=Jean+Durand&background=1e40af&color=fff&size=200',
  true,true,true,4.8,127,342,15,'< 2h',2009,
  '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600","https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600"]'::jsonb,
  NOW()
),(
  'art-2','usr-a2','eco-renov-lyon','Éco-Rénov Lyon','98765432100034',
  'Entreprise lyonnaise spécialisée dans les travaux de rénovation énergétique.',
  '8 cours Gambetta, 69003 Lyon','Lyon','69003','69','Auvergne-Rhône-Alpes',
  '04 72 11 22 33','contact@eco-renov-lyon.fr','https://eco-renov-lyon.fr',
  'https://ui-avatars.com/api/?name=Patrick+Moreau&background=16a34a&color=fff&size=200',
  true,true,true,4.7,89,218,12,'< 4h',2012,
  '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600"]'::jsonb,
  NOW()
),(
  'art-3','usr-a3','artisan-renov-marseille','Artisan Rénov Marseille','45678912300056',
  'Artisan certifié RGE depuis 2011, spécialisé dans l''isolation thermique par l''extérieur.',
  '45 boulevard Michelet, 13009 Marseille','Marseille','13009','13','Provence-Alpes-Côte d''Azur',
  '04 91 55 66 77','contact@artisanrenov-marseille.fr',NULL,
  'https://ui-avatars.com/api/?name=Karim+Benzara&background=0d9488&color=fff&size=200',
  true,false,true,4.6,64,156,13,'< 6h',2011,'[]'::jsonb,NOW()
),(
  'art-4','usr-a4','nord-isolation-lille','Nord Isolation','32165498700078',
  'Leader de l''isolation en région Nord, accompagne les propriétaires depuis 2008.',
  '3 rue Nationale, 59000 Lille','Lille','59000','59','Hauts-de-France',
  '03 20 33 44 55','contact@nord-isolation.fr',NULL,
  'https://ui-avatars.com/api/?name=Christophe+Leblanc&background=f59e0b&color=fff&size=200',
  true,true,false,4.9,203,512,16,'< 1h',2008,'[]'::jsonb,NOW()
),(
  'art-5','usr-a5','soleil-energie-bordeaux','Soleil Énergie Bordeaux','78912345600090',
  'Experte en énergies renouvelables, systèmes solaires thermiques et photovoltaïques.',
  '18 quai des Chartrons, 33300 Bordeaux','Bordeaux','33300','33','Nouvelle-Aquitaine',
  '05 57 88 99 00','contact@soleil-energie-bordeaux.fr',NULL,
  'https://ui-avatars.com/api/?name=Isabelle+Fontaine&background=7c3aed&color=fff&size=200',
  true,false,true,4.7,71,189,9,'< 3h',2015,'[]'::jsonb,NOW()
),(
  'art-6','usr-a6','chaleur-plus-nantes','Chaleur Plus Nantes','65432178900012',
  'Spécialiste chauffage et climatisation, pompes à chaleur et systèmes de chauffage bois.',
  '22 rue du Calvaire, 44000 Nantes','Nantes','44000','44','Pays de la Loire',
  '02 40 12 23 34','contact@chaleur-plus-nantes.fr',NULL,
  'https://ui-avatars.com/api/?name=Thomas+Garnier&background=dc2626&color=fff&size=200',
  true,false,true,4.5,48,132,7,'< 5h',2017,'[]'::jsonb,NOW()
)
ON CONFLICT ("slug") DO NOTHING;

-- Certifications ↔ Artisans
INSERT INTO "_ArtisanCompanyToCertification" ("A","B") VALUES
  ('art-1','cert-rge'),('art-1','cert-qualipac'),('art-1','cert-eco'),
  ('art-2','cert-rge'),('art-2','cert-qualisol'),('art-2','cert-qualipv'),
  ('art-3','cert-rge'),('art-3','cert-eco'),
  ('art-4','cert-rge'),('art-4','cert-qualibois'),
  ('art-5','cert-rge'),('art-5','cert-qualisol'),('art-5','cert-qualipv'),
  ('art-6','cert-rge'),('art-6','cert-qualipac'),('art-6','cert-qualibois')
ON CONFLICT DO NOTHING;

-- Specialties ↔ Artisans
INSERT INTO "_ArtisanCompanyToSpecialty" ("A","B") VALUES
  ('art-1','spec-isolation'),('art-1','spec-pac'),('art-1','spec-vmc'),
  ('art-2','spec-pv'),('art-2','spec-isolation'),('art-2','spec-solaire'),
  ('art-3','spec-ite'),('art-3','spec-combles'),('art-3','spec-menuiserie'),
  ('art-4','spec-combles'),('art-4','spec-isolation'),('art-4','spec-menuiserie'),
  ('art-5','spec-pv'),('art-5','spec-solaire'),('art-5','spec-isolation'),
  ('art-6','spec-pac'),('art-6','spec-combles'),('art-6','spec-menuiserie')
ON CONFLICT DO NOTHING;

-- Reviews
INSERT INTO "Review" ("id","rating","comment","author","avatar","date","project","artisanId") VALUES
  ('rev-1',5,'Excellent travail !','Sophie M.','https://ui-avatars.com/api/?name=Sophie+M&background=f59e0b&color=fff','2024-03-15','Isolation combles + PAC air-air','art-1'),
  ('rev-2',5,'Très bonne expérience du début à la fin.','Pierre L.','https://ui-avatars.com/api/?name=Pierre+L&background=16a34a&color=fff','2024-02-08','Pompe à chaleur air/eau','art-1'),
  ('rev-3',4,'Bon travail dans l''ensemble.','Marie T.','https://ui-avatars.com/api/?name=Marie+T&background=0d9488&color=fff','2024-01-20','Isolation des murs par l''extérieur','art-1'),
  ('rev-4',5,'Installation solaire parfaite.','Antoine B.','https://ui-avatars.com/api/?name=Antoine+B&background=1e40af&color=fff','2024-04-01','Panneaux solaires 6kWc','art-2')
ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO "Category" ("id","name","slug") VALUES
  ('cat-aides',     'Aides & Financement', 'aides-financement'),
  ('cat-chauffage', 'Chauffage',           'chauffage'),
  ('cat-isolation', 'Isolation',           'isolation'),
  ('cat-solaire',   'Énergie solaire',     'energie-solaire'),
  ('cat-guides',    'Guides pratiques',    'guides-pratiques')
ON CONFLICT ("slug") DO NOTHING;

-- Articles
INSERT INTO "Article" ("id","title","slug","content","excerpt","image","published","featured","author","authorRole","readTime","tags","categoryId","updatedAt") VALUES
(
  'art-blog-1',
  'MaPrimeRénov'' 2024 : le guide complet',
  'maprimrenov-2024-tout-savoir',
  'MaPrimeRénov'' est l''aide phare de la rénovation énergétique en France. En 2024, elle a été profondément réformée pour mieux cibler les ménages modestes et les rénovations globales. Voici tout ce que vous devez savoir pour en bénéficier.',
  'MaPrimeRénov'' a été profondément réformée en 2024.',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
  true,true,'Équipe RENOMAG','Experts rénovation',8,
  '["MaPrimeRénov","Aides","2024","Financement"]'::jsonb,'cat-aides',NOW()
),(
  'art-blog-2',
  'Pompe à chaleur : quel modèle choisir ?',
  'pompe-a-chaleur-guide-complet',
  'La pompe à chaleur est devenue la solution préférée des français pour se chauffer de manière économique et écologique. Air/air, air/eau, géothermique : chaque type a ses avantages selon votre situation.',
  'Air/air, air/eau, géothermique... On vous aide à choisir.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  true,true,'Marc Thévenin','Ingénieur thermique',12,
  '["Pompe à chaleur","Chauffage","PAC"]'::jsonb,'cat-chauffage',NOW()
),(
  'art-blog-3',
  'Isolation des combles perdus : pourquoi c''est la priorité n°1',
  'isolation-combles-perdus-guide',
  'L''isolation des combles perdus est sans conteste l''investissement le plus rentable en rénovation énergétique. Jusqu''à 30% des déperditions thermiques passent par le toit.',
  'Jusqu''à 30% des déperditions passent par le toit.',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
  true,false,'Équipe RENOMAG','Experts rénovation',7,
  '["Isolation","Combles","Économies énergie"]'::jsonb,'cat-isolation',NOW()
),(
  'art-blog-4',
  'Panneaux solaires : rentabiliser en autoconsommation',
  'panneaux-solaires-autoconsommation',
  'L''autoconsommation solaire permet de produire sa propre électricité et de réduire sa facture. Avec les aides actuelles, le retour sur investissement se situe entre 7 et 12 ans.',
  'Produisez votre propre électricité et maximisez votre ROI.',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
  true,true,'Lucie Marchand','Spécialiste énergie solaire',10,
  '["Solaire","Photovoltaïque","Autoconsommation"]'::jsonb,'cat-solaire',NOW()
),(
  'art-blog-5',
  'CEE 2024 : comment profiter des certificats',
  'cee-certificats-economies-energie-2024',
  'Les Certificats d''Économies d''Énergie sont méconnus du grand public alors qu''ils peuvent représenter plusieurs milliers d''euros d''économies sur vos travaux.',
  'Les CEE peuvent vous faire économiser des milliers d''euros.',
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
  true,false,'Équipe RENOMAG','Experts rénovation',6,
  '["CEE","Aides","Financement"]'::jsonb,'cat-aides',NOW()
),(
  'art-blog-6',
  '5 critères pour choisir un bon artisan RGE',
  'choisir-artisan-rge-conseils',
  'La certification RGE est la condition sine qua non pour bénéficier des aides MaPrimeRénov'' et CEE. Mais tous les artisans RGE ne se valent pas.',
  'Tous les artisans RGE ne se valent pas. Voici comment choisir.',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
  true,false,'Pierre Dumont','Conseiller en rénovation',5,
  '["RGE","Artisan","Conseils"]'::jsonb,'cat-guides',NOW()
)
ON CONFLICT ("slug") DO NOTHING;
