-- ============================================================
-- RENOMAG — Demo Data
-- Run AFTER schema.sql in the Supabase SQL Editor
-- ============================================================

-- ============================================================
-- DEPARTMENTS (quelques-uns)
-- ============================================================
insert into public.departments (code, name, region, density) values
  ('75', 'Paris', 'Île-de-France', 20755),
  ('69', 'Rhône', 'Auvergne-Rhône-Alpes', 565),
  ('13', 'Bouches-du-Rhône', 'Provence-Alpes-Côte d''Azur', 402),
  ('59', 'Nord', 'Hauts-de-France', 453),
  ('33', 'Gironde', 'Nouvelle-Aquitaine', 165),
  ('31', 'Haute-Garonne', 'Occitanie', 225),
  ('67', 'Bas-Rhin', 'Grand Est', 234),
  ('44', 'Loire-Atlantique', 'Pays de la Loire', 212),
  ('06', 'Alpes-Maritimes', 'Provence-Alpes-Côte d''Azur', 253),
  ('92', 'Hauts-de-Seine', 'Île-de-France', 9052)
on conflict (code) do nothing;

-- ============================================================
-- CATEGORIES (Blog)
-- ============================================================
insert into public.categories (id, name, slug) values
  ('a1000000-0000-0000-0000-000000000001', 'Aides & Financement', 'aides-financement'),
  ('a1000000-0000-0000-0000-000000000002', 'Travaux & Techniques', 'travaux-techniques'),
  ('a1000000-0000-0000-0000-000000000003', 'Réglementation', 'reglementation'),
  ('a1000000-0000-0000-0000-000000000004', 'Témoignages', 'temoignages')
on conflict (id) do nothing;

-- ============================================================
-- ARTICLES (Blog)
-- ============================================================
insert into public.articles (id, title, slug, content, excerpt, image, published, category_id) values
  (
    'b1000000-0000-0000-0000-000000000001',
    'MaPrimeRénov'' 2024 : tout ce qu''il faut savoir',
    'maprimrenov-2024-tout-savoir',
    'MaPrimeRénov'' est l''aide principale de l''État pour financer votre rénovation énergétique. En 2024, le dispositif a été renforcé avec de nouveaux plafonds et une simplification des démarches. Voici tout ce que vous devez savoir pour en bénéficier...',
    'Le guide complet sur MaPrimeRénov'' 2024 : montants, conditions, démarches et nouveautés.',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    true,
    'a1000000-0000-0000-0000-000000000001'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Pompe à chaleur : le guide complet 2024',
    'pompe-a-chaleur-guide-complet',
    'La pompe à chaleur (PAC) est l''une des solutions les plus efficaces pour le chauffage et la climatisation. Elle puise les calories dans l''air, l''eau ou le sol pour les redistribuer dans votre logement. Découvrez tout ce qu''il faut savoir avant d''investir...',
    'Fonctionnement, coûts, aides disponibles et retour sur investissement des pompes à chaleur.',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    true,
    'a1000000-0000-0000-0000-000000000002'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Isolation des combles perdus : le guide',
    'isolation-combles-perdus-guide',
    'L''isolation des combles perdus est l''un des travaux les plus rentables en rénovation énergétique. En effet, 30% des déperditions de chaleur d''une maison passent par le toit. Une bonne isolation permet de réduire significativement votre facture de chauffage...',
    'Comment isoler ses combles perdus ? Matériaux, coûts, artisans RGE et aides disponibles.',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    true,
    'a1000000-0000-0000-0000-000000000002'
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Rénovation énergétique : les obligations légales',
    'renovation-energetique-obligations-legales',
    'Depuis 2022, les propriétaires de logements classés F et G (passoires thermiques) sont soumis à de nouvelles obligations. Cette réglementation vise à améliorer le parc immobilier français et à réduire les émissions de CO2. Voici ce que vous devez savoir...',
    'DPE, audit énergétique obligatoire, interdictions de location : ce que la loi impose aux propriétaires.',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    true,
    'a1000000-0000-0000-0000-000000000003'
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'Témoignage : notre rénovation à Paris',
    'temoignage-renovation-paris',
    'Marie et Thomas habitent un appartement haussmannien de 85m² à Paris. Passoires thermiques, leurs factures de chauffage atteignaient 2 800€ par an. Grâce à RENOMAG, ils ont trouvé un artisan RGE certifié et bénéficié d''aides pour 60% du coût des travaux...',
    'Comment Marie et Thomas ont rénové leur appartement parisien et économisé 1 800€ par an.',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    true,
    'a1000000-0000-0000-0000-000000000004'
  ),
  (
    'b1000000-0000-0000-0000-000000000006',
    'CEE : les Certificats d''Économies d''Énergie expliqués',
    'cee-certificats-economies-energie',
    'Les CEE (Certificats d''Économies d''Énergie) sont un dispositif méconnu mais très avantageux pour financer votre rénovation énergétique. Cumulables avec MaPrimeRénov'', ils peuvent vous permettre d''obtenir jusqu''à plusieurs milliers d''euros supplémentaires...',
    'Comprendre et obtenir les CEE pour financer sa rénovation énergétique en 2024.',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    true,
    'a1000000-0000-0000-0000-000000000001'
  )
