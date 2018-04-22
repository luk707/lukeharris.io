#
# SQL Export
# Created by Querious (201026)
# Created: 22 April 2018 at 20:15:53 BST
# Encoding: Unicode (UTF-8)
#


CREATE DATABASE IF NOT EXISTS `spotify` DEFAULT CHARACTER SET latin1 DEFAULT COLLATE latin1_swedish_ci;
USE `spotify`;




SET @PREVIOUS_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS `tracks`;
DROP TABLE IF EXISTS `track_artists`;
DROP TABLE IF EXISTS `plays`;
DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `artists`;
DROP TABLE IF EXISTS `albums`;
DROP TABLE IF EXISTS `album_tracks`;
DROP TABLE IF EXISTS `album_images`;
DROP TABLE IF EXISTS `album_artists`;


CREATE TABLE `album_artists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `album` char(22) NOT NULL DEFAULT '',
  `artist` char(22) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=latin1;


CREATE TABLE `album_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `album` char(22) NOT NULL DEFAULT '',
  `image` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=394 DEFAULT CHARSET=latin1;


CREATE TABLE `album_tracks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `album` char(22) NOT NULL DEFAULT '',
  `track` char(22) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=latin1;


CREATE TABLE `albums` (
  `id` char(22) NOT NULL DEFAULT '',
  `album_type` varchar(128) NOT NULL DEFAULT '',
  `href` varchar(128) NOT NULL DEFAULT '',
  `name` varchar(128) NOT NULL DEFAULT '',
  `type` varchar(128) NOT NULL DEFAULT '',
  `uri` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `artists` (
  `id` char(22) NOT NULL DEFAULT '',
  `href` varchar(128) NOT NULL DEFAULT '',
  `name` varchar(128) NOT NULL DEFAULT '',
  `type` varchar(128) NOT NULL DEFAULT '',
  `uri` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `width` int(10) NOT NULL DEFAULT '0',
  `height` int(10) NOT NULL DEFAULT '0',
  `url` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=394 DEFAULT CHARSET=latin1;


CREATE TABLE `plays` (
  `id` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `track` char(22) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `track_artists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `track` char(22) NOT NULL DEFAULT '',
  `artist` char(22) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=213 DEFAULT CHARSET=latin1;


CREATE TABLE `tracks` (
  `id` char(22) NOT NULL DEFAULT '',
  `name` varchar(128) NOT NULL DEFAULT '',
  `popularity` int(10) NOT NULL DEFAULT '0',
  `preview_url` varchar(128) NOT NULL DEFAULT '',
  `track_number` int(10) NOT NULL DEFAULT '0',
  `type` varchar(128) NOT NULL DEFAULT '',
  `uri` varchar(128) NOT NULL DEFAULT '',
  `explicit` int(11) NOT NULL DEFAULT '0',
  `duration_ms` int(10) NOT NULL DEFAULT '0',
  `disc_number` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




SET FOREIGN_KEY_CHECKS = @PREVIOUS_FOREIGN_KEY_CHECKS;


