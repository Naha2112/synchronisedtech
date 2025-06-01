import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAIConfig } from '@/lib/ai/config';
import { query } from '@/lib/db';

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('OpenAI API key is not configured');
  }
  
  return new OpenAI({
    apiKey: apiKey,
  });
};

// Task Detection Functions
const detectTaskType = (message: string): { 
  type: string | null; 
  details: any;
  confidence: number;
} => {
  const msg = message.toLowerCase().trim();
  
  // Invoice creation - simpler patterns
  if (msg.includes('create invoice') || msg.includes('make invoice')) {
    // Extract client name after "for" or "to"
    const clientMatch = message.match(/(?:for|to)\s+([A-Za-z\s]+?)(?:\s+for|\s+\$|\s+£|$)/i);
    // Extract amount after $ or £
    const amountMatch = message.match(/[\$£€]\s*([0-9,.]+)/i);
    // Extract description after amount or after second "for"
    const descMatch = message.match(/(?:for\s+[A-Za-z\s]+?\s+for|[\$£€]\s*[0-9,.]+\s+for)\s+([^$]+)/i);
    
    return {
      type: 'create_invoice',
      details: {
        clientName: clientMatch ? clientMatch[1].trim() : null,
        amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null,
        description: descMatch ? descMatch[1].trim() : 'Services'
      },
      confidence: 0.9
    };
  }
  
  // Client creation - better patterns that don't include command words
  if (msg.includes('create client') || msg.includes('add client') || msg.includes('new client')) {
    // Extract name after "named" or "called" - but don't include these words
    let nameMatch = message.match(/(?:named|called)\s+([A-Za-z\s]+?)(?:\s+with|\s+email|$)/i);
    if (!nameMatch) {
      // Try pattern after "client"
      nameMatch = message.match(/client\s+([A-Za-z\s]+?)(?:\s+with|\s+email|$)/i);
    }
    // Extract email
    const emailMatch = message.match(/email[\s:]*([^\s]+@[^\s]+)/i);
    
    return {
      type: 'create_client',
      details: {
        name: nameMatch ? nameMatch[1].trim() : null,
        email: emailMatch ? emailMatch[1].trim() : null
      },
      confidence: 0.9
    };
  }
  
  // Search tasks - simpler patterns
  if (msg.includes('show') || msg.includes('list') || msg.includes('find')) {
    if (msg.includes('client')) {
      return {
        type: 'search_data',
        details: { entity: 'clients', filter: null },
        confidence: 0.9
      };
    }
    if (msg.includes('invoice')) {
      return {
        type: 'search_data',
        details: { entity: 'invoices', filter: null },
        confidence: 0.9
      };
    }
  }
  
  // Template creation
  if (msg.includes('template') || msg.includes('email template')) {
    return {
      type: 'create_template',
      details: { templateType: 'invoice' },
      confidence: 0.8
    };
  }
  
  return { type: null, details: {}, confidence: 0 };
};

