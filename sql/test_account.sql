/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 10.1.37-MariaDB : Database - bitmex_script
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`bitmex_script` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `bitmex_script`;

/*Table structure for table `bitmex_accounts` */

DROP TABLE IF EXISTS `bitmex_accounts`;

CREATE TABLE `bitmex_accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL DEFAULT '',
  `testnet` tinyint(1) NOT NULL DEFAULT '1',
  `apiKeyID` varchar(100) NOT NULL DEFAULT '',
  `apiKeySecret` varchar(100) NOT NULL DEFAULT '',
  `maxTableLen` int(4) NOT NULL DEFAULT '100',
  `isParent` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `bitmex_accounts` */

insert  into `bitmex_accounts`(`id`,`email`,`name`,`testnet`,`apiKeyID`,`apiKeySecret`,`maxTableLen`,`isParent`) values 
(1,'jglr16664@gmail.com','JGLR MASTER',0,'KDHgQdNnsWCT0HoxsPqHTSmv','8Bw6x66gODMIxRXGj7_ViXrsEawZbaKjYekYTX9JcxeyaWVc',100,1),
(2,'ricardo.galan@lordsocket.com','ricardo',0,'tatjmIccl0tTqxv71jUHdusX','vGvEITzdPJmOuaL9Dz9TcKAEuq3TCStaljkYJ6WhRGt5I2O7',100,0),
(3,'smartkeyt@gmail.com','SK API',0,'2yPqkbjBZ1kkPZ5J6OvHUbdo','qIZLSOd-jomNk5FyojEfd1blXcrBvO9QL1wcrMNEW_uj5_bP',100,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
