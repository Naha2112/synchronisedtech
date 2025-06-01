// AI Configuration System
// This file manages AI assistant settings, prompts, and templates

export interface AIPromptTemplate {
  id: string;
  name: string;
  category: 'system' | 'user' | 'assistant';
  template: string;
  variables: string[];
  description: string;
  active: boolean;
}

export interface AIFeatureConfig {
  id: string;
  name: string;
  enabled: boolean;
  confidence_threshold: number;
  auto_execute: boolean;
  description: string;
  settings: Record<string, any>;
}

export interface AISystemConfig {
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
  features: AIFeatureConfig[];
  prompts: AIPromptTemplate[];
  knowledge_base_enabled: boolean;
  fallback_responses: string[];
}

// Default AI System Configuration
export const defaultAIConfig: AISystemConfig = {
  model: process.env.AI_MODEL || "gpt-3.5-turbo",
  temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
  max_tokens: parseInt(process.env.AI_MAX_TOKENS || "1000"),
  system_prompt: process.env.AI_SYSTEM_PROMPT || `You are a helpful AI assistant for the AutoFlow application, which helps businesses manage clients, bookings, invoices, and email automation.

Your goal is to help users with their tasks in AutoFlow. Be concise, helpful, and knowledgeable about all AutoFlow features. When a user asks about specific functionality, try to explain exactly how to accomplish their task using the appropriate AutoFlow features.

Available features:
- Client Management
- Invoice Creation and Management
- Email Templates and Automation
- Booking and Scheduling
- Financial Analytics
- Professional Email Templates

Always ask for clarification if you need more information to help the user effectively.`,

  features: [
    {
      id: 'invoice_categorization',
      name: 'Smart Invoice Categorization',
      enabled: true,
      confidence_threshold: 0.8,
      auto_execute: false,
      description: 'Automatically categorize invoices by type and industry',
      settings: {
        categories: ['Consulting', 'Products', 'Maintenance', 'Software', 'Professional Services'],
        batch_size: 50
      }
    },
    {
      id: 'follow_up_suggestions',
      name: 'Follow-up Suggestions',
      enabled: true,
      confidence_threshold: 0.75,
      auto_execute: false,
      description: 'Generate intelligent follow-up suggestions for clients',
      settings: {
        urgency_levels: ['low', 'medium', 'high', 'critical'],
        methods: ['email', 'phone', 'meeting', 'text']
      }
    },
    {
      id: 'expense_prediction',
      name: 'Expense Prediction',
      enabled: true,
      confidence_threshold: 0.7,
      auto_execute: false,
      description: 'Predict future expenses based on historical data',
      settings: {
        forecast_months: 3,
        include_seasonal: true
      }
    },
    {
      id: 'sentiment_analysis',
      name: 'Client Sentiment Analysis',
      enabled: true,
      confidence_threshold: 0.8,
      auto_execute: true,
      description: 'Analyze client communication sentiment',
      settings: {
        alert_threshold: -0.5,
        batch_analysis: true
      }
    },
    {
      id: 'template_generation',
      name: 'Email Template Generation',
      enabled: true,
      confidence_threshold: 0.85,
      auto_execute: false,
      description: 'Generate professional email templates',
      settings: {
        template_types: ['invoice', 'reminder', 'follow-up', 'welcome', 'thank-you'],
        personalization: true
      }
    }
  ],

  prompts: [
    {
      id: 'invoice_categorization_prompt',
      name: 'Invoice Categorization System Prompt',
      category: 'system',
      template: `Analyze this invoice and categorize it intelligently:

Client: {client_name}
Amount: {amount}
Description: {description}
Industry: {industry}
Items: {items}

Provide a JSON response with:
1. Primary category (e.g., "Consulting", "Product Sales", "Maintenance", "Software", "Professional Services")
2. Subcategory (more specific classification)
3. Relevant tags for searchability
4. Industry classification
5. Confidence score (0-1)
6. Reasoning for the categorization

Format: { "category": "", "subcategory": "", "tags": [], "industry": "", "confidence": 0.0, "reasoning": "" }`,
      variables: ['client_name', 'amount', 'description', 'industry', 'items'],
      description: 'System prompt for invoice categorization',
      active: true
    },
    {
      id: 'follow_up_prompt',
      name: 'Follow-up Suggestion System Prompt',
      category: 'system',
      template: `Analyze this client situation and suggest optimal follow-up strategy:

Client: {client_name}
Days since last contact: {days_since_contact}
Invoice status: {invoice_status}
Payment history: {payment_history}
Outstanding amount: {outstanding_amount}
Recent communications: {recent_communications}

Provide strategic follow-up recommendations in JSON format:
{
  "urgency": "low|medium|high|critical",
  "timing": "specific timing recommendation",
  "method": "email|phone|meeting|text",
  "template": "personalized message template",
  "nextAction": "specific next step",
  "confidence": 0.0,
  "reasoning": "explanation of recommendation"
}`,
      variables: ['client_name', 'days_since_contact', 'invoice_status', 'payment_history', 'outstanding_amount', 'recent_communications'],
      description: 'System prompt for follow-up suggestions',
      active: true
    },
    {
      id: 'expense_prediction_prompt',
      name: 'Expense Prediction System Prompt',
      category: 'system',
      template: `Analyze expense patterns and predict future expenses:

Historical monthly expenses (last 12 months): {historical_expenses}
Business growth rate: {growth_rate}%
Seasonal factors: {seasonal_factors}
Upcoming projects: {upcoming_projects}

Provide expense prediction in JSON format:
{
  "predictedAmount": 0,
  "timeframe": "next 3 months",
  "factors": ["key factors affecting prediction"],
  "recommendation": "actionable recommendation",
  "confidence": 0.0,
  "reasoning": "detailed explanation"
}`,
      variables: ['historical_expenses', 'growth_rate', 'seasonal_factors', 'upcoming_projects'],
      description: 'System prompt for expense prediction',
      active: true
    },
    {
      id: 'sentiment_analysis_prompt',
      name: 'Sentiment Analysis System Prompt',
      category: 'system',
      template: `Analyze the sentiment of this client communication:

Client: {client_name}
Context: {context}
Recent messages: "{messages}"

Provide comprehensive sentiment analysis in JSON format:
{
  "sentiment": "positive|negative|neutral|mixed",
  "score": 0.0,
  "emotions": ["detected emotions"],
  "keyPhrases": ["important phrases"],
  "actionRequired": false,
  "confidence": 0.0,
  "reasoning": "detailed analysis"
}

Score range: -1 (very negative) to +1 (very positive)`,
      variables: ['client_name', 'context', 'messages'],
      description: 'System prompt for sentiment analysis',
      active: true
    }
  ],

  knowledge_base_enabled: true,
  fallback_responses: [
    "I understand you're looking for help with that. Could you provide more specific details about what you'd like to accomplish?",
    "I'm here to help with AutoFlow features. Could you clarify what specific task you're trying to complete?",
    "Let me help you with that. What AutoFlow feature are you trying to use - invoices, clients, templates, or something else?",
    "I want to make sure I give you the most helpful response. Could you provide more context about your request?"
  ]
};

