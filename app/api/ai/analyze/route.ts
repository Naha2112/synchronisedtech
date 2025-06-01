import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';
import { getAIConfig, getFeatureConfig } from '@/lib/ai/config';
import { AIService } from '@/lib/ai/openai';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analysisType, targetId } = await request.json();

    if (!analysisType) {
      return NextResponse.json({ error: 'Analysis type is required' }, { status: 400 });
    }

    const config = getAIConfig();
    let result = null;
    let analysisData = null;

    switch (analysisType) {
      case 'Categorization':
      case 'invoice_categorization': {
        // Get recent uncategorized invoices for batch processing
        const invoices = await query(`
          SELECT id, description, total as amount, client_id,
                 (SELECT name FROM clients WHERE id = invoices.client_id) as client_name
          FROM invoices 
          WHERE status = 'pending' 
          ORDER BY created_at DESC 
          LIMIT 10
        `) as any[];

        let processedCount = 0;
        for (const invoice of invoices) {
          try {
            const invoiceData = {
              description: invoice.description || 'Invoice',
              amount: invoice.amount || 0,
              clientName: invoice.client_name || 'Unknown Client',
              items: [{ description: invoice.description, amount: invoice.amount }],
              industry: 'General'
            };

            const categorization = await AIService.categorizeInvoice(invoiceData);
            
            // Store analysis result
            await query(`
              INSERT INTO client_AI_Analysis (clientId, type, result, confidence, createdAt)
              VALUES (?, 'CATEGORIZATION', ?, ?, NOW())
            `, [invoice.client_id, JSON.stringify(categorization), categorization.confidence]);

            processedCount++;
          } catch (error) {
            console.error('Categorization error for invoice:', invoice.id, error);
          }
        }

        result = {
          success: true,
          message: `Processed ${processedCount} invoices for categorization`,
          processedCount
        };
        break;
      }

      case 'Follow-up Analysis':
      case 'follow_up_suggestions': {
        // Get clients that might need follow-up
        const clients = await query(`
          SELECT c.id, c.name, c.lastContactDate, c.paymentRating, c.notes,
                 COUNT(i.id) as invoice_count,
                 SUM(CASE WHEN i.status = 'pending' THEN i.total ELSE 0 END) as outstanding_amount
          FROM clients c
          LEFT JOIN invoices i ON c.id = i.client_id
          WHERE c.lastContactDate IS NULL OR c.lastContactDate < DATE_SUB(NOW(), INTERVAL 7 DAY)
          GROUP BY c.id
          LIMIT 5
        `) as any[];

        let processedCount = 0;
        for (const client of clients) {
          try {
            const clientData = {
              name: client.name,
              lastInteraction: client.lastContactDate || new Date(),
              invoiceStatus: client.invoice_count > 0 ? 'pending' : 'none',
              paymentHistory: client.paymentRating || 'new',
              communicationHistory: client.notes ? [client.notes] : [],
              outstandingAmount: client.outstanding_amount || 0
            };

            const followUp = await AIService.generateFollowUpSuggestions(clientData);
            
            // Store analysis result
            await query(`
              INSERT INTO client_AI_Analysis (clientId, type, result, confidence, createdAt)
              VALUES (?, 'FOLLOWUP', ?, ?, NOW())
            `, [client.id, JSON.stringify(followUp), followUp.confidence]);

            processedCount++;
          } catch (error) {
            console.error('Follow-up analysis error for client:', client.id, error);
          }
        }

        result = {
          success: true,
          message: `Generated follow-up suggestions for ${processedCount} clients`,
          processedCount
        };
        break;
      }

      case 'Expense Prediction':
      case 'expense_prediction': {
        // Get historical expense data (invoices as expense indicators)
        const monthlyExpenses = await query(`
          SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            SUM(total) as amount,
            COUNT(*) as count
          FROM invoices 
          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
          GROUP BY DATE_FORMAT(created_at, '%Y-%m')
          ORDER BY month
        `) as any[];

        const historicalData = {
          monthlyExpenses: monthlyExpenses.map(row => ({
            month: row.month,
            amount: row.amount,
            categories: { 'General': row.amount }
          })),
          businessGrowth: 15, // Could be calculated from actual data
          seasonalFactors: {},
          upcomingProjects: []
        };

        try {
          const prediction = await AIService.predictExpenses(historicalData);
          
          // Store analysis result (use user ID as clientId for general predictions)
          await query(`
            INSERT INTO client_AI_Analysis (clientId, type, result, confidence, createdAt)
            VALUES (1, 'PREDICTION', ?, ?, NOW())
          `, [JSON.stringify(prediction), prediction.confidence]);

          result = {
            success: true,
            message: 'Expense prediction completed',
            prediction
          };
        } catch (error) {
          console.error('Expense prediction error:', error);
          result = {
            success: false,
            message: 'Failed to generate expense prediction'
          };
        }
        break;
      }

      case 'Sentiment Analysis':
      case 'sentiment_analysis': {
        // Get recent client communications (using notes as sample data)
        const communications = await query(`
          SELECT c.id, c.name, c.notes, c.lastContactDate
          FROM clients c
          WHERE c.notes IS NOT NULL AND c.notes != ''
          ORDER BY c.lastContactDate DESC
          LIMIT 5
        `) as any[];

        let processedCount = 0;
        for (const client of communications) {
          try {
            const communicationData = {
              messages: [
                { text: client.notes, sender: 'client' as const, date: new Date() }
              ],
              clientName: client.name,
              context: 'General client communication'
            };

            const sentiment = await AIService.analyzeSentiment(communicationData);
            
            // Store analysis result
            await query(`
              INSERT INTO client_AI_Analysis (clientId, type, result, confidence, createdAt)
              VALUES (?, 'SENTIMENT', ?, ?, NOW())
            `, [client.id, JSON.stringify(sentiment), sentiment.confidence]);

            processedCount++;
          } catch (error) {
            console.error('Sentiment analysis error for client:', client.id, error);
          }
        }

        result = {
          success: true,
          message: `Analyzed sentiment for ${processedCount} client communications`,
          processedCount
        };
        break;
      }

      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('AI analysis API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run AI analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 