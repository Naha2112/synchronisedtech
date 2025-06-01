import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAnalysisResult {
  confidence: number;
  reasoning: string;
  suggestions?: string[];
}

export interface InvoiceCategorization extends AIAnalysisResult {
  category: string;
  subcategory: string;
  tags: string[];
  industry: string;
}

export interface FollowUpSuggestion extends AIAnalysisResult {
  urgency: 'low' | 'medium' | 'high' | 'critical';
  timing: string;
  method: 'email' | 'phone' | 'meeting' | 'text';
  template: string;
  nextAction: string;
}

export interface ExpensePrediction extends AIAnalysisResult {
  predictedAmount: number;
  timeframe: string;
  factors: string[];
  recommendation: string;
}

export interface SentimentAnalysis extends AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  score: number; // -1 to 1
  emotions: string[];
  keyPhrases: string[];
  actionRequired: boolean;
}

export class AIService {
  // Smart Invoice Categorization
  static async categorizeInvoice(
    invoiceData: {
      description: string;
      amount: number;
      clientName: string;
      items: { description: string; amount: number }[];
      industry?: string;
    }
  ): Promise<InvoiceCategorization> {
    try {
      const prompt = `
        Analyze this invoice and categorize it intelligently:
        
        Client: ${invoiceData.clientName}
        Amount: $${invoiceData.amount}
        Description: ${invoiceData.description}
        Industry: ${invoiceData.industry || 'Unknown'}
        Items: ${invoiceData.items.map(item => `${item.description} - $${item.amount}`).join(', ')}
        
        Provide a JSON response with:
        1. Primary category (e.g., "Consulting", "Product Sales", "Maintenance", "Software", "Professional Services")
        2. Subcategory (more specific classification)
        3. Relevant tags for searchability
        4. Industry classification
        5. Confidence score (0-1)
        6. Reasoning for the categorization
        
        Format: { "category": "", "subcategory": "", "tags": [], "industry": "", "confidence": 0.0, "reasoning": "" }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        category: result.category,
        subcategory: result.subcategory,
        tags: result.tags || [],
        industry: result.industry,
        confidence: result.confidence,
        reasoning: result.reasoning,
      };
    } catch (error) {
      console.error('AI Categorization Error:', error);
      return {
        category: 'General',
        subcategory: 'Uncategorized',
        tags: [],
        industry: 'Unknown',
        confidence: 0,
        reasoning: 'AI categorization failed, using default category',
      };
    }
  }

  // Automated Follow-up Suggestions
  static async generateFollowUpSuggestions(
    clientData: {
      name: string;
      lastInteraction: Date;
      invoiceStatus: string;
      paymentHistory: 'excellent' | 'good' | 'poor' | 'new';
      communicationHistory: string[];
      outstandingAmount?: number;
    }
  ): Promise<FollowUpSuggestion> {
    try {
      const daysSinceLastContact = Math.floor(
        (Date.now() - clientData.lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
      );

      const prompt = `
        Analyze this client situation and suggest optimal follow-up strategy:
        
        Client: ${clientData.name}
        Days since last contact: ${daysSinceLastContact}
        Invoice status: ${clientData.invoiceStatus}
        Payment history: ${clientData.paymentHistory}
        Outstanding amount: $${clientData.outstandingAmount || 0}
        Recent communications: ${clientData.communicationHistory.slice(-3).join('. ')}
        
        Provide strategic follow-up recommendations in JSON format:
        {
          "urgency": "low|medium|high|critical",
          "timing": "specific timing recommendation",
          "method": "email|phone|meeting|text",
          "template": "personalized message template",
          "nextAction": "specific next step",
          "confidence": 0.0,
          "reasoning": "explanation of recommendation"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 600,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        urgency: result.urgency,
        timing: result.timing,
        method: result.method,
        template: result.template,
        nextAction: result.nextAction,
        confidence: result.confidence,
        reasoning: result.reasoning,
      };
    } catch (error) {
      console.error('AI Follow-up Error:', error);
      return {
        urgency: 'medium',
        timing: 'Within 1-2 business days',
        method: 'email',
        template: 'Standard follow-up email',
        nextAction: 'Send follow-up email',
        confidence: 0,
        reasoning: 'AI analysis failed, using default suggestion',
      };
    }
  }