on conflict (id) do nothing;

-- ============================================================
-- NOTE: Pour créer des artisans de démo, vous devez d'abord
-- créer des comptes utilisateurs via Supabase Auth Dashboard
-- (Authentication > Users > Add user), puis noter leurs UUIDs.
-- Ensuite insérez les artisan_companies avec ces UUIDs.
--
-- Exemple (remplacez les UUIDs par ceux de vos vrais utilisateurs):
-- ============================================================

-- Leads de démo (sans artisan assigné pour l'instant)
insert into public.leads (first_name, last_name, email, phone, zip_code, department, project_type, description, budget, status, score) values
  ('Jean', 'Dupont', 'jean.dupont@example.fr', '06 12 34 56 78', '75016', '75', 'pompe-a-chaleur, isolation', 'Maison de 1970, isolation combles + PAC air/eau', '15000', 'NEW', 75),
  ('Marie', 'Martin', 'marie.martin@example.fr', '06 98 76 54 32', '78000', '78', 'solaire', 'Panneaux solaires 6kWc sur toiture sud', '12000', 'CONTACTED', 60),
  ('Pierre', 'Bernard', 'p.bernard@example.fr', '06 55 44 33 22', '92100', '92', 'vmc', 'VMC double flux pour appartement 90m²', '5500', 'QUALIFIED', 45),
  ('Sophie', 'Laurent', 's.laurent@example.fr', '07 11 22 33 44', '93200', '93', 'isolation', 'Isolation murs extérieur (ITE) maison 130m²', '18000', 'CONVERTED', 80),
  ('François', 'Moreau', 'f.moreau@example.fr', '06 33 44 55 66', '92200', '92', 'chaudiere-granules', 'Remplacement chaudière fioul par granulés', '7000', 'REJECTED', 55),
  ('Isabelle', 'Petit', 'i.petit@example.fr', '06 77 88 99 00', '69001', '69', 'renovation-globale', 'Rénovation globale maison 1965, 180m²', '45000', 'NEW', 95),
  ('Laurent', 'Thomas', 'l.thomas@example.fr', '07 22 33 44 55', '13008', '13', 'pompe-a-chaleur', 'PAC géothermique villa 250m²', '28000', 'NEW', 85),
  ('Nathalie', 'Dubois', 'n.dubois@example.fr', '06 44 55 66 77', '31000', '31', 'isolation', 'Isolation toiture-terrasse appartement', '8000', 'CONTACTED', 50),
  ('Michel', 'Leroy', 'm.leroy@example.fr', '06 11 22 33 44', '59000', '59', 'solaire', 'Solaire thermique + panneaux photovoltaïques', '22000', 'NEW', 70),
  ('Sandrine', 'Roux', 's.roux@example.fr', '07 55 66 77 88', '33000', '33', 'menuiseries', 'Remplacement 12 fenêtres double vitrage', '9500', 'QUALIFIED', 40)
on conflict do nothing;
