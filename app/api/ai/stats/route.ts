import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';
import { getAIConfig } from '@/lib/ai/config';

interface AIInsight {
  id: string;
  type: 'categorization' | 'followup' | 'prediction' | 'sentiment';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  createdAt: string;
}

interface AIStats {
  totalAnalyses: number;
  averageConfidence: number;
  automatedActions: number;
  timesSaved: number;
  insights: AIInsight[];
  features: {
    id: string;
    name: string;
    enabled: boolean;
    usage_count: number;
    success_rate: number;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication with better error handling
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (authError) {
      console.log('Auth error, proceeding with fallback data:', authError);
      // Continue with fallback data instead of failing
    }
    
    if (!session) {
      console.log('No session found, returning fallback AI stats');
      // Return fallback stats instead of 401 error
      const fallbackStats: AIStats = {
        totalAnalyses: 0,
        averageConfidence: 0,
        automatedActions: 0,
        timesSaved: 0,
        insights: [
          {
            id: 'auth-required',
            type: 'categorization',
            title: 'Authentication Required',
            description: 'Please log in to see your AI analysis data',
            confidence: 1.0,
            impact: 'low',
            actionRequired: true,
            createdAt: new Date().toISOString(),
          }
        ],
        features: getAIConfig().features.map(f => ({
          id: f.id,
          name: f.name,
          enabled: f.enabled,
          usage_count: 0,
          success_rate: 0
        }))
      };

      return NextResponse.json({
        success: true,
        stats: fallbackStats,
        message: 'Please log in to access your AI data',
        requiresAuth: true
      });
    }

    const config = getAIConfig();
    
    // Get AI analysis statistics from database
    const analysisStats = await query(`
      SELECT 
        type,
        COUNT(*) as total_count,
        AVG(confidence) as avg_confidence,
        COUNT(CASE WHEN confidence > 0.8 THEN 1 END) as high_confidence_count
      FROM client_AI_Analysis 
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY type
    `) as any[];

    // Get recent AI insights
    const recentInsights = await query(`
      SELECT 
        id,
        type,
        result,
        confidence,
        createdAt
      FROM client_AI_Analysis 
      WHERE confidence > 0.7
      ORDER BY createdAt DESC 
      LIMIT 10
    `) as any[];

    // Calculate total analyses
    const totalAnalyses = analysisStats.reduce((sum, stat) => sum + stat.total_count, 0);
    
    // Calculate average confidence
    const totalConfidence = analysisStats.reduce((sum, stat) => sum + (stat.avg_confidence * stat.total_count), 0);
    const averageConfidence = totalAnalyses > 0 ? totalConfidence / totalAnalyses : 0;

    // Process insights from database results
    const insights: AIInsight[] = recentInsights.map((row, index) => {
      let title = 'AI Analysis Result';
      let description = 'Analysis completed';
      let actionRequired = false;
      let impact: 'high' | 'medium' | 'low' = 'medium';

      try {
        const result = JSON.parse(row.result);
        
        switch (row.type) {
          case 'CATEGORIZATION':
            title = 'Invoice Categorization';
            description = `Categorized as ${result.category} with ${(row.confidence * 100).toFixed(1)}% confidence`;
            impact = row.confidence > 0.9 ? 'high' : row.confidence > 0.7 ? 'medium' : 'low';
            break;
          case 'FOLLOWUP':
            title = 'Follow-up Suggestion';
            description = `${result.urgency} priority follow-up recommended via ${result.method}`;
            actionRequired = result.urgency === 'high' || result.urgency === 'critical';
            impact = result.urgency === 'critical' ? 'high' : result.urgency === 'high' ? 'medium' : 'low';
            break;
          case 'PREDICTION':
            title = 'Expense Prediction';
            description = `Predicted ${result.predictedAmount} for ${result.timeframe}`;
            actionRequired = result.predictedAmount > 10000;
            impact = 'medium';
            break;
          case 'SENTIMENT':
            title = 'Sentiment Analysis';
            description = `${result.sentiment} sentiment detected (score: ${result.score})`;
            actionRequired = result.actionRequired || result.score < -0.5;
            impact = result.score < -0.5 ? 'high' : result.score > 0.5 ? 'low' : 'medium';
            break;
        }
      } catch (error) {
        console.warn('Failed to parse AI result:', error);
      }

      return {
        id: row.id.toString(),
        type: row.type.toLowerCase() as any,
        title,
        description,
        confidence: row.confidence,
        impact,
        actionRequired,
        createdAt: row.createdAt
      };
    });

    // Calculate automated actions (rough estimate based on auto-execute features)
    const automatedActions = Math.floor(totalAnalyses * 0.3); // Assume 30% are automated

    // Calculate time saved (estimate: 5 minutes per analysis)
    const timesSaved = Math.round((totalAnalyses * 5) / 60 * 10) / 10; // Hours, rounded to 1 decimal

    // Get feature usage stats
    const features = config.features.map(feature => {
      const featureStats = analysisStats.find(stat => stat.type.toLowerCase() === feature.id.replace('_', ''));
      return {
        id: feature.id,
        name: feature.name,
        enabled: feature.enabled,
        usage_count: featureStats?.total_count || 0,
        success_rate: featureStats?.high_confidence_count ? 
          (featureStats.high_confidence_count / featureStats.total_count) * 100 : 0
      };
    });

    const stats: AIStats = {
      totalAnalyses,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      automatedActions,
      timesSaved,
      insights,
      features
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('AI stats API error:', error);
    
    // Return fallback stats if database query fails
    const fallbackStats: AIStats = {
      totalAnalyses: 0,
      averageConfidence: 0,
      automatedActions: 0,
      timesSaved: 0,
      insights: [
        {
          id: 'system-error',
          type: 'categorization',
          title: 'System Initialization',
          description: 'AI system is initializing. Please try again in a moment.',
          confidence: 0.5,
          impact: 'low',
          actionRequired: false,
          createdAt: new Date().toISOString(),
        }
      ],
      features: getAIConfig().features.map(f => ({
        id: f.id,
        name: f.name,
        enabled: f.enabled,
        usage_count: 0,
        success_rate: 0
      }))
    };

    return NextResponse.json({
      success: true,
      stats: fallbackStats,
      message: 'Using fallback data due to system error'
    });
  }
} 