  // Expense Prediction
  static async predictExpenses(
    historicalData: {
      monthlyExpenses: { month: string; amount: number; categories: Record<string, number> }[];
      businessGrowth: number; // percentage
      seasonalFactors: Record<string, number>;
      upcomingProjects: { name: string; estimatedCost: number; timeline: string }[];
    }
  ): Promise<ExpensePrediction> {
    try {
      const prompt = `
        Analyze expense patterns and predict future expenses:
        
        Historical monthly expenses (last 12 months):
        ${historicalData.monthlyExpenses.map(m => `${m.month}: $${m.amount}`).join(', ')}
        
        Business growth rate: ${historicalData.businessGrowth}%
        Seasonal factors: ${JSON.stringify(historicalData.seasonalFactors)}
        Upcoming projects: ${historicalData.upcomingProjects.map(p => `${p.name} - $${p.estimatedCost} (${p.timeline})`).join(', ')}
        
        Provide expense prediction in JSON format:
        {
          "predictedAmount": 0,
          "timeframe": "next 3 months",
          "factors": ["key factors affecting prediction"],
          "recommendation": "actionable recommendation",
          "confidence": 0.0,
          "reasoning": "detailed explanation"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        predictedAmount: result.predictedAmount,
        timeframe: result.timeframe,
        factors: result.factors || [],
        recommendation: result.recommendation,
        confidence: result.confidence,
        reasoning: result.reasoning,
      };
    } catch (error) {
      console.error('AI Expense Prediction Error:', error);
      return {
        predictedAmount: 0,
        timeframe: 'Unable to predict',
        factors: [],
        recommendation: 'Insufficient data for prediction',
        confidence: 0,
        reasoning: 'AI prediction failed',
      };
    }
  }

  // Client Sentiment Analysis
  static async analyzeSentiment(
    communicationData: {
      messages: { text: string; sender: 'client' | 'business'; date: Date }[];
      clientName: string;
      context: string;
    }
  ): Promise<SentimentAnalysis> {
    try {
      const clientMessages = communicationData.messages
        .filter(m => m.sender === 'client')
        .slice(-10) // Last 10 messages
        .map(m => m.text)
        .join(' ');

      const prompt = `
        Analyze the sentiment of this client communication:
        
        Client: ${communicationData.clientName}
        Context: ${communicationData.context}
        Recent messages: "${clientMessages}"
        
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
        
        Score range: -1 (very negative) to +1 (very positive)
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 400,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        sentiment: result.sentiment,
        score: result.score,
        emotions: result.emotions || [],
        keyPhrases: result.keyPhrases || [],
        actionRequired: result.actionRequired,
        confidence: result.confidence,
        reasoning: result.reasoning,
      };
    } catch (error) {
      console.error('AI Sentiment Analysis Error:', error);
      return {
        sentiment: 'neutral',
        score: 0,
        emotions: [],
        keyPhrases: [],
        actionRequired: false,
        confidence: 0,
        reasoning: 'AI sentiment analysis failed',
      };
    }
  }

  // Batch processing for efficiency
  static async batchAnalyze(requests: {
    type: 'categorization' | 'followup' | 'prediction' | 'sentiment';
    data: any;
    id: string;
  }[]): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    
    // Process in parallel but with rate limiting
    const batches = [];
    for (let i = 0; i < requests.length; i += 3) {
      batches.push(requests.slice(i, i + 3));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (request) => {
        try {
          let result;
          switch (request.type) {
            case 'categorization':
              result = await this.categorizeInvoice(request.data);
              break;
            case 'followup':
              result = await this.generateFollowUpSuggestions(request.data);
              break;
            case 'prediction':
              result = await this.predictExpenses(request.data);
              break;
            case 'sentiment':
              result = await this.analyzeSentiment(request.data);
              break;
            default:
              result = null;
          }
          return { id: request.id, result };
        } catch (error) {
          console.error(`Batch AI Error for ${request.id}:`, error);
          return { id: request.id, result: null };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ id, result }) => {
        results[id] = result;
      });

      // Rate limiting - wait between batches
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}

export default AIService; 