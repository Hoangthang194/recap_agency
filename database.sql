-- MariaDB Database Schema for Recap Blog
-- Created based on data.ts structure

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `authors`;
DROP TABLE IF EXISTS `countries`;
DROP TABLE IF EXISTS `areas`;

-- Create Areas table
CREATE TABLE `areas` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `region` VARCHAR(50) NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `image` TEXT NOT NULL,
  `color_class` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `is_deleted` BIT(1) DEFAULT 0 NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Countries table
CREATE TABLE `countries` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `region` VARCHAR(50) NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `image` TEXT NOT NULL,
  `color_class` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `is_deleted` BIT(1) DEFAULT 0 NOT NULL,
  `area_id` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE SET NULL,
  INDEX `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Categories table (includes both categories and cities)
CREATE TABLE `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `image` TEXT NOT NULL,
  `color_class` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `is_deleted` BIT(1) DEFAULT 0 NOT NULL,
  `is_city` BOOLEAN DEFAULT FALSE,
  `area_id` VARCHAR(50),
  `country_id` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL,
  INDEX `idx_is_city` (`is_city`),
  INDEX `idx_is_deleted` (`is_deleted`),
  INDEX `idx_area_id` (`area_id`),
  INDEX `idx_country_id` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Authors table
CREATE TABLE `authors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `avatar` TEXT NOT NULL,
  `is_deleted` BIT(1) DEFAULT 0 NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Users table (for admin/editor/viewer management)
CREATE TABLE `users` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL COMMENT 'Hashed password using bcrypt',
  `role` ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
  `status` ENUM('active', 'invited', 'suspended') NOT NULL DEFAULT 'invited',
  `is_deleted` BIT(1) DEFAULT 0 NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`),
  INDEX `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Contact Messages table
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BIT(1) DEFAULT 0 NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Posts table
CREATE TABLE `posts` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `image` TEXT NOT NULL COMMENT 'Banner image URL',
  `thumbnail` TEXT NOT NULL COMMENT 'Thumbnail image URL',
  `category_id` VARCHAR(50) NOT NULL,
  `author_id` INT NOT NULL,
  `date` VARCHAR(50) NOT NULL COMMENT 'Formatted date string like "Aug 8, 2025"',
  `read_time` VARCHAR(20),
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `content` LONGTEXT COMMENT 'HTML content from Lexical editor',
  `sidebar_banner` JSON COMMENT 'Sidebar banner data as JSON',
  `is_deleted` BIT(1) DEFAULT 0 NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE RESTRICT,
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_author_id` (`author_id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_date` (`date`),
  INDEX `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Material Icons Reference for Areas:
-- beach_access, location_city, terrain, water, forest, landscape, museum, castle, temple_buddhist, nature
-- 
-- Material Icons Reference for Countries:
-- location_on, flag, public, map, place, explore, travel_explore
--
-- Material Icons Reference for Categories:
-- Categories: computer, rocket_launch, sports_basketball, pie_chart, school, flight, restaurant, 
--             local_movies, music_note, palette, fitness_center, science, psychology, book, history, nature_people
-- Cities (is_city=TRUE): location_city, apartment, beach_access, restaurant, park, museum, castle, 
--                        temple_buddhist, shopping_bag, nightlife, business
--
-- See scripts/material-icons-reference.md for full list

-- Insert sample Areas data
INSERT INTO `areas` (`id`, `name`, `region`, `icon`, `image`, `color_class`, `description`) VALUES
('southeast-asia', 'Southeast Asia', 'Asia', 'beach_access', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', 'bg-emerald-500/30', 'A vibrant region known for its diverse cultures, tropical landscapes, and rich history.'),
('east-asia', 'East Asia', 'Asia', 'location_city', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae', 'bg-indigo-500/30', 'Modern metropolises blending ancient traditions with cutting-edge technology.');

-- Insert sample Countries data
INSERT INTO `countries` (`id`, `name`, `region`, `icon`, `image`, `color_class`, `description`, `area_id`) VALUES
('vietnam', 'Vietnam', 'Asia', 'location_on', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', 'bg-red-400/30', 'Explore the beauty of Vietnam', 'southeast-asia'),
('korea', 'Korea', 'Asia', 'location_on', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae', 'bg-indigo-900/40', 'Discover Korean culture', 'east-asia');

-- Insert sample Categories data (mix of regular categories and cities)
INSERT INTO `categories` (`id`, `name`, `icon`, `image`, `color_class`, `description`, `is_city`, `area_id`, `country_id`) VALUES
('tech', 'Tech', 'computer', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae', 'bg-indigo-900/40', 'Breaking down innovations, gadgets, and digital shifts in everyday life.', FALSE, NULL, NULL),
('business', 'Business', 'pie_chart', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGRo_C1FHV7zfmRFDZzvLwGaX19EVvAh6sJmEVkCvMpj_QU2orns59kJ0sNQAsA7QUyKltSYXCyhwSv2IhSvIimyyZDSVDTQjCUZ9UiGZGURseiTQvcTQQqYTxTXRgGfGvUCxPEt1Vl0SYOLlOk3PxsBDveKFopZwfDq1oceLVMBXvLeG-oMmr2lJP4qKFlWE-y4gPmLyuhPI3pb53H2C0PzZXQAGjzhCQzeVXVqx6O6QHlK1SkTWh-cAs23aOl-hbzOmgKDnfLmJ7', 'bg-orange-500/20', 'Where strategy meets execution—insights for today\'s professionals.', FALSE, NULL, NULL),
('hanoi', 'Hanoi', 'location_city', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', 'bg-emerald-500/20', 'The capital city of Vietnam, rich in history, food, and street life.', TRUE, 'southeast-asia', 'vietnam'),
('ho-chi-minh-city', 'Ho Chi Minh City', 'apartment', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPX7XfIue5ew9mBidlCsn6NPkoBAPJUXEFDWlNsTjFKM1OKZ_nWkfYAlEIIlD4Iu8wNSNKtxw3y15N1zW9saBSEuFfBVgAoT5jDAwUHQ3bkQf-7oltaW50bhT_NOmwZRf8MB4vDZCa8YDMIcetsTCeumdJ2EXKMxNUGjCHeiOT1TN5JnvPcEnSX0sxWZJZkeRVwqQ2LvluUkGq1td-xJ-f313AubYYXXMILdmZcs4y4JapQb_5btqmz9jRThsnVf_P699ptt2mP_ae', 'bg-red-500/20', 'Vietnam\'s largest city, fast-paced and packed with energy.', TRUE, 'southeast-asia', 'vietnam'),
('seoul', 'Seoul', 'location_city', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPyH1It7mPYLVY97FblovAeScYYB7xvyZWmjkhRDwJLHxXLAXYak-zFyCWDooKEtG9HEyFhDyYcFF4XarCZ7rO3WvaeHdMiPWrp7zBweI12u0GVxwS1J04WLJSJumkTkP_z_20tMJLhi4xMh6x1JJqjQHeIi5dC9WZD4I-RFWrjXmClbe8QcC3LBuKYdd9A-9HEOXMMwvBJbAvuDxT3b6kUalf-71EY1NlDB9xHm5oMb9VTGNQ4nUvPSIclzQKcB2qvOOuUXf7SOT1', 'bg-indigo-500/20', 'A modern megacity where tech, culture, and tradition meet.', TRUE, 'east-asia', 'korea');

-- Insert sample Author data
INSERT INTO `authors` (`id`, `name`, `avatar`) VALUES
(1, 'Rowan Blake', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEWE4PWVi-noHBer7hGHoPTj9HHSHWkhCSm8jAIU7JRRLpAuDdFmPTmiklMA2fgMjbTiLdRnBV55W9xH6cwyLcOfNx3faVnhuIucoX9u4_OlGQLFuoUyono7PXfkKveBfJ1Awu5TNhlbhpVhe4egCmuSKSc4wk_tUi07posmV5U_WDxh8znK9HUNsrNdE4RiRxQa5-RNh1FIHRJu90o6a8AhqWMRtvk06Y6DJO7EE4u-wxfobXM_QLSDeYdMRIiuGskhhhh9TAhX0y');

-- Insert sample Users data
-- Note: Passwords are hashed using bcrypt. Default password is 'password123' for all users
-- To generate hash: bcrypt.hashSync('password123', 10)
-- For production, use strong passwords and proper password hashing
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`) VALUES
('admin', 'Admin User', 'admin@recap.local', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'admin', 'active'),
('content-editor', 'Content Editor', 'editor@recap.local', '$2a$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'editor', 'invited');

-- Insert sample Posts data
INSERT INTO `posts` (`id`, `title`, `excerpt`, `image`, `thumbnail`, `category_id`, `author_id`, `date`, `slug`, `content`, `sidebar_banner`) VALUES
('1', 'Pitching Your Idea: A Guide to Presenting with Impact', 'Wherever you\'re headed, pause here to reset, reflect, and bring something meaningful with you.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUKeEOzIhySMwVoKPIhACTUJbrVksfDlBAc0jXyJQrk8AJWzrF1y5OXlE4d0i2cBRxKpTSinmUyFt7Mj1Xj2L3m6KmsNBgA2uMpAYh3gCf0Itwjr0YbkC4TrNWpq0emAoeMyXk6YP62WL_U04RUiDW1ZucL75inIRfWakvJaeJITLmKl5NBEC1wDLpjwNiG7Gn6s0bXj7QBvnOrYSvA4WpL5kzPWGIK75vtLzlvXZ4thFQfEqAunPl8QYM-9lu9Q6CCHpK9_lhU60E', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUKeEOzIhySMwVoKPIhACTUJbrVksfDlBAc0jXyJQrk8AJWzrF1y5OXlE4d0i2cBRxKpTSinmUyFt7Mj1Xj2L3m6KmsNBgA2uMpAYh3gCf0Itwjr0YbkC4TrNWpq0emAoeMyXk6YP62WL_U04RUiDW1ZucL75inIRfWakvJaeJITLmKl5NBEC1wDLpjwNiG7Gn6s0bXj7QBvnOrYSvA4WpL5kzPWGIK75vtLzlvXZ4thFQfEqAunPl8QYM-9lu9Q6CCHpK9_lhU60E', 'business', 1, 'Aug 8, 2025', 'pitching_your_idea_a_guide_to_presenting_with_impact', '<p class="lead text-xl text-gray-600 mb-8">Whether you\'re managing a product roadmap, organizing a work project, planning a travel itinerary, or preparing for an upcoming season, one of the biggest challenges is figuring out what to do first.</p><p>In today\'s world, distractions are everywhere, resources are limited, and to-do lists seem to grow by the hour. Without a system to guide your choices, it\'s easy to get stuck in reactive mode—working hard but not necessarily working smart. That\'s where prioritization frameworks come in.</p><h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Getting Lost in "Busy Work"</h2><p>In every field—whether you\'re a student, entrepreneur, team leader, or solo professional—it\'s easy to confuse activity with progress.</p>', JSON_OBJECT('badge', 'Ultimate Guide', 'title', 'Follow the\nThought Trail', 'description', 'Explore all topics and find the ones that matter to you.', 'buttonText', 'Explore Categories', 'buttonLink', '/categories', 'backgroundColor', '#4c1d95')),
('2', 'Turning Big Ideas into Real-World Achievements', 'Easy to reflect on and even easier to use — these thoughts can improve both action and intention.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-BEE3WsGEv3iXs9vnd2KUQAhlPyu1qccZUjkqMqlR1I5OeQKa9lcBlkqOKhDCO1PHqKWjuXaj3hnN8jyKT7aVhp_tMRO6b3nQ3PYdc9KKzf-J3x-ewaHmVJHKBsNyPdAIjb_oD5UCWjcvCk9nmfV8DusJs_qr1v2Tf_WNCV5k1qBFIqWVy1fxJ1d0mtJ29On6h09NNdWtS_3-S2sHI1cZ3RXXeBFCzxh5vegbdQGSokQ4uS6uMvS1GT-bQBUdqxABryHQdrDtOIqO', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-BEE3WsGEv3iXs9vnd2KUQAhlPyu1qccZUjkqMqlR1I5OeQKa9lcBlkqOKhDCO1PHqKWjuXaj3hnN8jyKT7aVhp_tMRO6b3nQ3PYdc9KKzf-J3x-ewaHmVJHKBsNyPdAIjb_oD5UCWjcvCk9nmfV8DusJs_qr1v2Tf_WNCV5k1qBFIqWVy1fxJ1d0mtJ29On6h09NNdWtS_3-S2sHI1cZ3RXXeBFCzxh5vegbdQGSokQ4uS6uMvS1GT-bQBUdqxABryHQdrDtOIqO', 'tech', 1, 'Aug 5, 2025', 'turning_big_ideas_into_real_world_achievements', '<p class="lead text-xl text-gray-600 mb-8">Whether you\'re managing a product roadmap, organizing a work project, planning a travel itinerary, or preparing for an upcoming season, one of the biggest challenges is figuring out what to do first.</p><p>In today\'s world, distractions are everywhere, resources are limited, and to-do lists seem to grow by the hour.</p>', NULL),
('10', 'Exploring the Historic Streets of Hanoi', 'Discover the charm of Vietnam\'s capital city, from ancient temples to bustling street markets.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', 'hanoi', 1, 'Aug 10, 2025', 'exploring_the_historic_streets_of_hanoi', '<p class="lead text-xl text-gray-600 mb-8">Hanoi, the capital of Vietnam, is a city where ancient traditions meet modern life in perfect harmony.</p><p>From the historic Old Quarter with its narrow streets and colonial architecture to the serene Hoan Kiem Lake, Hanoi offers a unique blend of culture, history, and vibrant street life.</p><h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">The Old Quarter Experience</h2><p>Wander through the maze of streets in the Old Quarter, each named after the goods once sold there.</p>', JSON_OBJECT('badge', 'City Guide', 'title', 'Discover\nHanoi', 'description', 'Explore the rich culture and history of Vietnam\'s capital.', 'buttonText', 'More Stories', 'buttonLink', '/hanoi', 'backgroundColor', '#059669'));

-- Add is_deleted column to all tables (soft delete support)
ALTER TABLE `areas` ADD COLUMN `is_deleted` BIT(1) DEFAULT 0 NOT NULL AFTER `description`;
ALTER TABLE `countries` ADD COLUMN `is_deleted` BIT(1) DEFAULT 0 NOT NULL AFTER `description`;
ALTER TABLE `categories` ADD COLUMN `is_deleted` BIT(1) DEFAULT 0 NOT NULL AFTER `description`;
ALTER TABLE `authors` ADD COLUMN `is_deleted` BIT(1) DEFAULT 0 NOT NULL AFTER `avatar`;
ALTER TABLE `posts` ADD COLUMN `is_deleted` BIT(1) DEFAULT 0 NOT NULL AFTER `sidebar_banner`;

-- Add indexes for is_deleted for better query performance
ALTER TABLE `areas` ADD INDEX `idx_is_deleted` (`is_deleted`);
ALTER TABLE `countries` ADD INDEX `idx_is_deleted` (`is_deleted`);
ALTER TABLE `categories` ADD INDEX `idx_is_deleted` (`is_deleted`);
ALTER TABLE `authors` ADD INDEX `idx_is_deleted` (`is_deleted`);
ALTER TABLE `posts` ADD INDEX `idx_is_deleted` (`is_deleted`);

-- Display summary
SELECT 'Database setup completed!' AS message;
SELECT COUNT(*) AS total_areas FROM `areas`;
SELECT COUNT(*) AS total_countries FROM `countries`;
SELECT COUNT(*) AS total_categories FROM `categories`;
SELECT COUNT(*) AS total_authors FROM `authors`;
SELECT COUNT(*) AS total_posts FROM `posts`;


INSERT INTO areas (

  id, name, region, icon, image, color_class, description, is_deleted

) VALUES

(

  'asia',

  'Asia',

  'asia',

  'temple_buddhist',

  'https://intertour.vn/wp-content/uploads/2022/03/72bba177-4a26-4dde-8f91-f6f052973e78.jpg',

  'bg-red-500',

  'Asia is the largest continent, known for its diverse cultures, ancient civilizations, and breathtaking natural landscapes.',

  0

),

(

  'europe',

  'Europe',

  'europe',

  'castle',

  'https://www.elle.vn/wp-content/uploads/2020/08/16/411910/Castle-in-Love-with-the-Wind.jpg',

  'bg-blue-500',

  'Europe is famous for its rich history, architectural heritage, art, and cultural diversity.',

  0

),

(

  'africa',

  'Africa',

  'africa',

  'nature',

  'https://media.cntraveller.com/photos/656735185529fa5c61ddf276/16:9/w_2560%2Cc_limit/Cape_Town_When_to_Visit_South_Africa_November_GettyImages-671323338.jpg',

  'bg-yellow-500',

  'Africa offers vast savannas, unique wildlife, ancient cultures, and stunning natural beauty.',

  0

),

(

  'north-america',

  'North America',

  'america',

  'location_city',

  'https://c.wallhere.com/photos/0a/c7/nature_landscape_photography_USA_North_America_Yosemite_Valley_California_mountains-2123661.jpg!d',

  'bg-green-500',

  'North America features modern cities, national parks, and a wide range of landscapes.',

  0

),

(

  'south-america',

  'South America',

  'america',

  'forest',

  'https://www.bain.com/contentassets/23f69640410a4ab5b1e04d7a32663d8c/conquering-the-food-challenge-3.0-16_9.jpg',

  'bg-emerald-500',

  'South America is known for rainforests, mountains, ancient civilizations, and vibrant cultures.',

  0

),

(

  'oceania',

  'Oceania',

  'oceania',

  'beach_access',

  'https://wallpaperaccess.com/full/1564382.jpg',

  'bg-cyan-500',

  'Oceania includes island nations with beautiful beaches, coral reefs, and unique wildlife.',

  0

),

(

  'middle-east',

  'Middle East',

  'middle_east',

  'museum',

  'https://media.vneconomy.vn/images/upload/2022/11/14/duvbai3.png',

  'bg-orange-500',

  'The Middle East is rich in ancient history, religious heritage, deserts, and cultural landmarks.',

  0

),

(

  'antarctica',

  'Antarctica',

  'antarctica',

  'landscape',

  'https://wallpaperaccess.com/full/1449363.jpg',

  'bg-slate-500',

  'Antarctica is a remote continent known for its icy landscapes and untouched wilderness.',

  0

);


INSERT INTO countries
(id, name, region, icon, image, color_class, description, is_deleted, area_id)
VALUES
('afghanistan','Afghanistan','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg',
'bg-red-500','Afghanistan is a landlocked country with rugged mountains and ancient history.',0,'asia'),

('armenia','Armenia','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/2/2f/Flag_of_Armenia.svg',
'bg-red-500','Armenia is known for its ancient churches and mountainous landscapes.',0,'asia'),

('azerbaijan','Azerbaijan','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg',
'bg-red-500','Azerbaijan lies at the crossroads of Eastern Europe and Western Asia.',0,'asia'),

('bahrain','Bahrain','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Bahrain.svg',
'bg-red-500','Bahrain is an island nation in the Persian Gulf.',0,'asia'),

('bangladesh','Bangladesh','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg',
'bg-red-500','Bangladesh is known for its rivers and vibrant culture.',0,'asia'),

('bhutan','Bhutan','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/9/91/Flag_of_Bhutan.svg',
'bg-red-500','Bhutan is famous for its Gross National Happiness philosophy.',0,'asia'),

('brunei','Brunei','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/9/9c/Flag_of_Brunei.svg',
'bg-red-500','Brunei is a small, wealthy nation on the island of Borneo.',0,'asia'),

('cambodia','Cambodia','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg',
'bg-red-500','Cambodia is home to Angkor Wat and rich Khmer heritage.',0,'asia'),

('china','China','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
'bg-red-500','China is one of the world’s oldest civilizations.',0,'asia'),

('cyprus','Cyprus','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Cyprus.svg',
'bg-red-500','Cyprus is an island nation in the Eastern Mediterranean.',0,'asia'),

('georgia','Georgia','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Georgia.svg',
'bg-red-500','Georgia is known for its wine-making tradition and mountains.',0,'asia'),

('india','India','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg',
'bg-red-500','India is known for its cultural diversity and ancient heritage.',0,'asia'),

('indonesia','Indonesia','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg',
'bg-red-500','Indonesia is the world’s largest archipelago.',0,'asia'),

('iran','Iran','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/c/ca/Flag_of_Iran.svg',
'bg-red-500','Iran has a rich Persian history and culture.',0,'asia'),

('iraq','Iraq','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/f/f6/Flag_of_Iraq.svg',
'bg-red-500','Iraq is home to ancient Mesopotamian civilizations.',0,'asia'),

('israel','Israel','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Israel.svg',
'bg-red-500','Israel is significant for its historical and religious heritage.',0,'asia'),

('japan','Japan','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg',
'bg-red-500','Japan blends ancient tradition with modern technology.',0,'asia'),

('jordan','Jordan','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/c/c0/Flag_of_Jordan.svg',
'bg-red-500','Jordan is home to Petra and desert landscapes.',0,'asia'),

('kazakhstan','Kazakhstan','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg',
'bg-red-500','Kazakhstan is the largest landlocked country in the world.',0,'asia'),

('kuwait','Kuwait','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/a/aa/Flag_of_Kuwait.svg',
'bg-red-500','Kuwait is a wealthy Gulf nation rich in oil.',0,'asia'),

('laos','Laos','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/5/56/Flag_of_Laos.svg',
'bg-red-500','Laos is known for mountains and Buddhist culture.',0,'asia'),

('lebanon','Lebanon','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/5/59/Flag_of_Lebanon.svg',
'bg-red-500','Lebanon has a long Mediterranean coastline.',0,'asia'),

('malaysia','Malaysia','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg',
'bg-red-500','Malaysia is known for tropical rainforests and modern cities.',0,'asia'),

('maldives','Maldives','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/0/0f/Flag_of_Maldives.svg',
'bg-red-500','Maldives is famous for luxury islands and beaches.',0,'asia'),

('mongolia','Mongolia','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Mongolia.svg',
'bg-red-500','Mongolia is known for vast steppes and nomadic culture.',0,'asia'),

('myanmar','Myanmar','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/8/8c/Flag_of_Myanmar.svg',
'bg-red-500','Myanmar has ancient temples and rich traditions.',0,'asia'),

('nepal','Nepal','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg',
'bg-red-500','Nepal is home to Mount Everest.',0,'asia'),

('north-korea','North Korea','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/5/51/Flag_of_North_Korea.svg',
'bg-red-500','North Korea is a highly centralized state.',0,'asia'),

('pakistan','Pakistan','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg',
'bg-red-500','Pakistan has diverse landscapes and ancient civilizations.',0,'asia'),

('philippines','Philippines','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/9/99/Flag_of_the_Philippines.svg',
'bg-red-500','Philippines is made up of more than 7,000 islands.',0,'asia'),

('singapore','Singapore','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Singapore.svg',
'bg-red-500','Singapore is a global financial hub.',0,'asia'),

('south-korea','South Korea','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg',
'bg-red-500','South Korea is known for technology and pop culture.',0,'asia'),

('sri-lanka','Sri Lanka','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Sri_Lanka.svg',
'bg-red-500','Sri Lanka is famous for tea and ancient ruins.',0,'asia'),

('thailand','Thailand','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_Thailand.svg',
'bg-red-500','Thailand is known for temples and tropical beaches.',0,'asia'),

('vietnam','Vietnam','asia','flag',
'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg',
'bg-red-500','Vietnam has rich history and diverse landscapes.',0,'asia');


UPDATE countries SET image = CASE id
  WHEN 'afghanistan' THEN 'https://cdn.britannica.com/75/97075-050-B000D607/Blue-Mosque-Afghanistan-Mazar-e-Sharif.jpg'
  WHEN 'armenia' THEN 'https://tse4.mm.bing.net/th/id/OIP.wFctzsQOKRcpLCQ2F1A_kwHaFR?pid=Api&P=0&h=220'
  WHEN 'azerbaijan' THEN 'https://www.roadaffair.com/wp-content/uploads/2018/04/panoramic-view-baku-azerbaijan-shutterstock_544217959.jpg'
  WHEN 'bahrain' THEN 'https://wowtovisit.com/wp-content/uploads/2021/06/photo-1547548731-e95343697eb4.jpg'
  WHEN 'bangladesh' THEN 'https://www.worldatlas.com/r/w1200/upload/1e/19/60/dhaka-bangladesh.jpg'
  WHEN 'bhutan' THEN 'https://i0.wp.com/www.littlebhutan.com/wp-content/uploads/2013/04/Tashichho-Dzong-Fortress.jpg?ssl=1'
  WHEN 'brunei' THEN 'https://cdn.britannica.com/31/189831-050-52E72E18/Sultan-Omar-Ali-Saifuddien-Mosque-Brunei-Bandar.jpg'
  WHEN 'cambodia' THEN 'https://cdn.britannica.com/24/77424-050-4FF80B58/Angkor-Wat-Cambodia.jpg'
  WHEN 'china' THEN 'https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2023/01/31124623/Great-Wall-Of-China-1600x900.jpg'
  WHEN 'cyprus' THEN 'https://www.worldtravelguide.net/wp-content/uploads/2017/04/Think-Cyprus-AyiaNapa-514991484-Kirillm-copy.jpg'
  WHEN 'georgia' THEN 'https://www.state.gov/wp-content/uploads/2018/11/Georgia-2109x1406.jpg'
  WHEN 'india' THEN 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'indonesia' THEN 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'iran' THEN 'https://images.pexels.com/photos/2890532/pexels-photo-2890532.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'iraq' THEN 'https://images.pexels.com/photos/11132223/pexels-photo-11132223.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'israel' THEN 'https://images.pexels.com/photos/4342493/pexels-photo-4342493.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'japan' THEN 'https://images.pexels.com/photos/590478/pexels-photo-590478.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'jordan' THEN 'https://images.pexels.com/photos/1631661/pexels-photo-1631661.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'kazakhstan' THEN 'https://images.pexels.com/photos/4034878/pexels-photo-4034878.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'kuwait' THEN 'https://images.pexels.com/photos/3382414/pexels-photo-3382414.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'laos' THEN 'https://images.pexels.com/photos/16644558/pexels-photo-16644558.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'lebanon' THEN 'https://images.pexels.com/photos/3860555/pexels-photo-3860555.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'malaysia' THEN 'https://images.pexels.com/photos/415444/pexels-photo-415444.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'maldives' THEN 'https://images.pexels.com/photos/1287441/pexels-photo-1287441.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'mongolia' THEN 'https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'myanmar' THEN 'https://images.pexels.com/photos/11499591/pexels-photo-11499591.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'nepal' THEN 'https://images.pexels.com/photos/2106132/pexels-photo-2106132.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'north-korea' THEN 'https://images.pexels.com/photos/12316281/pexels-photo-12316281.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'pakistan' THEN 'https://images.pexels.com/photos/2733047/pexels-photo-2733047.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'philippines' THEN 'https://images.pexels.com/photos/1647121/pexels-photo-1647121.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'singapore' THEN 'https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'south-korea' THEN 'https://images.pexels.com/photos/2361060/pexels-photo-2361060.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'sri-lanka' THEN 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'thailand' THEN 'https://images.pexels.com/photos/415708/pexels-photo-415708.jpeg?auto=compress&cs=tinysrgb&w=1200'
  WHEN 'vietnam' THEN 'https://images.pexels.com/photos/450441/pexels-photo-450441.jpeg?auto=compress&cs=tinysrgb&w=1200'
END
WHERE id IN ('afghanistan','armenia','azerbaijan','bahrain','bangladesh','bhutan','brunei','cambodia','china','cyprus','georgia','india','indonesia','iran','iraq','israel','japan','jordan','kazakhstan','kuwait','laos','lebanon','malaysia','maldives','mongolia','myanmar','nepal','north-korea','pakistan','philippines','singapore','south-korea','sri-lanka','thailand','vietnam');