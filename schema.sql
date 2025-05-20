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

-- Scheduled Emails table
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_template_id INT NOT NULL,
  recipient_type ENUM('client', 'client_group', 'all') NOT NULL,
  recipient_data JSON,
  scheduled_date TIMESTAMP NOT NULL,
  sent_date TIMESTAMP NULL,
  status ENUM('scheduled', 'sent', 'failed', 'cancelled') DEFAULT 'scheduled',
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