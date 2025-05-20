-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  client_id INT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status ENUM('draft', 'sent', 'viewed', 'paid', 'overdue') DEFAULT 'draft',
  notes TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  description TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  rate DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  status ENUM('draft', 'active') DEFAULT 'draft',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Automation workflows table
CREATE TABLE IF NOT EXISTS automation_workflows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type ENUM('invoice_created', 'invoice_due', 'invoice_overdue', 'client_added') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Workflow steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  step_order INT NOT NULL,
  action_type ENUM('send_email', 'wait', 'update_status', 'notify') NOT NULL,
  action_data JSON NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'in_progress') DEFAULT 'pending',
  execution_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE
);

-- Scheduled emails table
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_template_id INT NOT NULL,
  recipient_type ENUM('client', 'client_group', 'all') NOT NULL,
  recipient_data JSON,
  scheduled_date DATETIME NOT NULL,
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (email_template_id) REFERENCES email_templates(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_template_id INT,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  status ENUM('sent', 'failed', 'opened', 'clicked') NOT NULL,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email_template_id) REFERENCES email_templates(id)
);

-- Workflow logs table
CREATE TABLE IF NOT EXISTS workflow_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workflow_id INT NOT NULL,
  step_id INT,
  action VARCHAR(50) NOT NULL,
  status ENUM('success', 'failure', 'info') NOT NULL,
  message TEXT,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES automation_workflows(id) ON DELETE CASCADE,
  FOREIGN KEY (step_id) REFERENCES workflow_steps(id) ON DELETE SET NULL
);

-- Workflow triggers table
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

-- Insert demo user
INSERT INTO users (name, email, password_hash) 
VALUES ('Demo User', 'demo@autoflow.com', '$2b$10$demohashedpasswordfordemopurposesonly') 
ON DUPLICATE KEY UPDATE name = 'Demo User';
