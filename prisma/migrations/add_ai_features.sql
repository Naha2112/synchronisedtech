-- Add AI Analysis tables for storing AI insights

-- AI Analysis for Invoices
CREATE TABLE IF NOT EXISTS `AI_Analysis` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `invoice_id` INT NOT NULL,
  `type` ENUM('CATEGORIZATION', 'SENTIMENT', 'PREDICTION') NOT NULL,
  `result` JSON NOT NULL,
  `confidence` DECIMAL(3,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_invoice_type` (`invoice_id`, `type`),
  INDEX `idx_created_at` (`created_at`),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI Analysis for Clients  
CREATE TABLE IF NOT EXISTS `Client_AI_Analysis` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `type` ENUM('FOLLOWUP', 'SENTIMENT', 'PREDICTION') NOT NULL,
  `result` JSON NOT NULL,
  `confidence` DECIMAL(3,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_client_type` (`client_id`, `type`),
  INDEX `idx_created_at` (`created_at`),
  FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add AI-related columns to existing tables (check if exists first)
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE table_name = 'invoices' 
   AND table_schema = DATABASE() 
   AND column_name = 'category') = 0,
  'ALTER TABLE `invoices` ADD COLUMN `category` VARCHAR(100) DEFAULT NULL',
  'SELECT "Column category already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE table_name = 'invoices' 
   AND table_schema = DATABASE() 
   AND column_name = 'subcategory') = 0,
  'ALTER TABLE `invoices` ADD COLUMN `subcategory` VARCHAR(100) DEFAULT NULL',
  'SELECT "Column subcategory already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE table_name = 'invoices' 
   AND table_schema = DATABASE() 
   AND column_name = 'tags') = 0,
  'ALTER TABLE `invoices` ADD COLUMN `tags` TEXT DEFAULT NULL',
  'SELECT "Column tags already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE table_name = 'invoices' 
   AND table_schema = DATABASE() 
   AND column_name = 'ai_confidence') = 0,
  'ALTER TABLE `invoices` ADD COLUMN `ai_confidence` DECIMAL(3,2) DEFAULT NULL',
  'SELECT "Column ai_confidence already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add client relationship tracking columns
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE table_name = 'clients' 
   AND table_schema = DATABASE() 
   AND column_name = 'last_contact_date') = 0,
  'ALTER TABLE `clients` ADD COLUMN `last_contact_date` TIMESTAMP DEFAULT NULL',
  'SELECT "Column last_contact_date already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE table_name = 'clients' 
   AND table_schema = DATABASE() 
   AND column_name = 'payment_rating') = 0,
  'ALTER TABLE `clients` ADD COLUMN `payment_rating` ENUM(\'excellent\', \'good\', \'poor\', \'new\') DEFAULT \'new\'',
  'SELECT "Column payment_rating already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE table_name = 'clients' 
   AND table_schema = DATABASE() 
   AND column_name = 'notes') = 0,
  'ALTER TABLE `clients` ADD COLUMN `notes` TEXT DEFAULT NULL',
  'SELECT "Column notes already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE table_name = 'clients' 
   AND table_schema = DATABASE() 
   AND column_name = 'sentiment_score') = 0,
  'ALTER TABLE `clients` ADD COLUMN `sentiment_score` DECIMAL(3,2) DEFAULT NULL',
  'SELECT "Column sentiment_score already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- AI Insights summary table
CREATE TABLE IF NOT EXISTS `AI_Insights` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` ENUM('CATEGORIZATION', 'FOLLOWUP', 'PREDICTION', 'SENTIMENT') NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `confidence` DECIMAL(3,2) DEFAULT 0.00,
  `impact` ENUM('high', 'medium', 'low') DEFAULT 'medium',
  `action_required` BOOLEAN DEFAULT FALSE,
  `metadata` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_type_impact` (`type`, `impact`),
  INDEX `idx_action_required` (`action_required`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI Processing Queue for batch operations
CREATE TABLE IF NOT EXISTS `AI_Processing_Queue` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `task_type` ENUM('CATEGORIZATION', 'FOLLOWUP', 'PREDICTION', 'SENTIMENT') NOT NULL,
  `entity_type` ENUM('invoice', 'client', 'business') NOT NULL,
  `entity_id` INT NOT NULL,
  `status` ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  `priority` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  `input_data` JSON NOT NULL,
  `result` JSON DEFAULT NULL,
  `error_message` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `started_at` TIMESTAMP DEFAULT NULL,
  `completed_at` TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_status_priority` (`status`, `priority`),
  INDEX `idx_task_type` (`task_type`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI Model Performance tracking
CREATE TABLE IF NOT EXISTS `AI_Model_Performance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `model_type` ENUM('CATEGORIZATION', 'FOLLOWUP', 'PREDICTION', 'SENTIMENT') NOT NULL,
  `accuracy` DECIMAL(5,4) DEFAULT NULL,
  `precision_score` DECIMAL(5,4) DEFAULT NULL,
  `recall_score` DECIMAL(5,4) DEFAULT NULL,
  `f1_score` DECIMAL(5,4) DEFAULT NULL,
  `total_predictions` INT DEFAULT 0,
  `correct_predictions` INT DEFAULT 0,
  `evaluation_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `notes` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_model_type` (`model_type`),
  INDEX `idx_evaluation_date` (`evaluation_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 