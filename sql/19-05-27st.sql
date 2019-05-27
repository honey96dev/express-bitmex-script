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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Data for the table `bitmex_accounts` */

insert  into `bitmex_accounts`(`id`,`email`,`name`,`testnet`,`apiKeyID`,`apiKeySecret`,`maxTableLen`,`isParent`) values 
(1,'sandbox@lordsocket.com','Mother',1,'TlzFBawLjbedHIa-hbxkqiPS','CxtuNEE2sUDvPcWfa8TSu_6NQcye13UxKtGF-NExKZttWGto',100,1),
(2,'gianf17larosa@gmail.com','Child',1,'4gHFKn-qSCXqx7WVl3q6pEME','m0ms3m8DMEj-ETJVcmuhOsqzq9HNlvjmukEp4KbEGvJoGHrF',100,0),
(3,'honey96dev@gmail.com','Mine',1,'O6VAhGlVAqaBjiigboCgBtvN','XeJ5AYnEEf_e4JJxBd5uQcRiJlyIUpuKY4Wi2Bzkl75H0OME',100,0);

/*Table structure for table `sessions` */

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sessions` */

insert  into `sessions`(`session_id`,`expires`,`data`) values 
('-3cE4DJUsibyVzbYRO7RMvrPckkyt3Ic',1559014227,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('-HudoLUrLrqQVMbTgl8keEuAo4ZJXn1X',1559013655,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('-y6_49Gz2ZtceszCpBCOBaXoxwue5NrX',1559014426,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('0JkP_5pUL4_kB5nvmWy-zF1br6x-mJBD',1559056289,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('0uxx210MXWimzBUd2S4p7dCdlJ0rqSv-',1559014540,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('2FzibUdfGC3lbMjI0c8y28z1gSJz2dJn',1559055893,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('2fCF_c-b_NQ7YZ23WyLf1rjRxhJEqbwJ',1559014471,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('2wN_yHGwSBxAP9Ut-riU__U27pqafMZE',1559013641,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('3H9BbtQD1QpCPt7Ij4FnjjWHIkqVBL32',1559014227,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('6Y2KbrJWQKrfsCqk86vpn9S2MSAW-Fp0',1559014445,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('7_iy02HwfdBhZs53czRu3suwCdQfdiyr',1559013655,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('8GUdUFtzJwrZ9MA0qosiTl52e5AIBdI_',1558980833,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('9JBi_2GKOqkJM0emCO5yHmCgMvCK05Wz',1559056288,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('9mU_NTnmGxpDzt64HdCAJhpjfNSV7TEK',1559055888,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('ANyUxxcsgmSuY3MoJO6Yty8Uoby4hZVL',1559014540,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('BYxJ4XGhdIf5Imo-D4nPVIqsAnrG5cPB',1559014253,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('BxJjau1p5DdU7mFcwIfaBKLCOJbWAiSe',1559056328,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('CPI8R9qhFtfIrTSbM1mN3452mDvqfsGd',1559056300,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('CXr4sjBxqoAMvwlLTaOJ0fzuKli7yeiW',1559059813,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"email\":\"test@gmail.com\",\"name\":\"test\"}}'),
('D71EDq9IXv_LILDAvwE9K5LG8LfefKzp',1559055896,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('DCWP5NHZRpY61BjQmCZAMdyvrQ2ocCC0',1559055896,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('FHeQXyw0WPGObYVL2GzrmKizIdiEujbj',1558978092,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"email\":\"test@gmail.com\",\"name\":\"test\"}}'),
('FXRSfxG2N1NJTG6RAMoI-8yoySPlEWM8',1559003565,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"email\":\"test@gmail.com\",\"name\":\"test\"}}'),
('KZmxNO04Q6Ld-ZUg7D4xibP3FOE2k3Tk',1558980833,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('K_RDVXkbPcMpNusKlMzn0N9p4WpXYvJh',1559055814,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('LI6xlEecVyzRGntumxZxO5boY0ubq8CU',1559014197,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('NiCrmsb2_xKNx6LEQfPMbpiHM6owO7T5',1559014155,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('QD62CMMaXsWewoqii22imntbJSHmrm-n',1559055884,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('RPpOzCFa_qYQZ0rXlxTXq0tv0F-nBTRD',1559014264,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('Re9Vv8XQQmcXTfMburAsTn_5tSHhNcyb',1559014273,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('SrGoRqO9sJdOPPiw_hmVa5YVAkhCAakm',1559055865,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('TiZqmHbt7KHTbGAKajUuxr9t31XITcK-',1559014426,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('VShnSfYiy5_sUY7vy4H5Tpdc_VTmZ5ys',1559014197,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('W3DijE0OjfZxUIg77Ih2gKs7trxj5gDT',1559056264,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('XRrpH2uZiM7C7MMTCrfmFkTRIdqqkS4l',1558978633,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('Z8flGaF5zLk8hdz0jk3UNT2X3fDEvVtt',1559014273,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('ZS6mkYmNKhj9xrwKwkDjvOQg0hA2AHgb',1559056326,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('bbipQiYfBDPw1qa1KFwLbXqYfYk-t1Y_',1559055865,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('e5iFb0f-zNwFUYcL8mxnGRg0y_LjEq06',1559005737,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('eSmVtWgONq-Y503j4cB3UD1xRJW8k2EK',1559056298,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('ebY9fd5Rjyc_bh8lIQHNJ_S32_EAipSb',1559014471,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('gLSeyEJ7luqYyKghQSKf4HiFbkn8EjQ1',1559004204,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"email\":\"test@gmail.com\",\"name\":\"test\"}}'),
('gY6BQG_cDOKiG_0J5obA96c4hu3XMIKS',1559056262,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('jX2E6m9oG2JfCc_ncxlkQyNGFF7nEjk6',1559055893,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('kkLT8pWoGYWF4Ay8he8kF_qcIrq7kG9g',1559056328,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('lk4R81lSwFSOSSjtLDE-EPeKUvclClWm',1559056264,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('pMPccwldO6O5aK_QTJSMfyMcwD8LkeiG',1559014446,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('qSz7qxehCCtmBEyHLlCZ7Mcs-_9GItna',1559055888,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('qyH5QtAtGG5uRtBE8-ibEPO-LTVnPcSh',1559014263,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('rYNT4h9JYRPyTet5OPNcDtZWDuJlUkWb',1559055814,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('rcR7bZHS6Bj5FJrEyzHIqw8noyDFT9r0',1559005738,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('s6vnpxnZA-PQeD6-1SrO_64odszeKVS-',1559059795,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"email\":\"test@gmail.com\",\"name\":\"test\"}}'),
('ulOVc4FQ9UtfPmhkMUqjDp5mJS1LqG_r',1559056289,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('xXYhUikQ_9-niTTNkDirSS_4B_ytkGSr',1559056300,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('z5E_nntWjEDEDWLL79nqs3xjZoGe5q5p',1559055884,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('z9MWQwhMR6MQB_hOtWTLAOLxRZpNiUx9',1559014253,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('zqQkGIHMdM8W2fxxP1MqfbEC4EporAJv',1559014155,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL DEFAULT '',
  `password` varchar(400) NOT NULL DEFAULT '',
  `name` varchar(200) NOT NULL DEFAULT '',
  `note` varchar(200) DEFAULT '',
  `emailVerified` tinyint(1) NOT NULL DEFAULT '0',
  `allow` tinyint(1) NOT NULL DEFAULT '0',
  `verifyTimestamp` varchar(60) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `users` */

insert  into `users`(`id`,`email`,`password`,`name`,`note`,`emailVerified`,`allow`,`verifyTimestamp`) values 
(1,'test@gmail.com','85a0593a261aff9ce2f6314aae9c17ac32f6e607a37ad097c3da12e502d8dbc8','test','',0,0,'');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
