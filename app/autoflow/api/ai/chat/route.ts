import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { queryKnowledgeBase } from '@/lib/knowledge-base';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import fs from 'fs';
import path from 'path';

// Load the system guide
const loadSystemGuide = (): string => {
  try {
    const guidePath = path.join(process.cwd(), 'lib', 'ai-knowledge', 'system-guide.md');
    return fs.readFileSync(guidePath, 'utf8');
  } catch (error) {
    console.warn('Failed to load system guide:', error);
    return '';
  }
};

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }
  
  return new OpenAI({
    apiKey,
  });
};

// Function to detect if the message is a template creation request
const isTemplateCreationRequest = (message: string): { isRequest: boolean; templateType?: string; description?: string } => {
  // Convert message to lowercase for case-insensitive matching
  const lowerMsg = message.toLowerCase();
  
  // Simple pattern matching for template creation requests
  if (lowerMsg.includes('create') && 
      lowerMsg.includes('email') && 
      lowerMsg.includes('template')) {
    
    // Extract template type using common patterns
    let templateType = 'general';
    const typePatterns = [
      /create\s+(?:a|an)\s+([a-z\s-]+?)\s+email\s+template/i,
      /email\s+template\s+for\s+([a-z\s-]+)/i
    ];
    
    for (const pattern of typePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        templateType = match[1].trim();
        break;
      }
    }
    
    // Find any description that might follow
    let description = '';
    const descriptionPatterns = [
      /template\s+(?:that|which|to)\s+([^.!?]+)/i,
      /template\s+with\s+([^.!?]+)/i,
      /template:\s+([^.!?]+)/i
    ];
    
    for (const pattern of descriptionPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        description = match[1].trim();
        break;
      }
    }
    
    return { 
      isRequest: true, 
      templateType,
      description: description || undefined
    };
  }
  
  return { isRequest: false };
};