// Function to get AI configuration (can be extended to load from database)
export function getAIConfig(): AISystemConfig {
  return defaultAIConfig;
}

// Function to update AI configuration
export function updateAIConfig(updates: Partial<AISystemConfig>): AISystemConfig {
  return { ...defaultAIConfig, ...updates };
}

// Function to get specific feature configuration
export function getFeatureConfig(featureId: string): AIFeatureConfig | null {
  return defaultAIConfig.features.find(f => f.id === featureId) || null;
}

// Function to get specific prompt template
export function getPromptTemplate(promptId: string): AIPromptTemplate | null {
  return defaultAIConfig.prompts.find(p => p.id === promptId) || null;
}

// Function to populate prompt template with variables
export function populatePrompt(templateId: string, variables: Record<string, any>): string {
  const template = getPromptTemplate(templateId);
  if (!template) return '';
  
  let populatedPrompt = template.template;
  
  // Replace variables in the template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{${key}}`, 'g');
    populatedPrompt = populatedPrompt.replace(regex, String(value));
  }
  
  return populatedPrompt;
}

// Function to validate AI configuration
export function validateAIConfig(config: AISystemConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.model) {
    errors.push('AI model is required');
  }
  
  if (config.temperature < 0 || config.temperature > 1) {
    errors.push('Temperature must be between 0 and 1');
  }
  
  if (config.max_tokens < 1 || config.max_tokens > 4000) {
    errors.push('Max tokens must be between 1 and 4000');
  }
  
  if (!config.system_prompt.trim()) {
    errors.push('System prompt is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
} 