-- ================================================================
-- SEED DATA FOR ARTISANS PLATFORM - AUVERGNE-RHÔNE-ALPES
-- ================================================================
-- Ce fichier contient les données de seed pour initialiser la base de données
-- de la plateforme artisans avec des données réalistes d'artisans qualifiés.

-- Désactiver les vérifications de clés étrangères temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- Nettoyer les tables existantes
TRUNCATE TABLE `artisans`;
TRUNCATE TABLE `categories`;

-- ================================================================
-- INSERTION DES CATÉGORIES
-- ================================================================
LOCK TABLES `categories` WRITE;
INSERT INTO `categories` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Alimentation', 'Artisans spécialisés dans les métiers de bouche et l\'alimentation', NOW(), NOW()),
(2, 'Bâtiment', 'Professionnels du bâtiment et de la construction', NOW(), NOW()),
(3, 'Fabrication', 'Artisans créateurs et fabricants d\'objets artisanaux', NOW(), NOW()),
(4, 'Services', 'Services à la personne et prestations artisanales', NOW(), NOW());
UNLOCK TABLES;

-- ================================================================
-- INSERTION DES ARTISANS
-- ================================================================
LOCK TABLES `artisans` WRITE;
INSERT INTO `artisans` (`nom`, `specialite`, `note`, `ville`, `aPropos`, `email`, `siteWeb`, `categoryId`, `top`, `createdAt`, `updatedAt`) VALUES
-- Catégorie Alimentation (categoryId = 1)
('Boucherie Dumont', 'Boucher', 4.5, 'Lyon', 'Boucherie artisanale depuis 1952, spécialisée dans les viandes de qualité supérieure. Nous proposons une sélection rigoureuse de viandes locales et travaillons avec des éleveurs partenaires de la région Auvergne-Rhône-Alpes.', 'boucherie.dumond@gmail.com', NULL, 1, 0, NOW(), NOW()),

('Au pain chaud', 'Boulanger', 4.8, 'Montélimar', 'Boulangerie traditionnelle proposant des pains artisanaux, viennoiseries et pâtisseries. Tous nos produits sont fabriqués sur place avec des ingrédients de première qualité et selon les méthodes traditionnelles.', 'aupainchaud@hotmail.com', NULL, 1, 1, NOW(), NOW()),

('Chocolaterie Labbé', 'Chocolatier', 4.9, 'Lyon', 'Chocolaterie artisanale créée en 1987, reconnue pour ses créations originales et ses chocolats fins. Nous proposons une gamme complète de chocolats, pralinés et confiseries artisanales de haute qualité.', 'chocolaterie-labbe@gmail.com', 'https://chocolaterie-labbe.fr', 1, 1, NOW(), NOW()),

('Traiteur Truchon', 'Traiteur', 4.1, 'Lyon', 'Service traiteur haut de gamme pour tous vos événements. Cuisine traditionnelle française revisitée avec des produits frais et locaux. Spécialisé dans les réceptions, mariages et événements d\'entreprise.', 'contact@truchon-traiteur.fr', 'https://truchon-traiteur.fr', 1, 0, NOW(), NOW()),

-- Catégorie Bâtiment (categoryId = 2)
('Orville Salmons', 'Chauffagiste', 5.0, 'Evian', 'Expert en installation et maintenance de systèmes de chauffage depuis plus de 15 ans. Spécialisé dans les solutions écologiques et les énergies renouvelables. Intervention rapide et service client de qualité.', 'o-salmons@live.com', NULL, 2, 1, NOW(), NOW()),

('Mont Blanc Électricité', 'Électricien', 4.5, 'Chamonix', 'Entreprise d\'électricité générale spécialisée dans les installations résidentielles et commerciales. Nous intervenons sur tous types de travaux électriques : installation, dépannage, mise aux normes et domotique.', 'contact@mont-blanc-electricite.com', 'https://mont-blanc-electricite.com', 2, 0, NOW(), NOW()),

('Boutot & fils', 'Menuisier', 4.7, 'Bourg-en-Bresse', 'Menuiserie traditionnelle familiale transmise de père en fils depuis 3 générations. Spécialisée dans la menuiserie sur mesure, l\'agencement intérieur et la restauration de meubles anciens.', 'boutot-menuiserie@gmail.com', 'https://boutot-menuiserie.com', 2, 0, NOW(), NOW()),

