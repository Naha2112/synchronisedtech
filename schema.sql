-- Automation Workflows table
CREATE TABLE IF NOT EXISTS automation_workflows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type ENUM('invoice_created', 'invoice_due', 'invoice_overdue', 'client_added') NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Workflow Steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  step_order INT NOT NULL,
  action_type ENUM('send_email', 'wait', 'update_status', 'notify') NOT NULL,
  action_data JSON,
  status ENUM('pending', 'completed', 'failed', 'in_progress') DEFAULT 'pending',
  execution_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE
);

-- Scheduled Emails Table
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_template_id INT NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  scheduled_date DATETIME NOT NULL,
  status ENUM('scheduled', 'sent', 'failed') DEFAULT 'scheduled',
  sent_date DATETIME NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (email_template_id) REFERENCES email_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Workflow Logs table
CREATE TABLE IF NOT EXISTS workflow_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  step_id INT NULL,
  action VARCHAR(255) NOT NULL,
  status ENUM('success', 'failure', 'info') NOT NULL,
  message TEXT,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE,
  FOREIGN KEY (step_id) REFERENCES workflow_steps(id) ON DELETE SET NULL
);

-- Workflow Triggers table (records of triggered workflows)
CREATE TABLE IF NOT EXISTS workflow_triggers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  trigger_type VARCHAR(50) NOT NULL,
  entity_id INT NULL,
  status ENUM('triggered', 'completed', 'failed') DEFAULT 'triggered',
  trigger_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE
);

-- Abuse Tracking table
CREATE TABLE IF NOT EXISTS abuse_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  ip_address VARCHAR(45),
  action_type ENUM('failed_login', 'spam_email', 'rate_limit_exceeded', 'suspicious_activity') NOT NULL,
  description TEXT,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  status ENUM('active', 'resolved', 'investigating') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_action_type (action_type),
  INDEX idx_created_at (created_at)
);

-- Email Domains table
CREATE TABLE IF NOT EXISTS email_domains (
  id INT AUTO_INCREMENT PRIMARY KEY,
  domain VARCHAR(255) NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  dkim_public_key TEXT,
  dkim_private_key TEXT,
  spf_record TEXT,
  dmarc_record TEXT,
  status ENUM('pending', 'verified', 'failed', 'disabled') DEFAULT 'pending',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  verified_at TIMESTAMP NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_domain (domain),
  INDEX idx_status (status)
);

-- Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'responded', 'closed') DEFAULT 'new',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  source ENUM('website', 'email', 'phone', 'referral', 'social_media', 'other') DEFAULT 'website',
  assigned_to INT NULL,
  responded_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at),
  INDEX idx_email (email)
);

-- Payment Transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  invoice_id INT NULL,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'stripe', 'square', 'other') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded') DEFAULT 'pending',
  gateway_response TEXT,
  gateway_transaction_id VARCHAR(255),
  fee_amount DECIMAL(10, 2) DEFAULT 0.00,
  net_amount DECIMAL(10, 2) NOT NULL,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_invoice_id (invoice_id),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Subscription Limits table
CREATE TABLE IF NOT EXISTS subscription_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_type ENUM('free', 'basic', 'pro', 'enterprise') DEFAULT 'free',
  max_clients INT DEFAULT 10,
  max_invoices_per_month INT DEFAULT 50,
  max_email_templates INT DEFAULT 5,
  max_scheduled_emails_per_month INT DEFAULT 100,
  max_automations INT DEFAULT 3,
  max_storage_mb INT DEFAULT 100,
  features JSON, -- Store features as JSON array
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_plan_type (plan_type),
  INDEX idx_expires_at (expires_at)
);

-- User Usage table
CREATE TABLE IF NOT EXISTS user_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  clients_created INT DEFAULT 0,
  invoices_created INT DEFAULT 0,
  emails_sent INT DEFAULT 0,
  scheduled_emails_sent INT DEFAULT 0,
  storage_used_mb DECIMAL(10, 2) DEFAULT 0.00,
  api_calls_made INT DEFAULT 0,
  automations_triggered INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_period (user_id, period_start, period_end),
  INDEX idx_user_id (user_id),
  INDEX idx_period_start (period_start)
); 