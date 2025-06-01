"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AIChat } from "@/components/ai-chat";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Target,
  Lightbulb,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Cpu,
  Activity
} from "lucide-react";

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
    usage_count: number;
    success_rate: number;
  }[];
}

export default function AIPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [aiStats, setAiStats] = useState<AIStats | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [runningAnalysis, setRunningAnalysis] = useState<string | null>(null);

  // Load real AI stats from API instead of mock data
  useEffect(() => {
    const fetchAIStats = async () => {
      setLoading(true);
      
      try {
        const response = await fetch('/api/ai/stats');
        const data = await response.json();
        
        if (data.success) {
          setAiStats(data.stats);
          
          if (data.message) {
            toast({
              title: "AI Stats Loaded",
              description: data.message,
            });
          }
        } else {
          throw new Error(data.error || 'Failed to fetch AI stats');
        }
      } catch (error) {
        console.error('Failed to load AI stats:', error);
        
        // Fallback to basic stats if API fails
        const fallbackStats: AIStats = {
          totalAnalyses: 0,
          averageConfidence: 0,
          automatedActions: 0,
          timesSaved: 0,
          insights: [
            {
              id: 'welcome',
              type: 'categorization',
              title: 'Welcome to AI Assistant',
              description: 'Start using AI features to see insights and analytics here',
              confidence: 1.0,
              impact: 'low',
              actionRequired: false,
              createdAt: new Date().toISOString(),
            }
          ],
          features: [],
        };
        
        setAiStats(fallbackStats);
        
        toast({
          variant: "destructive",
          title: "AI Stats Unavailable",
          description: "Using fallback data. Please check your connection.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAIStats();
  }, []);

  const runAIAnalysis = async (type: string) => {
    setRunningAnalysis(type);
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisType: type
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "AI Analysis Complete",
          description: data.message || `${type} analysis completed successfully.`,
        });
        
        // Refresh the stats to show new analysis results
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(data.message || data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to complete AI analysis. Please try again.",
      });
    } finally {
      setRunningAnalysis(null);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'categorization': return Target;
      case 'followup': return Users;
      case 'prediction': return TrendingUp;
      case 'sentiment': return MessageSquare;
      default: return Brain;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950/30 via-gray-950/30 to-slate-900/30">
        <LoadingSpinner variant="overlay" text="Initializing AI Systems..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/30 via-gray-950/30 to-slate-900/30 text-white p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                AI Assistant
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Intelligent business automation and insights
              </p>
            </div>
          </div>
        </div>

        {/* AI Stats Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Analyses</p>
                  <p className="text-2xl font-bold text-white">{aiStats?.totalAnalyses}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Cpu className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Confidence</p>
                  <p className="text-2xl font-bold text-white">{(aiStats?.averageConfidence || 0 * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Automated Actions</p>
                  <p className="text-2xl font-bold text-white">{aiStats?.automatedActions}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Time Saved</p>
                  <p className="text-2xl font-bold text-white">{aiStats?.timesSaved}h</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chat" className="space-y-8">
          <TabsList className="bg-gray-800/50 border border-gray-700/50 p-1 grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="categorization" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Categorization
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Sentiment
            </TabsTrigger>
          </TabsList>

          {/* AI Chat Interface */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  AI Assistant Chat
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Chat with the AI assistant for help with AutoFlow features, email templates, invoices, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AIChat />
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {aiStats?.insights.map((insight) => {
                const IconComponent = getInsightIcon(insight.type);
                return (
                  <Card 
                    key={insight.id}
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50 cursor-pointer hover:border-blue-500/30 transition-all duration-300"
                    onClick={() => setSelectedInsight(insight)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <IconComponent className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white">{insight.title}</CardTitle>
                            <CardDescription className="text-gray-400">{insight.description}</CardDescription>
                          </div>
                        </div>
                        {insight.actionRequired && (
                          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                            Action Required
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Confidence:</span>
                          <Progress value={insight.confidence * 100} className="w-20" />
                          <span className="text-sm text-white">{(insight.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <Badge className={`${getImpactColor(insight.impact)} border`}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Smart Categorization */}
          <TabsContent value="categorization" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-blue-400" />
                  Smart Invoice Categorization
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI automatically categorizes invoices by type, industry, and purpose
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {aiStats?.features && aiStats.features
                    .filter(f => f.id === 'invoice_categorization')
                    .map(feature => (
                      <div key={feature.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-white font-medium">{feature.name}</span>
                        </div>
                        <p className="text-sm text-gray-400">{feature.usage_count} invoices categorized</p>
                        <p className="text-xs text-gray-500 mt-1">{feature.success_rate.toFixed(1)}% accuracy</p>
                      </div>
                    ))
                  }
                  
                  {/* Dynamic category display based on real usage */}
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-white font-medium">Recent Categories</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {aiStats?.insights.filter(i => i.type === 'categorization').length || 0} recent categorizations
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-white font-medium">AI Confidence</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {((aiStats?.averageConfidence || 0) * 100).toFixed(1)}% average confidence
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => runAIAnalysis('Categorization')}
                    disabled={runningAnalysis !== null}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {runningAnalysis === 'Categorization' ? (
                      <LoadingSpinner variant="inline" size="sm" text="Analyzing..." />
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Run Batch Categorization
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    View Categories
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expense Predictions */}
          <TabsContent value="predictions" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Expense Predictions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI forecasts future expenses based on historical patterns and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Recent Predictions</h3>
                    <div className="space-y-3">
                      {aiStats?.insights
                        .filter(insight => insight.type === 'prediction')
                        .slice(0, 3)
                        .map((prediction, index) => (
                          <div key={prediction.id} className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                            <span className="text-gray-300">{prediction.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{(prediction.confidence * 100).toFixed(1)}%</span>
                              <span className="text-white text-sm">{prediction.description}</span>
                            </div>
                          </div>
                        ))
                      }
                      
                      {(!aiStats?.insights || aiStats.insights.filter(i => i.type === 'prediction').length === 0) && (
                        <div className="text-center py-6 text-gray-400">
                          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No predictions available yet</p>
                          <p className="text-sm mt-1">Run expense prediction to see forecasts</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">AI Insights</h3>
                    <div className="space-y-3">
                      {aiStats?.insights
                        .filter(insight => insight.actionRequired)
                        .slice(0, 3)
                        .map((insight, index) => (
                          <div key={insight.id} className={`p-3 rounded-lg border ${
                            insight.impact === 'high' ? 'bg-red-500/10 border-red-500/30' :
                            insight.impact === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                            'bg-green-500/10 border-green-500/30'
                          }`}>
                            <p className={`text-sm ${
                              insight.impact === 'high' ? 'text-red-300' :
                              insight.impact === 'medium' ? 'text-yellow-300' :
                              'text-green-300'
                            }`}>
                              {insight.description}
                            </p>
                          </div>
                        ))
                      }
                      
                      {(!aiStats?.insights || aiStats.insights.filter(i => i.actionRequired).length === 0) && (
                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-sm text-green-300">All systems operating normally</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => runAIAnalysis('Expense Prediction')}
                  disabled={runningAnalysis !== null}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {runningAnalysis === 'Expense Prediction' ? (
                    <LoadingSpinner variant="inline" size="sm" text="Predicting..." />
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Generate New Forecast
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sentiment Analysis */}
          <TabsContent value="sentiment" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  Client Sentiment Analysis
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI analyzes client communications to gauge satisfaction and identify issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {(() => {
                    const sentimentInsights = aiStats?.insights.filter(i => i.type === 'sentiment') || [];
                    const positiveCount = sentimentInsights.filter(i => i.confidence > 0.5).length;
                    const neutralCount = sentimentInsights.filter(i => i.confidence <= 0.5 && i.confidence >= -0.2).length;
                    const negativeCount = sentimentInsights.filter(i => i.confidence < -0.2).length;
                    const total = sentimentInsights.length || 1; // Avoid division by zero
                    
                    return (
                      <>
                        <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <div className="text-2xl font-bold text-green-400 mb-1">
                            {total > 0 ? Math.round((positiveCount / total) * 100) : 0}%
                          </div>
                          <div className="text-sm text-green-300">Positive Sentiment</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-400 mb-1">
                            {total > 0 ? Math.round((neutralCount / total) * 100) : 0}%
                          </div>
                          <div className="text-sm text-yellow-300">Neutral Sentiment</div>
                        </div>
                        <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="text-2xl font-bold text-red-400 mb-1">
                            {total > 0 ? Math.round((negativeCount / total) * 100) : 0}%
                          </div>
                          <div className="text-sm text-red-300">Negative Sentiment</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-white font-medium">Recent Sentiment Analysis</h3>
                  <div className="space-y-2">
                    {aiStats?.insights
                      .filter(insight => insight.type === 'sentiment')
                      .slice(0, 3)
                      .map((sentiment, index) => (
                        <div key={sentiment.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                          sentiment.impact === 'high' ? 'bg-red-500/10 border-red-500/30' : 
                          'bg-green-500/10 border-green-500/30'
                        }`}>
                          {sentiment.impact === 'high' ? (
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                          <div className="flex-1">
                            <p className="text-white text-sm">{sentiment.title}</p>
                            <p className="text-gray-400 text-xs">{sentiment.description}</p>
                          </div>
                          {sentiment.actionRequired && (
                            <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                              Review
                            </Button>
                          )}
                        </div>
                      ))
                    }
                    
                    {(!aiStats?.insights || aiStats.insights.filter(i => i.type === 'sentiment').length === 0) && (
                      <div className="text-center py-6 text-gray-400">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No sentiment analysis available yet</p>
                        <p className="text-sm mt-1">Analyze client communications to see sentiment trends</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={() => runAIAnalysis('Sentiment Analysis')}
                  disabled={runningAnalysis !== null}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {runningAnalysis === 'Sentiment Analysis' ? (
                    <LoadingSpinner variant="inline" size="sm" text="Analyzing..." />
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Analyze Recent Communications
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 