// Function to detect if the message is an invoice creation request
const isInvoiceCreationRequest = (message: string): { isRequest: boolean; clientName?: string; description?: string; amount?: string } => {
  // Convert message to lowercase for case-insensitive matching
  const lowerMsg = message.toLowerCase();
  
  // Simple pattern matching for invoice creation requests
  if ((lowerMsg.includes('create') || lowerMsg.includes('make') || lowerMsg.includes('generate')) && 
      (lowerMsg.includes('invoice') || lowerMsg.includes('bill'))) {
    
    // Extract client name
    let clientName = '';
    const clientPatterns = [
      /(?:for|to)\s+(?:client|customer)?\s*['":]?\s*([a-z\s]+?)(?:['"]|\s+for|\s+\$|\s+£|\s+at|\s+with|\s*$)/i,
      /(?:create|make|generate)\s+(?:an?\s+)?(?:invoice|bill)\s+for\s+([a-z\s]+?)(?:\s+for|\s+\$|\s+£|\s+at|\s*$)/i,
    ];
    
    for (const pattern of clientPatterns) {
      const match = message.match(pattern);
      if (match && match[1] && match[1].trim().length > 1) {
        clientName = match[1].trim();
        break;
      }
    }
    
    // Extract amount
    let amount = '';
    const amountPatterns = [
      /(?:\$|£|\€|\bUSD|\bEUR|\bGBP|\bEuro?s?|\bDollars?|\bPounds?)\s*([0-9,.]+)/i,
      /([0-9,.]+)\s*(?:\$|£|\€|\bUSD|\bEUR|\bGBP|\bEuro?s?|\bDollars?|\bPounds?)/i,
      /\b(\d+(?:\.\d{1,2})?)\b/
    ];
    
    for (const pattern of amountPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        // Clean the amount (remove commas, ensure decimal point)
        amount = match[1].replace(/,/g, '');
        break;
      }
    }
    
    // Extract description
    let description = '';
    const descriptionPatterns = [
      /for\s+(?:a|an)?\s*([a-z\s\-]+?\s+(?:service|work|project|consultation|repair|installation))/i,
      /(?:invoice|bill)\s+for\s+([a-z\s\-]+?)\s+(?:service|work|project|consultation|repair|installation)/i,
      /(?:service|work|project|consultation|repair|installation)\s+(?:called|named|described as)?\s*['":]?\s*([^.!?,;]+)/i
    ];
    
    for (const pattern of descriptionPatterns) {
      const match = message.match(pattern);
      if (match && match[1] && match[1].trim().length > 3) {
        description = match[1].trim();
        break;
      }
    }
    
    // If we can't extract a good description, make a generic one based on available info
    if (!description && clientName) {
      description = `Services for ${clientName}`;
    } else if (!description) {
      description = "Professional services";
    }
    
    return { 
      isRequest: Boolean(amount && (clientName || description)),
      clientName: clientName || undefined,
      description: description || undefined,
      amount: amount || undefined
    };
  }
  
  return { isRequest: false };
};

// Function to detect if the message is an email invoice request
const isEmailInvoiceRequest = (message: string): { isRequest: boolean; invoiceId?: string; message?: string } => {
  // Convert message to lowercase for case-insensitive matching
  const lowerMsg = message.toLowerCase();
  
  // Simple pattern matching for email invoice requests
  if ((lowerMsg.includes('email') || lowerMsg.includes('send')) && 
      lowerMsg.includes('invoice')) {
    
    // Extract invoice ID or number
    let invoiceId = '';
    const invoicePatterns = [
      /(?:invoice|bill)\s+(?:number|#)?\s*[#:]?\s*(\w+-\d+|\d+)/i,
      /send\s+(?:invoice|bill)\s+(?:number|#)?\s*[#:]?\s*(\w+-\d+|\d+)/i,
      /email\s+(?:invoice|bill)\s+(?:number|#)?\s*[#:]?\s*(\w+-\d+|\d+)/i
    ];
    
    for (const pattern of invoicePatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        invoiceId = match[1].trim();
        break;
      }
    }
    
    // Extract custom message
    let customMessage = '';
    const messagePatterns = [
      /message[:\s]+["']?([^"']+?)["']?(?:\s|$)/i,
      /with\s+(?:message|note)[:\s]+["']?([^"']+?)["']?(?:\s|$)/i,
      /saying[:\s]+["']?([^"']+?)["']?(?:\s|$)/i
    ];
    
    for (const pattern of messagePatterns) {
      const match = message.match(pattern);
      if (match && match[1] && match[1].trim().length > 3) {
        customMessage = match[1].trim();
        break;
      }
    }
    
    return { 
      isRequest: Boolean(invoiceId),
      invoiceId,
      message: customMessage || undefined
    };
  }
  
  return { isRequest: false };
};

export async function POST(request: NextRequest) {
  try {
    // Check API key first
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-api-key-here') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'OpenAI API key is not configured. Please add your API key to .env.local file.' 
        },
        { status: 500 }
      );
    }

    // Parse request
    const body = await request.json().catch(() => ({}));
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, message: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Initialize OpenAI
    const openai = getOpenAIClient();
    
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage || !lastUserMessage.content) {
      return NextResponse.json(
        { success: false, message: 'No valid user message found' },
        { status: 400 }
      );
    }
    
    // Check if this is a template creation request
    const templateRequest = isTemplateCreationRequest(lastUserMessage.content);
    
    // If it's a template creation request, handle it specially
    if (templateRequest.isRequest && templateRequest.templateType) {
      try {
        // Extract potential custom values from the user message
        const message = lastUserMessage.content.toLowerCase();
        
        // Extract client name
        let clientName = '';
        const namePatterns = [
          /for\s+(?:client|customer)?\s*['":]?\s*([a-z\s]+?)(?:['"]|\s+for|\s+\$|\s+£|\s+regarding|\s+about|\s+at|\s+with|\s*$)/i,
          /regarding\s+(?:a|an)?\s*([a-z\s]+?)(?:\s+for|\s+\$|\s+£|\s+of|\s*$)/i,
          /with\s+(?:client|customer)?\s*['":]?\s*([a-z\s]+?)(?:['"]|\s+for|\s+\$|\s+£|\s+at|\s+with|\s*$)/i,
          /client[\s:]+([a-z\s]+?)(?:,|\s+|$)/i,
          /customer[\s:]+([a-z\s]+?)(?:,|\s+|$)/i,
        ];
        
        for (const pattern of namePatterns) {
          const match = lastUserMessage.content.match(pattern);
          if (match && match[1] && match[1].trim().length > 1) {
            clientName = match[1].trim();
            break;
          }
        }
        
        // Extract amount
        let amount = '';
        const amountPatterns = [
          /(?:\$|£|\€|\bUSD|\bEUR|\bGBP|\bEuro?s?|\bDollars?|\bPounds?)\s*([0-9,.]+)/i,
          /([0-9,.]+)\s*(?:\$|£|\€|\bUSD|\bEUR|\bGBP|\bEuro?s?|\bDollars?|\bPounds?)/i,
          /\b(\d+(?:\.\d{1,2})?)\b/,
          /of\s+(?:\$|£|\€)?\s*([0-9,.]+)/i,
          /amount[\s:]+(?:\$|£|\€)?\s*([0-9,.]+)/i,
          /cost(?:ing)?[\s:]+(?:\$|£|\€)?\s*([0-9,.]+)/i,
        ];
        
        for (const pattern of amountPatterns) {
          const match = lastUserMessage.content.match(pattern);
          if (match && match[1]) {
            amount = match[1].replace(/,/g, '');
            
            // Try to detect currency
            let currency = '£';
            if (lastUserMessage.content.includes('$')) currency = '$';
            else if (lastUserMessage.content.includes('€')) currency = '€';
            
            amount = currency + amount;
            break;
          }
        }
        
        // Extract reason/service
        let service = '';
        const servicePatterns = [
          /regarding\s+(?:a|an)?\s*([a-z\s]+?(?:repair|service|maintenance|consultation|project|work|redesign))/i,
          /for\s+(?:a|an)?\s*([a-z\s]+?(?:repair|service|maintenance|consultation|project|work|redesign))/i,
          /about\s+(?:a|an)?\s*([a-z\s]+?(?:repair|service|maintenance|consultation|project|work|redesign))/i,
          /service[\s:]+([a-z\s]+?)(?:,|\s+|$)/i,
          /work[\s:]+([a-z\s]+?)(?:,|\s+|$)/i,
          /project[\s:]+([a-z\s]+?)(?:,|\s+|$)/i,
        ];
        
        for (const pattern of servicePatterns) {
          const match = lastUserMessage.content.match(pattern);
          if (match && match[1] && match[1].trim().length > 1) {
            service = match[1].trim();
            break;
          }
        }
        
        // If we couldn't find a service using the patterns above, try a more generic approach
        if (!service) {
          // Look for "boiler repair" or similar phrases without requiring service/repair keywords in the pattern
          const genericServiceMatch = lastUserMessage.content.match(/(?:regarding|for|about)\s+(?:a|an)?\s*([a-z\s]+?)(?:,|\s+of|\s+from|\s+at|\s+with|\s+amount|\s+cost|\s*$)/i);
          if (genericServiceMatch && genericServiceMatch[1] && genericServiceMatch[1].trim().length > 1) {
            service = genericServiceMatch[1].trim();
          }
        }
        
        // If all extractions failed, use default values
        if (!clientName) clientName = '';
        if (!amount) amount = '';
        if (!service) service = '';
        
        console.log(`Extracted custom values - Name: "${clientName}", Amount: "${amount}", Service: "${service}"`);
        
        // Make a request to our template generation endpoint with custom values
        const templateResponse = await fetch(new URL('/api/ai/generate-template', request.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateType: templateRequest.templateType,
            description: templateRequest.description,
            customValues: {
              clientName: clientName || undefined,
              amount: amount || undefined,
              service: service || undefined
            }
          }),
        });
        
        const templateData = await templateResponse.json();
        
        if (templateData.success && templateData.template) {
          // Return success with template data
          return NextResponse.json({
            success: true,
            response: {
              role: 'assistant',
              content: `I've created a ${templateRequest.templateType} email template for you:\n\n${templateData.template.content}`,
            },
            isTemplateCreation: true,
            template: templateData.template
          });
        }
      } catch (error) {
        console.warn('Template generation failed, falling back to regular chat:', error);
        // Continue with regular chat if template generation fails
      }
    }
    
    // Check if this is an invoice creation request
    const invoiceRequest = isInvoiceCreationRequest(lastUserMessage.content);
    
    if (invoiceRequest.isRequest && invoiceRequest.amount) {
      try {
        // Make a request to our invoice creation endpoint
        const invoiceResponse = await fetch(new URL('/api/ai/create-invoice', request.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Forward the cookie header from the original request to maintain authentication
            'Cookie': request.headers.get('cookie') || '',
          },
          body: JSON.stringify({
            clientName: invoiceRequest.clientName || "New Client",
            description: invoiceRequest.description || "Professional services",
            amount: invoiceRequest.amount,
            taxRate: 0 // Default to no tax
          }),
          // This ensures cookies are sent with the request
          credentials: 'include',
        });
        
        const invoiceData = await invoiceResponse.json();
        
        if (invoiceData.success) {
          // Return success with invoice data
          return NextResponse.json({
            success: true,
            response: {
              role: 'assistant',
              content: `I've created an invoice for ${invoiceRequest.amount} for ${invoiceRequest.clientName || "your client"}.
              
Invoice #${invoiceData.invoiceNumber}
Description: ${invoiceRequest.description}
Amount: £${invoiceRequest.amount}
Total: £${invoiceData.total.toFixed(2)}

You can view and edit this invoice in the Invoices section.`,
            }
          });
        } else {
          console.error('Invoice creation failed:', invoiceData);
          // Return a more helpful error message
          return NextResponse.json({
            success: true,
            response: {
              role: 'assistant',
              content: `I couldn't create the invoice due to an error: ${invoiceData.message || 'Unknown error'}. Please try using the Invoices section directly or make sure you're properly logged in.`,
            }
          });
        }
      } catch (error) {
        console.warn('Invoice creation failed, falling back to regular chat:', error);
        // Continue with regular chat if invoice creation fails
      }
    }
    
    // Check if this is an email invoice request
    const emailInvoiceRequest = isEmailInvoiceRequest(lastUserMessage.content);
    
    if (emailInvoiceRequest.isRequest && emailInvoiceRequest.invoiceId) {
      try {
        // First try to find the invoice by number or ID
        const invoiceNumberOrId = emailInvoiceRequest.invoiceId;
        let invoiceId: number | null = null;
        
        // Check if the input is numeric (ID) or a string (invoice number)
        if (/^\d+$/.test(invoiceNumberOrId)) {
          invoiceId = parseInt(invoiceNumberOrId, 10);
        } else {
          // If it's an invoice number, we need to find the ID
          const connection = await (await import("@/lib/db")).createConnection();
          try {
            const [invoices] = await connection.execute(
              "SELECT id FROM invoices WHERE invoice_number = ? AND created_by = ?",
              [invoiceNumberOrId, user.id]
            );
            
            if (Array.isArray(invoices) && (invoices as any[]).length > 0) {
              invoiceId = (invoices as any[])[0].id;
            }
          } finally {
            await connection.end();
          }
        }
        
        if (!invoiceId) {
          return NextResponse.json({
            success: true,
            response: {
              role: 'assistant',
              content: `I couldn't find invoice ${invoiceNumberOrId}. Please check the invoice number and try again.`,
            }
          });
        }
        
        // Make a request to our email invoice endpoint
        const emailResponse = await fetch(new URL('/api/ai/email-invoice', request.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || '',
          },
          body: JSON.stringify({
            invoiceId: invoiceId,
            message: emailInvoiceRequest.message,
          }),
          credentials: 'include',
        });
        
        const emailData = await emailResponse.json();
        
        if (emailData.success) {
          // Return success with email data
          return NextResponse.json({
            success: true,
            response: {
              role: 'assistant',
              content: `I've emailed invoice ${invoiceNumberOrId} to ${emailData.recipient}.${
                emailInvoiceRequest.message ? " I included your message with the email." : ""
              }`,
            }
          });
        } else {
          console.error('Email invoice failed:', emailData);
          // Return a more helpful error message
          return NextResponse.json({
            success: true,
            response: {
              role: 'assistant',
              content: `I couldn't email the invoice due to an error: ${emailData.message || 'Unknown error'}. ${
                emailData.message?.includes("client has no email address") ? 
                "The client doesn't have an email address in the system. Please add an email address to the client's profile." : 
                "Please check that the invoice exists and try again."
              }`,
            }
          });
        }
      } catch (error) {
        console.warn('Email invoice failed, falling back to regular chat:', error);
        // Continue with regular chat if email invoice fails
      }
    }
    
    // Load the system guide to help the AI understand AutoFlow features
    const systemGuide = loadSystemGuide();
    
    // Default system message with comprehensive system guide
    let systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are a helpful AI assistant for the AutoFlow application, which helps businesses manage clients, bookings, invoices, and email automation.