('Vallis Bellemare', 'Plombier', 4.0, 'Vienne', 'Plomberie générale et sanitaire. Intervention d\'urgence 24h/24 pour les dépannages. Spécialisé dans l\'installation de salles de bains, cuisines et systèmes de chauffage. Devis gratuit et conseils personnalisés.', 'v.bellemare@gmail.com', 'https://plomberie-bellemare.com', 2, 0, NOW(), NOW()),

-- Catégorie Fabrication (categoryId = 3)
('Claude Quinn', 'Bijoutier', 4.2, 'Aix-les-Bains', 'Bijouterie artisanale spécialisée dans la création de bijoux uniques. Travail de l\'or, de l\'argent et sertissage de pierres précieuses. Réparation de bijoux anciens et créations sur mesure selon vos désirs.', 'claude.quinn@gmail.com', NULL, 3, 0, NOW(), NOW()),

('Amitee Lécuyer', 'Couturier', 4.5, 'Annecy', 'Atelier de couture haute couture proposant créations sur mesure, retouches et transformations. Spécialisée dans les robes de mariée, costumes et vêtements d\'exception. Conseil en style et accompagnement personnalisé.', 'a.amitee@hotmail.com', 'https://lecuyer-couture.com', 3, 0, NOW(), NOW()),

('Ernest Carignan', 'Ferronnier', 5.0, 'Le Puy-en-Velay', 'Ferronnerie d\'art traditionnelle spécialisée dans la création de pièces uniques en fer forgé. Portails, rampes d\'escalier, mobilier de jardin et objets décoratifs. Restauration de ferronneries anciennes.', 'e-carigan@hotmail.com', NULL, 3, 0, NOW(), NOW()),

-- Catégorie Services (categoryId = 4)
('Royden Charbonneau', 'Coiffeur', 3.8, 'Saint-Priest', 'Salon de coiffure mixte proposant coupes tendances, colorations et soins capillaires. Équipe de professionnels formés aux dernières techniques. Produits haut de gamme et conseil personnalisé pour sublimer votre style.', 'r.charbonneau@gmail.com', NULL, 4, 0, NOW(), NOW()),

('Leala Dennis', 'Coiffeur', 3.8, 'Chambéry', 'Salon de coiffure féminin dans le centre de Chambéry. Spécialisé dans les coupes modernes, colorations naturelles et soins bio. Ambiance chaleureuse et service personnalisé dans un cadre zen et moderne.', 'l.dennos@hotmail.fr', 'https://coiffure-leala-chambery.fr', 4, 0, NOW(), NOW()),

('C\'est sup\'hair', 'Coiffeur', 4.1, 'Romans-sur-Isère', 'Salon de coiffure créatif et moderne proposant des services innovants. Spécialisé dans les coupes originales, extensions et techniques de coloration avancées. Team jeune et dynamique à votre service.', 'sup-hair@gmail.com', 'https://sup-hair.fr', 4, 0, NOW(), NOW()),

('Le monde des fleurs', 'Fleuriste', 4.6, 'Annonay', 'Fleuriste créateur proposant compositions florales sur mesure pour tous événements. Bouquets, centres de table, décoration florale de mariage et deuil. Fleurs fraîches sélectionnées quotidiennement.', 'contact@le-monde-des-fleurs-annonay.fr', 'https://le-monde-des-fleurs-annonay.fr', 4, 0, NOW(), NOW()),

('Valérie Laderoute', 'Toiletteur', 4.5, 'Valence', 'Salon de toilettage professionnel pour chiens et chats. Services complets : bain, coupe, soins des griffes et des oreilles. Produits hypoallergéniques et techniques douces adaptées à chaque animal.', 'v-laredoute@gmail.com', NULL, 4, 0, NOW(), NOW()),

('CM Graphisme', 'Webdesign', 4.4, 'Valence', 'Studio de création graphique et web spécialisé dans l\'identité visuelle et le webdesign. Conception de logos, sites internet, supports de communication. Accompagnement digital complet pour les entreprises et artisans.', 'contact@cm-graphisme.com', 'https://cm-graphisme.com', 4, 0, NOW(), NOW()); 

UNLOCK TABLES;


-- Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;


