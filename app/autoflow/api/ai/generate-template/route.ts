import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { queryKnowledgeBase } from '@/lib/knowledge-base';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

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

// Function to replace template placeholders with sample values
const replacePlaceholders = (content: string): string => {
  const sampleValues: Record<string, string> = {
    '{{client_name}}': 'John Smith',
    '{{name}}': 'John Smith',
    '{{company_name}}': 'Acme Corporation',
    '{{invoice_number}}': 'INV-2023-1001',
    '{{invoice_amount}}': '$450.00',
    '{{due_date}}': '30th June 2023',
    '{{payment_amount}}': '$450.00',
    '{{date}}': 'June 15, 2023',
    '{{email}}': 'john.smith@example.com',
    '{{phone}}': '(555) 123-4567',
    '{{address}}': '123 Main Street, New York, NY 10001',
    '{{service}}': 'Website Development',
    '{{project_name}}': 'Website Redesign',
    '{{meeting_time}}': '10:00 AM, Tuesday, June 20, 2023',
    '{{appointment_time}}': '2:00 PM, Wednesday, June 21, 2023',
    '{{product}}': 'Premium Plan Subscription',
    '{{discount}}': '15%',
    '{{discount_code}}': 'SUMMER15',
    '{{total}}': '$382.50',
    '{{subtotal}}': '$350.00',
    '{{tax}}': '$32.50',
    '{{payment_method}}': 'Credit Card',
    '{{payment_date}}': 'June 10, 2023',
    '{{order_number}}': 'ORD-2023-4567',
    '{{delivery_date}}': 'June 25, 2023',
    '{{website}}': 'www.acmecorp.com',
    '{{login_url}}': 'https://app.acmecorp.com/login',
    '{{support_email}}': 'support@acmecorp.com',
    '{{support_phone}}': '(555) 987-6543',
    '{{subscription_plan}}': 'Professional Plan',
    '{{subscription_price}}': '$49.99/month',
    '{{renewal_date}}': 'July 15, 2023',
    '{{username}}': 'johnsmith',
    '{{account_number}}': 'ACCT-12345',
    '{{event_name}}': 'Annual Industry Conference',
    '{{event_date}}': 'September 15-17, 2023',
    '{{event_location}}': 'Marriott Conference Center, New York',
    '{{ticket_type}}': 'VIP Pass',
    '{{ticket_price}}': '$299.00',
  };
  
  // Replace all placeholders found in the content
  let result = content;
  const placeholderRegex = /{{([a-z_]+)}}/g;
  let match;
  while ((match = placeholderRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const placeholder = match[1];
    const replacement = sampleValues[fullMatch] || `[${placeholder}]`;
    result = result.replace(new RegExp(fullMatch, 'g'), replacement);
  }
  
  return result;
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
    const { templateType, description, useSampleValues = true, customValues = {} } = body;

    if (!templateType) {
      return NextResponse.json(
        { success: false, message: 'Template type is required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI
    const openai = getOpenAIClient();
    
    // Get template examples from knowledge base
    const templateQuery = `email template ${templateType}`;
    const kbResult = queryKnowledgeBase(templateQuery);
    
    // Format context with examples if available
    let examplesContext = "";
    if (kbResult.success && kbResult.results.length > 0) {
      examplesContext = kbResult.results
        .filter(item => item.metadata?.type === 'example')
        .map(item => item.content)
        .join('\n\n');
    }

    // Use custom values if provided, otherwise use defaults
    const clientName = customValues.clientName || 'John Smith';
    const amount = customValues.amount || '$450.00';
    const service = customValues.service || 'Website Redesign';
    
    // Create system message with context
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are an email template generation assistant for the AutoFlow application. 
      Your task is to create a professional, well-formatted email template for ${templateType}.
      ${description ? `The user has described it as: ${description}` : ''}
      
      Email templates should:
      1. Have a clear subject line
      2. Be professional but friendly in tone
      3. Use specific names, dates, and amounts instead of placeholders
      4. Personalize the email with realistic sample data
      5. Be concise and to the point
      
      ${examplesContext ? `Here are some examples of email templates:\n\n${examplesContext}` : ''}
      
      Return ONLY the template text with no additional explanation. Start with 'Subject: ' followed by the subject line.
      
      Use these specific sample values in your template:
      - Client name: ${clientName}
      - Company name: Acme Corporation 
      - Invoice number: INV-2023-1001
      - Invoice amount: ${amount}
      - Due date: June 30, 2023
      - Project/Service: ${service}`
    };

    // User message to prompt template generation
    const userMessage: ChatCompletionMessageParam = {
      role: "user",
      content: `Create a ${templateType} email template with these specific values:
Client: ${clientName}
Amount: ${amount}
Service: ${service}
${description ? `Description: ${description}` : ''}`
    };

    // Make API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, userMessage],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Check for valid response
    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      return NextResponse.json(
        { success: false, message: 'Invalid response from OpenAI' },
        { status: 500 }
      );
    }

    // Extract the template content
    let templateContent = completion.choices[0].message.content || '';
    
    // If the AI still used placeholders, replace them with sample values
    if (templateContent.includes('{{') && templateContent.includes('}}')) {
      // Update replacement values with any custom values provided
      const customReplacementValues: Record<string, string> = {
        '{{client_name}}': clientName,
        '{{name}}': clientName,
        '{{invoice_amount}}': amount,
        '{{payment_amount}}': amount,
        '{{service}}': service,
        '{{project_name}}': service,
      };
      
      templateContent = replacePlaceholdersWithCustomValues(templateContent, customReplacementValues);
    }

    return NextResponse.json({
      success: true,
      template: {
        content: templateContent,
        type: templateType,
        description: description || `AI-generated ${templateType} template`,
      }
    });
  } catch (error) {
    console.error('Template generation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to generate template' },
      { status: 500 }
    );
  }
}

// Function to replace placeholders with custom values, falling back to defaults
const replacePlaceholdersWithCustomValues = (content: string, customValues: Record<string, string>): string => {
  const sampleValues: Record<string, string> = {
    '{{client_name}}': 'John Smith',
    '{{name}}': 'John Smith',
    '{{company_name}}': 'Acme Corporation',
    '{{invoice_number}}': 'INV-2023-1001',
    '{{invoice_amount}}': '$450.00',
    '{{due_date}}': '30th June 2023',
    '{{payment_amount}}': '$450.00',
    '{{date}}': 'June 15, 2023',
    '{{email}}': 'john.smith@example.com',
    '{{phone}}': '(555) 123-4567',
    '{{address}}': '123 Main Street, New York, NY 10001',
    '{{service}}': 'Website Development',
    '{{project_name}}': 'Website Redesign',
    '{{meeting_time}}': '10:00 AM, Tuesday, June 20, 2023',
    '{{appointment_time}}': '2:00 PM, Wednesday, June 21, 2023',
    '{{product}}': 'Premium Plan Subscription',
    '{{discount}}': '15%',
    '{{discount_code}}': 'SUMMER15',
    '{{total}}': '$382.50',
    '{{subtotal}}': '$350.00',
    '{{tax}}': '$32.50',
    '{{payment_method}}': 'Credit Card',
    '{{payment_date}}': 'June 10, 2023',
    '{{order_number}}': 'ORD-2023-4567',
    '{{delivery_date}}': 'June 25, 2023',
    '{{website}}': 'www.acmecorp.com',
    '{{login_url}}': 'https://app.acmecorp.com/login',
    '{{support_email}}': 'support@acmecorp.com',
    '{{support_phone}}': '(555) 987-6543',
    '{{subscription_plan}}': 'Professional Plan',
    '{{subscription_price}}': '$49.99/month',
    '{{renewal_date}}': 'July 15, 2023',
    '{{username}}': 'johnsmith',
    '{{account_number}}': 'ACCT-12345',
    '{{event_name}}': 'Annual Industry Conference',
    '{{event_date}}': 'September 15-17, 2023',
    '{{event_location}}': 'Marriott Conference Center, New York',
    '{{ticket_type}}': 'VIP Pass',
    '{{ticket_price}}': '$299.00',
  };
  
  // Merge default values with custom values, with custom values taking precedence
  const mergedValues = { ...sampleValues, ...customValues };
  
  // Replace all placeholders found in the content
  let result = content;
  const placeholderRegex = /{{([a-z_]+)}}/g;
  let match;
  while ((match = placeholderRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const placeholder = match[1];
    const replacement = mergedValues[fullMatch] || `[${placeholder}]`;
    result = result.replace(new RegExp(fullMatch, 'g'), replacement);
  }
  
  return result;
} 