${systemGuide}

Your goal is to help users with their tasks in AutoFlow. Be concise, helpful, and knowledgeable about all AutoFlow features. When a user asks about specific functionality, try to explain exactly how to accomplish their task using the appropriate AutoFlow features.`
    };
    
    // Try to retrieve relevant information from knowledge base
    try {
      if (lastUserMessage) {
        // Query the knowledge base for relevant information
        const kbResult = queryKnowledgeBase(lastUserMessage.content);
        
        if (kbResult.success && kbResult.results.length > 0) {
          // Format results as context
          const contextTexts = kbResult.results.map(doc => doc.content);
          const context = contextTexts.join('\n\n');
          
          // Update system message with context, keeping the system guide
          systemMessage = {
            role: "system",
            content: `You are a helpful AI assistant for the AutoFlow application, which helps businesses manage clients, bookings, invoices, and email automation.

${systemGuide}

Additional context for the current question:

${context}

If the information provided doesn't fully answer the question, you can provide guidance based on the system guide or your understanding of business management systems, but make it clear when you're going beyond the provided context.`
          };
        }
      }
    } catch (error) {
      console.warn('Knowledge base retrieval failed, using default system message:', error);
      // Continue with default system message
    }
    
    // Prepare messages for the API call, adding the system message at the beginning
    const apiMessages: ChatCompletionMessageParam[] = [systemMessage, ...messages];

    // Make API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Check for valid response
    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      return NextResponse.json(
        { success: false, message: 'Invalid response from OpenAI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: completion.choices[0].message,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      const message = error.message || 'Failed to get AI response';
      
      // Check for common OpenAI errors
      if (message.includes('API key')) {
        return NextResponse.json(
          { success: false, message: 'Invalid OpenAI API key. Please check your configuration.' },
          { status: 401 }
        );
      }
      
      if (message.includes('rate limit')) {
        return NextResponse.json(
          { success: false, message: 'OpenAI API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { success: false, message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to get AI response' },
      { status: 500 }
    );
  }
} 