// Task Execution Functions
const executeTask = async (taskType: string, details: any, session: any) => {
  switch (taskType) {
    case 'create_invoice': {
      const { clientName, amount, description } = details;
      
      if (!clientName || !amount) {
        return {
          success: false,
          message: 'Please specify: "Create invoice for [Client] for $[Amount] for [Service]"'
        };
      }
      
      try {
        // Find or create client
        let client = await query('SELECT * FROM clients WHERE name LIKE ?', [`%${clientName}%`]) as any[];
        if (!client || client.length === 0) {
          const clientEmail = `${clientName.toLowerCase().replace(/\s+/g, '.')}@placeholder.com`;
          await query('INSERT INTO clients (name, email, created_by) VALUES (?, ?, ?)', [clientName, clientEmail, 1]);
          client = await query('SELECT * FROM clients WHERE name = ?', [clientName]) as any[];
        }
        
        const clientId = client[0]?.id;
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
        const issueDate = new Date().toISOString().split('T')[0];
        const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        // Create invoice
        await query(
          'INSERT INTO invoices (invoice_number, client_id, issue_date, due_date, subtotal, total, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [invoiceNumber, clientId, issueDate, dueDate, amount, amount, 1]
        );
        
        // Get invoice ID and create item
        const invoiceResult = await query('SELECT id FROM invoices WHERE invoice_number = ?', [invoiceNumber]) as any[];
        const invoiceId = invoiceResult[0]?.id;
        
        if (invoiceId) {
          await query(
            'INSERT INTO invoice_items (invoice_id, description, quantity, rate, amount) VALUES (?, ?, ?, ?, ?)',
            [invoiceId, description, 1, amount, amount]
          );
        }
        
        return {
          success: true,
          message: `✅ Invoice ${invoiceNumber} created for ${clientName} - $${amount}`,
          data: { invoiceNumber, clientName, amount, description }
        };
        
      } catch (error) {
        console.error('Invoice creation error:', error);
        return {
          success: false,
          message: `Failed to create invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    }
    
    case 'create_client': {
      const { name, email } = details;
      
      if (!name) {
        return {
          success: false,
          message: 'Please specify: "Create client named [Name] with email [Email]"'
        };
      }
      
      const clientEmail = email || `${name.toLowerCase().replace(/\s+/g, '.')}@placeholder.com`;
      
      try {
        // Check if client exists
        const existing = await query('SELECT * FROM clients WHERE name = ?', [name]) as any[];
        if (existing && existing.length > 0) {
          return {
            success: false,
            message: `Client "${name}" already exists`
          };
        }
        
        // Create client
        await query(
          'INSERT INTO clients (name, email, created_by) VALUES (?, ?, ?)',
          [name, clientEmail, 1]
        );
        
        return {
          success: true,
          message: `✅ Client "${name}" created with email ${clientEmail}`,
          data: { name, email: clientEmail }
        };
        
      } catch (error) {
        console.error('Client creation error:', error);
        return {
          success: false,
          message: `Failed to create client: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    }
    
    case 'search_data': {
      const { entity } = details;
      
      try {
        let results: any[];
        
        if (entity === 'clients') {
          results = await query('SELECT * FROM clients ORDER BY created_at DESC LIMIT 5') as any[];
          
          if (!results || results.length === 0) {
            return { success: true, message: 'No clients found' };
          }
          
          let message = `📊 Found ${results.length} clients:\n\n`;
          results.forEach((client: any, index: number) => {
            message += `${index + 1}. ${client.name} - ${client.email}\n`;
          });
          
          return { success: true, message, data: results };
          
        } else if (entity === 'invoices') {
          results = await query(`
            SELECT i.*, c.name as client_name 
            FROM invoices i 
            LEFT JOIN clients c ON i.client_id = c.id
            ORDER BY i.created_at DESC LIMIT 5
          `) as any[];
          
          if (!results || results.length === 0) {
            return { success: true, message: 'No invoices found' };
          }
          
          let message = `📋 Found ${results.length} invoices:\n\n`;
          results.forEach((invoice: any, index: number) => {
            message += `${index + 1}. ${invoice.invoice_number} - ${invoice.client_name} - $${invoice.total}\n`;
          });
          
          return { success: true, message, data: results };
        }
        
        return { success: false, message: 'Specify: clients or invoices' };
        
      } catch (error) {
        console.error('Search error:', error);
        return {
          success: false,
          message: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    }
    
    case 'create_template': {
      const template = {
        subject: 'Invoice #{invoice_number} - Payment Due',
        content: `Dear {client_name},

Please find your invoice attached.

Invoice: {invoice_number}
Amount: {invoice_total}
Due Date: {due_date}

Thank you,
{company_name}`
      };
      
      return {
        success: true,
        message: `✅ Invoice email template created`,
        data: template
      };
    }
    
    default:
      return {
        success: false,
        message: 'I can help with: create invoice, create client, show clients, show invoices, create template'
      };
  }
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication gracefully
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.log('Auth error, proceeding with limited functionality:', authError);
    }

    // Parse request
    const body = await request.json().catch(() => ({}));
    const { messages, conversationId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage || !lastUserMessage.content) {
      return NextResponse.json(
        { success: false, message: 'No valid user message found' },
        { status: 400 }
      );
    }

    // Detect if this is a task request
    const taskDetection = detectTaskType(lastUserMessage.content);
    
    if (taskDetection.type && taskDetection.confidence > 0.7) {
      // Execute the task
      const taskResult = await executeTask(taskDetection.type, taskDetection.details, session);
      
      return NextResponse.json({
        success: true,
        response: {
          role: 'assistant',
          content: taskResult.message
        },
        isTask: true,
        taskType: taskDetection.type,
        taskData: taskResult.data || null
      });
    }

    // Check if OpenAI API key is configured for regular chat
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-api-key-here' || apiKey.includes('your-')) {
      // Return a helpful fallback response with task capabilities
      const config = getAIConfig();
      const fallbackResponse = `I can help you with AutoFlow tasks! Here's what I can do:

🎯 **Task Commands:**
• "Create invoice for [Client] for $[Amount] for [Service]"
• "Create client named [Name] with email [Email]"
• "Show me all clients" or "Find client [Name]"
• "List recent invoices"
• "Create email template for [Purpose]"

📚 **Information:**
• Navigate to /autoflow/clients for client management
• Go to /autoflow/invoices for invoice management
• Visit /autoflow/email-templates for templates
• Access /autoflow/bookings for scheduling

Just tell me what you'd like to do and I'll handle it for you!

Note: Advanced AI features require OpenAI API configuration.`;
      
      return NextResponse.json({
        success: true,
        response: {
          role: 'assistant',
          content: fallbackResponse
        },
        requiresOpenAI: true
      });
    }

    // Initialize OpenAI for regular conversation
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      // Fallback to task-capable responses
      return NextResponse.json({
        success: true,
        response: {
          role: 'assistant',
          content: `I understand you're looking for help. While I can't access the full AI features right now, I can still help you with tasks:

🎯 **I can help you:**
• Create invoices: "Create invoice for John Smith for $500 for consulting"
• Manage clients: "Create client named Jane Doe with email jane@example.com"
• Search data: "Show me all clients" or "List recent invoices"
• Create templates: "Create invoice email template"

Just tell me what you'd like to do!`
        }
      });
    }

    // Get AI configuration
    const config = getAIConfig();
    
    // Enhanced system message that includes task capabilities
    const systemMessage = {
      role: "system" as const,
      content: `${config.system_prompt}

IMPORTANT: You can now perform actual tasks! When users request actions like creating invoices, managing clients, or searching data, provide helpful information but also mention that I can execute these tasks directly.

Task Examples you can suggest:
- "Create invoice for [Client] for $[Amount] for [Service]"
- "Create client named [Name] with email [Email]" 
- "Show me all clients" or "Find invoices for [Client]"
- "Create email template for [Purpose]"

Always encourage users to try these task commands for real automation.`
    };

    // Simple responses for common questions
    const simpleResponses = {
      'hello': 'Hello! I\'m your AutoFlow assistant and I can actually perform tasks for you! Try saying "Create invoice for John Smith for $500 for consulting" or "Show me all clients". What can I help you with today?',
      'hi': 'Hi there! I can help you with AutoFlow and actually perform tasks like creating invoices, managing clients, and more. What would you like me to do?',
      'help': `I can help you with AutoFlow and actually perform tasks! Here's what I can do:

🎯 **Actual Tasks:**
• Create invoices: "Create invoice for [Client] for $[Amount] for [Service]"
• Manage clients: "Create client named [Name] with email [Email]"
• Search data: "Show me all clients" or "List recent invoices"
• Create templates: "Create invoice email template"

📚 **Features:**
• Client Management
• Invoice Creation and Management  
• Email Templates and Automation
• Booking and Scheduling
• Financial Analytics

What would you like me to do for you?`,
      'what can you do': 'I can help you with AutoFlow features AND actually perform tasks! I can create invoices, manage clients, search your data, create email templates, and more. Just ask me to do something like "Create invoice for ABC Company for $1000 for web development" and I\'ll do it!'
    };

    const userMessage = lastUserMessage.content.toLowerCase().trim();
    
    // Check for simple responses first
    for (const [key, response] of Object.entries(simpleResponses)) {
      if (userMessage.includes(key)) {
        return NextResponse.json({
          success: true,
          response: {
            role: 'assistant',
            content: response
          }
        });
      }
    }

    // Prepare messages for the API call
    const apiMessages = [systemMessage, ...messages];

    try {
      // Make API call to OpenAI
      const completion = await openai.chat.completions.create({
        model: config.model,
        messages: apiMessages,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      });

      // Check for valid response
      if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
        throw new Error('Invalid response from OpenAI');
      }

      const assistantMessage = completion.choices[0].message;

      return NextResponse.json({
        success: true,
        response: {
          role: 'assistant',
          content: assistantMessage.content || 'I apologize, but I couldn\'t generate a response. Please try again, or ask me to perform a specific task like "Create invoice for [Client] for $[Amount]".'
        }
      });

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      
      // Fallback to a helpful response with task capabilities
      return NextResponse.json({
        success: true,
        response: {
          role: 'assistant',
          content: `I'm having trouble with the AI service, but I can still help you with tasks!

🎯 **Try these commands:**
• "Create invoice for [Client Name] for $[Amount] for [Description]"
• "Create client named [Name] with email [Email]"
• "Show me all clients"
• "List recent invoices"

I can actually execute these tasks for you. What would you like me to do?`
        }
      });
    }

  } catch (error) {
    console.error('AI chat API error:', error);
    
    return NextResponse.json({
      success: true,
      response: {
        role: 'assistant',
        content: 'I\'m here to help you with AutoFlow! I can perform actual tasks like creating invoices and managing clients. Try saying "Create invoice for [Client] for $[Amount]" or "Show me all clients". What would you like me to do?'
      }
    }, { status: 200 });
  }
} 