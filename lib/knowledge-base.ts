// Simple in-memory knowledge base for AutoFlow application info
interface KnowledgeItem {
  content: string;
  metadata?: Record<string, any>;
}

// In-memory storage for knowledge items
const knowledgeBase: KnowledgeItem[] = [
  {
    content: "AutoFlow is an invoice and email automation application that helps businesses streamline their workflow.",
    metadata: { type: "general", section: "about" }
  },
  {
    content: "The Invoices feature allows you to create, manage, and track invoices. You can create new invoices, view existing ones, and mark them as paid.",
    metadata: { type: "feature", section: "invoices" }
  },
  {
    content: "The Email Templates feature lets you create and manage email templates for automated communications with clients.",
    metadata: { type: "feature", section: "email-templates" }
  },
  {
    content: "Automation workflows can be set up to automatically send emails or perform actions when specific triggers occur, such as when an invoice is created or becomes overdue.",
    metadata: { type: "feature", section: "automation" }
  },
  {
    content: "The Clients section allows you to manage your client database, storing information like names, email addresses, and billing details.",
    metadata: { type: "feature", section: "clients" }
  },
  {
    content: "The AI Assistant uses OpenAI to help answer questions about using the application and can provide guidance on features.",
    metadata: { type: "feature", section: "ai" }
  },
  {
    content: "To create a new invoice, click the 'New Invoice' button in the Invoices section, fill in the details, and save it.",
    metadata: { type: "how-to", section: "invoices" }
  },
  {
    content: "To set up email automation, first create an email template, then go to the Automation section and create a new workflow with a trigger and the email action.",
    metadata: { type: "how-to", section: "automation" }
  },
  {
    content: "You can organize your clients by creating custom fields and filtering options to better manage your customer database.",
    metadata: { type: "how-to", section: "clients" }
  },
  {
    content: "Invoice status can be draft, sent, viewed, paid, or overdue. The system can automatically update statuses based on events like payment receipt.",
    metadata: { type: "feature", section: "invoices" }
  },
  {
    content: "Email templates support variables that are automatically filled with client and invoice data when an email is sent.",
    metadata: { type: "feature", section: "email-templates" }
  },
  {
    content: "The dashboard provides an overview of your business with metrics like total revenue, pending invoices, and overdue payments.",
    metadata: { type: "feature", section: "dashboard" }
  },
  {
    content: "Email template example for invoice reminder: 'Subject: Invoice #{{invoice_number}} Reminder\n\nDear {{client_name}},\n\nThis is a friendly reminder that invoice #{{invoice_number}} for {{invoice_amount}} is due on {{due_date}}.\n\nPlease let us know if you have any questions.\n\nRegards,\n{{company_name}}'",
    metadata: { type: "example", section: "email-templates" }
  },
  {
    content: "Email template example for payment receipt: 'Subject: Payment Received - Invoice #{{invoice_number}}\n\nDear {{client_name}},\n\nThank you for your payment of {{payment_amount}} for invoice #{{invoice_number}}.\n\nWe appreciate your business!\n\nRegards,\n{{company_name}}'",
    metadata: { type: "example", section: "email-templates" }
  },
  {
    content: "Email template example for welcome message: 'Subject: Welcome to {{company_name}}\n\nDear {{client_name}},\n\nThank you for choosing {{company_name}}. We're excited to work with you!\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\n{{company_name}}'",
    metadata: { type: "example", section: "email-templates" }
  },
  {
    content: "Common email template variables in AutoFlow include: {{client_name}}, {{company_name}}, {{invoice_number}}, {{invoice_amount}}, {{due_date}}, {{payment_amount}}, {{client_email}}, {{company_logo}}, {{payment_link}}, {{company_address}}, {{company_phone}}",
    metadata: { type: "feature", section: "email-templates" }
  },
  {
    content: "Email template example for new project: 'Subject: New Project - {{project_name}}\n\nHello {{client_name}},\n\nI'm pleased to inform you that we've started work on your new project: {{project_name}}.\n\nYou can expect the first update by {{next_update_date}}. Please let me know if you have any questions or specific requirements you'd like to discuss.\n\nBest regards,\n{{sender_name}}\n{{company_name}}'",
    metadata: { type: "example", section: "email-templates" }
  },
  {
    content: "Email template example for appointment confirmation: 'Subject: Your Appointment Confirmation\n\nHi {{client_name}},\n\nThis is to confirm your appointment on {{appointment_date}} at {{appointment_time}}.\n\nLocation: {{appointment_location}}\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nWe look forward to seeing you!\n\nRegards,\n{{company_name}}'",
    metadata: { type: "example", section: "email-templates" }
  },
  {
    content: "AutoFlow allows you to create dynamic content in email templates using conditional blocks. For example, you can show different text based on invoice status using syntax like: {% if invoice.status == 'overdue' %}This invoice is overdue{% else %}Thank you for your business{% endif %}",
    metadata: { type: "feature", section: "email-templates" }
  }
];

// Simple function to add items to the knowledge base
export function addToKnowledgeBase(items: { text: string, metadata?: Record<string, any> }[]) {
  const newItems = items.map(item => ({
    content: item.text,
    metadata: item.metadata || {}
  }));
  
  knowledgeBase.push(...newItems);
  
  return {
    success: true,
    count: newItems.length
  };
}

// Simple keyword search function
export function queryKnowledgeBase(query: string, limit = 3) {
  const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  if (keywords.length === 0) {
    // Return random items if no significant keywords
    const randomItems = [...knowledgeBase]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
    
    return {
      success: true,
      results: randomItems
    };
  }
  
  // Score items by keyword matches
  const scoredItems = knowledgeBase.map(item => {
    const content = item.content.toLowerCase();
    let score = 0;
    
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        score += 1;
        
        // Bonus for exact phrase matches
        if (content.includes(query.toLowerCase())) {
          score += 3;
        }
        
        // Bonus for title/beginning matches
        if (content.startsWith(keyword) || content.includes(`. ${keyword}`)) {
          score += 0.5;
        }
      }
    }
    
    return { item, score };
  });
  
  // Sort by score (highest first) and return top matches
  const results = scoredItems
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0) // Only include items with matches
    .slice(0, limit)
    .map(({ item }) => item);
  
  return {
    success: true,
    results
  };
}

// Expose sample data for testing/seeding
export const sampleKnowledgeData = knowledgeBase.map(item => ({
  text: item.content,
  metadata: item.metadata
})); 