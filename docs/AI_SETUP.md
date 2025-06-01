# 🤖 AutoFlow AI Features Setup Guide

## Overview
AutoFlow includes four powerful AI features:
1. **Smart Invoice Categorization** - Automatically categorize invoices by type, industry, and purpose
2. **Automated Follow-up Suggestions** - AI-powered client relationship management
3. **Expense Prediction** - Forecast future business expenses using historical data
4. **Client Sentiment Analysis** - Analyze client communications for satisfaction insights

## Prerequisites

### 1. OpenAI API Key
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to your `.env.local` file:
```bash
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

### 2. Database Setup
Run the AI database migration:
```bash
# Apply the AI tables migration
mysql -u your_username -p your_database < prisma/migrations/add_ai_features.sql

# Or run with Docker
docker exec -i your-mysql-container mysql -u root -p your_database < prisma/migrations/add_ai_features.sql
```

### 3. Install OpenAI Package
```bash
npm install openai
```

## Environment Variables

Add these to your `.env.local` file:

```bash
# Required for AI features
OPENAI_API_KEY="sk-your-openai-api-key-here"
NEXTAUTH_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Rate limiting and caching
AI_RATE_LIMIT="60" # requests per minute
AI_CACHE_TTL="3600" # cache results for 1 hour
```

## Feature Details

### 1. Smart Invoice Categorization

**What it does:**
- Automatically categorizes invoices by type (Consulting, Products, Maintenance, etc.)
- Adds relevant tags for better searchability
- Determines industry classification
- Provides confidence scores for each categorization

**How to use:**
1. Go to AI Assistant → Categorization tab
2. Click "Run Batch Categorization" to process all uncategorized invoices
3. View results and manually adjust if needed

**API Endpoint:**
```typescript
POST /api/ai/categorize
{
  "invoiceId": 123,
  "invoiceData": {
    "description": "Website development services",
    "amount": 5000,
    "clientName": "TechCorp Ltd",
    "items": [{"description": "Frontend development", "amount": 3000}]
  }
}
```

### 2. Automated Follow-up Suggestions

**What it does:**
- Analyzes client payment history and communication patterns
- Suggests optimal timing and method for follow-ups
- Generates personalized message templates
- Prioritizes clients based on urgency and value

**How to use:**
1. Go to AI Assistant → Follow-up suggestions
2. System automatically identifies clients needing attention
3. Click on a client to get AI-powered follow-up recommendations
4. Use suggested templates or customize messages

**API Endpoint:**
```typescript
POST /api/ai/followup
{
  "clientId": 456
}
```

### 3. Expense Prediction

**What it does:**
- Analyzes historical expense patterns
- Considers business growth trends and seasonal factors
- Predicts future expenses by category
- Provides actionable recommendations for budget planning

**How to use:**
1. Go to AI Assistant → Predictions tab
2. Click "Generate New Forecast"
3. Review predicted expenses and influencing factors
4. Use insights for budget planning and cost optimization

**API Endpoint:**
```typescript
POST /api/ai/predict-expenses
{
  "timeframe": "next_quarter",
  "includeSeasonality": true
}
```

### 4. Client Sentiment Analysis

**What it does:**
- Analyzes client emails, messages, and communication history
- Detects positive, negative, neutral, or mixed sentiments
- Identifies key phrases and emotional indicators
- Flags clients requiring immediate attention

**How to use:**
1. Go to AI Assistant → Sentiment tab
2. View overall sentiment trends and alerts
3. Click "Analyze Recent Communications" for updates
4. Take action on flagged negative sentiment clients

**API Endpoint:**
```typescript
POST /api/ai/sentiment
{
  "clientId": 789,
  "communicationHistory": [
    {"text": "Thank you for the excellent service!", "sender": "client", "date": "2024-01-15"}
  ]
}
```

## Performance & Cost Optimization

### Rate Limiting
- Default: 60 API calls per minute to OpenAI
- Batch processing for efficiency
- Caching results to avoid duplicate analyses

### Cost Management
- AI analyses are cached for 1 hour by default
- Batch operations process multiple items efficiently
- Use confidence thresholds to avoid unnecessary re-analysis

### Monitoring
- Track AI model performance in the database
- Monitor accuracy and confidence scores
- Review and adjust AI suggestions based on feedback

## Troubleshooting

### Common Issues

1. **OpenAI API Key Invalid**
```bash
Error: Invalid API key
Solution: Check your OPENAI_API_KEY in .env.local
```

2. **Database Tables Missing**
```bash
Error: Table 'AI_Analysis' doesn't exist
Solution: Run the migration SQL file
```

3. **Rate Limit Exceeded**
```bash
Error: Rate limit exceeded
Solution: Reduce AI_RATE_LIMIT or upgrade OpenAI plan
```

4. **Low Confidence Scores**
```bash
Issue: AI confidence consistently below 70%
Solution: Provide more detailed invoice descriptions and client data
```

### Debug Mode
Enable AI debugging by adding to `.env.local`:
```bash
AI_DEBUG="true"
```

This will log detailed AI request/response information.

## Integration Examples

### Automatic Categorization on Invoice Creation
```typescript
// In your invoice creation handler
const categorization = await AIService.categorizeInvoice({
  description: invoiceData.description,
  amount: invoiceData.total,
  clientName: client.name,
  items: invoiceData.items
});

// Update invoice with AI results
await prisma.invoices.update({
  where: { id: invoiceId },
  data: {
    category: categorization.category,
    subcategory: categorization.subcategory,
    tags: categorization.tags.join(','),
    ai_confidence: categorization.confidence
  }
});
```

### Scheduled Follow-up Analysis
```typescript
// Run daily to identify clients needing follow-up
const clientsNeedingAttention = await prisma.clients.findMany({
  where: {
    OR: [
      { last_contact_date: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      { invoices: { some: { status: 'overdue' } } }
    ]
  }
});

for (const client of clientsNeedingAttention) {
  const suggestion = await AIService.generateFollowUpSuggestions(client);
  // Store or act on suggestions
}
```

## Best Practices

1. **Regular Model Updates**: Review AI suggestions weekly and provide feedback
2. **Data Quality**: Ensure invoice descriptions and client data are detailed
3. **Human Oversight**: Always review high-impact AI recommendations
4. **Continuous Learning**: Use confidence scores to improve data quality
5. **Privacy**: Ensure client data handling complies with privacy regulations

## Support

For AI feature support:
1. Check logs for detailed error messages
2. Verify API keys and database connections
3. Review OpenAI usage and billing
4. Contact support with specific error messages and context

## Roadmap

Future AI enhancements:
- [ ] Voice-to-text invoice entry
- [ ] Smart contract generation
- [ ] Predictive client lifetime value
- [ ] Automated expense categorization
- [ ] Multi-language support
- [ ] Custom AI model training 