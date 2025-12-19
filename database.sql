-- MariaDB Database Schema for Recap Blog
-- Created based on data.ts structure

-- Drop tables if they exist (for fresh setup)
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
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  `area_id` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Categories table (includes both categories and cities)
CREATE TABLE `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `image` TEXT NOT NULL,
  `color_class` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `is_city` BOOLEAN DEFAULT FALSE,
  `area_id` VARCHAR(50),
  `country_id` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL,
  INDEX `idx_is_city` (`is_city`),
  INDEX `idx_area_id` (`area_id`),
  INDEX `idx_country_id` (`country_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Authors table
CREATE TABLE `authors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `avatar` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE RESTRICT,
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_author_id` (`author_id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- Insert sample Posts data
INSERT INTO `posts` (`id`, `title`, `excerpt`, `image`, `thumbnail`, `category_id`, `author_id`, `date`, `slug`, `content`, `sidebar_banner`) VALUES
('1', 'Pitching Your Idea: A Guide to Presenting with Impact', 'Wherever you\'re headed, pause here to reset, reflect, and bring something meaningful with you.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUKeEOzIhySMwVoKPIhACTUJbrVksfDlBAc0jXyJQrk8AJWzrF1y5OXlE4d0i2cBRxKpTSinmUyFt7Mj1Xj2L3m6KmsNBgA2uMpAYh3gCf0Itwjr0YbkC4TrNWpq0emAoeMyXk6YP62WL_U04RUiDW1ZucL75inIRfWakvJaeJITLmKl5NBEC1wDLpjwNiG7Gn6s0bXj7QBvnOrYSvA4WpL5kzPWGIK75vtLzlvXZ4thFQfEqAunPl8QYM-9lu9Q6CCHpK9_lhU60E', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUKeEOzIhySMwVoKPIhACTUJbrVksfDlBAc0jXyJQrk8AJWzrF1y5OXlE4d0i2cBRxKpTSinmUyFt7Mj1Xj2L3m6KmsNBgA2uMpAYh3gCf0Itwjr0YbkC4TrNWpq0emAoeMyXk6YP62WL_U04RUiDW1ZucL75inIRfWakvJaeJITLmKl5NBEC1wDLpjwNiG7Gn6s0bXj7QBvnOrYSvA4WpL5kzPWGIK75vtLzlvXZ4thFQfEqAunPl8QYM-9lu9Q6CCHpK9_lhU60E', 'business', 1, 'Aug 8, 2025', 'pitching_your_idea_a_guide_to_presenting_with_impact', '<p class="lead text-xl text-gray-600 mb-8">Whether you\'re managing a product roadmap, organizing a work project, planning a travel itinerary, or preparing for an upcoming season, one of the biggest challenges is figuring out what to do first.</p><p>In today\'s world, distractions are everywhere, resources are limited, and to-do lists seem to grow by the hour. Without a system to guide your choices, it\'s easy to get stuck in reactive mode—working hard but not necessarily working smart. That\'s where prioritization frameworks come in.</p><h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Getting Lost in "Busy Work"</h2><p>In every field—whether you\'re a student, entrepreneur, team leader, or solo professional—it\'s easy to confuse activity with progress.</p>', JSON_OBJECT('badge', 'Ultimate Guide', 'title', 'Follow the\nThought Trail', 'description', 'Explore all topics and find the ones that matter to you.', 'buttonText', 'Explore Categories', 'buttonLink', '/categories', 'backgroundColor', '#4c1d95')),
('2', 'Turning Big Ideas into Real-World Achievements', 'Easy to reflect on and even easier to use — these thoughts can improve both action and intention.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-BEE3WsGEv3iXs9vnd2KUQAhlPyu1qccZUjkqMqlR1I5OeQKa9lcBlkqOKhDCO1PHqKWjuXaj3hnN8jyKT7aVhp_tMRO6b3nQ3PYdc9KKzf-J3x-ewaHmVJHKBsNyPdAIjb_oD5UCWjcvCk9nmfV8DusJs_qr1v2Tf_WNCV5k1qBFIqWVy1fxJ1d0mtJ29On6h09NNdWtS_3-S2sHI1cZ3RXXeBFCzxh5vegbdQGSokQ4uS6uMvS1GT-bQBUdqxABryHQdrDtOIqO', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-BEE3WsGEv3iXs9vnd2KUQAhlPyu1qccZUjkqMqlR1I5OeQKa9lcBlkqOKhDCO1PHqKWjuXaj3hnN8jyKT7aVhp_tMRO6b3nQ3PYdc9KKzf-J3x-ewaHmVJHKBsNyPdAIjb_oD5UCWjcvCk9nmfV8DusJs_qr1v2Tf_WNCV5k1qBFIqWVy1fxJ1d0mtJ29On6h09NNdWtS_3-S2sHI1cZ3RXXeBFCzxh5vegbdQGSokQ4uS6uMvS1GT-bQBUdqxABryHQdrDtOIqO', 'tech', 1, 'Aug 5, 2025', 'turning_big_ideas_into_real_world_achievements', '<p class="lead text-xl text-gray-600 mb-8">Whether you\'re managing a product roadmap, organizing a work project, planning a travel itinerary, or preparing for an upcoming season, one of the biggest challenges is figuring out what to do first.</p><p>In today\'s world, distractions are everywhere, resources are limited, and to-do lists seem to grow by the hour.</p>', NULL),
('10', 'Exploring the Historic Streets of Hanoi', 'Discover the charm of Vietnam\'s capital city, from ancient temples to bustling street markets.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ79sBnTpKqZYlaaniBy55_u4MmTgkVfYZXAAGkz6v6nE_LLfxhuwueJXISwgEFplFbkh-h72SLXUhhtxdAevBb2BYrQ3i0Dyn-2HTNYrO-Ma1ECGPtK2xzTBRXEGw9Y2Pr-NpJZy-JwJSscJGnvTNk0m3KK6CVveaQkPD1zJ5FwOQBGnfwONhdv72p6cWyXz9T7KC_qhBdpnJ7KTifXYVK_3L7q7iRkNzkvc2Izi5R3tZtg9AKreU9WnpDcl5U4bqBKjjfdNbHlsM', 'hanoi', 1, 'Aug 10, 2025', 'exploring_the_historic_streets_of_hanoi', '<p class="lead text-xl text-gray-600 mb-8">Hanoi, the capital of Vietnam, is a city where ancient traditions meet modern life in perfect harmony.</p><p>From the historic Old Quarter with its narrow streets and colonial architecture to the serene Hoan Kiem Lake, Hanoi offers a unique blend of culture, history, and vibrant street life.</p><h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">The Old Quarter Experience</h2><p>Wander through the maze of streets in the Old Quarter, each named after the goods once sold there.</p>', JSON_OBJECT('badge', 'City Guide', 'title', 'Discover\nHanoi', 'description', 'Explore the rich culture and history of Vietnam\'s capital.', 'buttonText', 'More Stories', 'buttonLink', '/hanoi', 'backgroundColor', '#059669'));

-- Display summary
SELECT 'Database setup completed!' AS message;
SELECT COUNT(*) AS total_areas FROM `areas`;
SELECT COUNT(*) AS total_countries FROM `countries`;
SELECT COUNT(*) AS total_categories FROM `categories`;
SELECT COUNT(*) AS total_authors FROM `authors`;
SELECT COUNT(*) AS total_posts FROM `posts`;

