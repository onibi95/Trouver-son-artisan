-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: artisans
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `artisans`
--

DROP TABLE IF EXISTS `artisans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artisans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `specialite` varchar(255) DEFAULT NULL,
  `note` float DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `aPropos` text,
  `email` varchar(255) DEFAULT NULL,
  `siteWeb` varchar(255) DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `top` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `artisans_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artisans`
--

LOCK TABLES `artisans` WRITE;
/*!40000 ALTER TABLE `artisans` DISABLE KEYS */;
INSERT INTO `artisans` VALUES (1,'Boucherie Dumont','Boucher',4.5,'Lyon','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','boucherie.dumond@gmail.com','',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(2,'Au pain chaud','Boulanger',4.8,'Montélimar','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','aupainchaud@hotmail.com','',NULL,1,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(3,'Chocolaterie Labbé','Chocolatier',4.9,'Lyon','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','chocolaterie-labbe@gmail.com','https://chocolaterie-labbe.fr',NULL,1,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(4,'Traiteur Truchon','Traiteur',4.1,'Lyon','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','contact@truchon-traiteur.fr','https://truchon-traiteur.fr',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(5,'Orville Salmons','Chauffagiste',5,'Evian','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','o-salmons@live.com','',NULL,1,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(6,'Mont Blanc Eléctricité','Electricien',4.5,'Chamonix','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','contact@mont-blanc-electricite.com','https://mont-blanc-electricite.com',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(7,'Boutot & fils','Menuisier',4.7,'Bourg-en-bresse','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','boutot-menuiserie@gmail.com','https://boutot-menuiserie.com',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(8,'Vallis Bellemare','Plombier',4,'Vienne','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','v.bellemare@gmail.com','https://plomberie-bellemare.com',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(9,'Claude Quinn','Bijoutier',4.2,'Aix-les-bains','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','claude.quinn@gmail.com','',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(10,'Amitee Lécuyer','Couturier',4.5,'Annecy','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','a.amitee@hotmail.com','https://lecuyer-couture.com',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(11,'Ernest Carignan','Ferronier',5,'Le Puy-en-Velay','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','e-carigan@hotmail.com','',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(12,'Royden Charbonneau','Coiffeur',3.8,'Saint-Priest','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','r.charbonneau@gmail.com','',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(13,'Leala Dennis','Coiffeur',3.8,'Chambéry','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','l.dennos@hotmail.fr','https://coiffure-leala-chambery.fr',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(14,'C\'est sup\'hair','Coiffeur',4.1,'Romans-sur-Isère','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','sup-hair@gmail.com','https://sup-hair.fr',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(15,'Le monde des fleurs','Fleuriste',4.6,'Annonay','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','contact@le-monde-des-fleurs-annonay.fr','https://le-monde-des-fleurs-annonay.fr',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(16,'Valérie Laderoute','Toiletteur',4.5,'Valence','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','v-laredoute@gmail.com','',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16'),(17,'CM Graphisme','Webdesign',4.4,'Valence','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend ante sem, id volutpat massa fermentum nec. Praesent volutpat scelerisque mauris, quis sollicitudin tellus sollicitudin. ','contact@cm-graphisme.com','https://cm-graphisme.com',NULL,0,'2025-06-11 22:30:16','2025-06-11 22:30:16');
/*!40000 ALTER TABLE `artisans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;




