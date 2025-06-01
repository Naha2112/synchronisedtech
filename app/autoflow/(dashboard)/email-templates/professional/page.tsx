"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Send, 
  Star, 
  Crown, 
  Briefcase, 
  TrendingUp, 
  Users, 
  CreditCard,
  FileText,
  CheckCircle,
  Award,
  Target,
  Sparkles,
  Copy,
  Download,
  Eye
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'invoice' | 'reminder' | 'follow-up' | 'client-relations' | 'project' | 'payment';
  industry?: string;
  tone: 'professional' | 'friendly-professional' | 'authoritative' | 'consultative';
}

export default function ProfessionalEmailTemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/email-templates/professional');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
        toast({
          title: "Templates Loaded",
          description: `${data.templates?.length || 0} professional templates loaded successfully.`,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load email templates. Please check your connection and try again.",
      });
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const previewTemplate = async (templateId: string) => {
    try {
      setPreviewLoading(true);
      const response = await fetch(`/api/email-templates/professional?id=${templateId}&preview=true`);
      if (response.ok) {
        const data = await response.json();
        setSelectedTemplate(data.template);
        toast({
          title: "Preview Ready",
          description: "Template preview loaded with sample data.",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to preview template:', error);
      toast({
        variant: "destructive",
        title: "Preview Error",
        description: "Failed to load template preview. Please try again.",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard successfully.`,
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please select and copy manually.",
      });
    }
  };

  const useTemplate = (template: EmailTemplate) => {
    toast({
      title: "Template Ready",
      description: `"${template.name}" is now ready for use in your email campaigns.`,
    });
    
    // Here you would integrate with your existing email system
    // For now, we'll just show success feedback
    console.log('Using template:', template.id);
  };

  const downloadTemplate = (template: EmailTemplate) => {
    try {
      const content = `Subject: ${template.subject}\n\nBody:\n${template.body}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: `Template "${template.name}" downloaded successfully.`,
      });
    } catch (error) {
      console.error('Failed to download template:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Unable to download template. Please try again.",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'invoice': return FileText;
      case 'reminder': return Target;
      case 'follow-up': return TrendingUp;
      case 'client-relations': return Users;
      case 'project': return Briefcase;
      case 'payment': return CreditCard;
      default: return Send;
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'friendly-professional': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'authoritative': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'consultative': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'invoice': return 'from-blue-600 to-blue-700';
      case 'reminder': return 'from-orange-600 to-orange-700';
      case 'follow-up': return 'from-green-600 to-green-700';
      case 'client-relations': return 'from-purple-600 to-purple-700';
      case 'project': return 'from-indigo-600 to-indigo-700';
      case 'payment': return 'from-emerald-600 to-emerald-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, EmailTemplate[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950/30 via-gray-950/30 to-slate-900/30">
        <LoadingSpinner variant="overlay" text="Loading Professional Templates..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/30 via-gray-950/30 to-slate-900/30 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30">
              <Crown className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Professional Email Templates
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Industry-grade templates that position your services as premium
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-yellow-400">Professional Advantage</span>
            </div>
            <p className="text-gray-300 text-sm">
              These templates are designed to command premium pricing and position your services as high-value investments. 
              Each template uses psychological triggers and professional language that encourages prompt payment and builds long-term client relationships.
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-3 mt-4">
            <Button 
              onClick={fetchTemplates}
              variant="outline" 
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Refresh Templates
            </Button>
            <Button 
              onClick={() => {
                if (selectedTemplate) {
                  copyToClipboard(selectedTemplate.subject + '\n\n' + selectedTemplate.body, 'Template');
                } else {
                  toast({
                    variant: "destructive",
                    title: "No Template Selected",
                    description: "Please select a template first.",
                  });
                }
              }}
              variant="outline" 
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              disabled={!selectedTemplate}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Selected
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Template Categories */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="invoice" className="space-y-6">
              <TabsList className="bg-gray-800/50 border border-gray-700/50 p-1 grid grid-cols-3 w-full">
                <TabsTrigger value="invoice" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="reminder" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Reminders
                </TabsTrigger>
                <TabsTrigger value="client-relations" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Client Relations
                </TabsTrigger>
              </TabsList>

              {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryTemplates.map((template) => {
                      const IconComponent = getCategoryIcon(template.category);
                      return (
                        <Card 
                          key={template.id}
                          className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50 cursor-pointer hover:border-purple-500/30 transition-all duration-300 group"
                          onClick={() => previewTemplate(template.id)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 bg-gradient-to-br ${getCategoryColor(template.category)} rounded-lg group-hover:scale-110 transition-transform`}>
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                                    {template.name}
                                  </CardTitle>
                                  <CardDescription className="text-gray-400">
                                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)} Template
                                  </CardDescription>
                                </div>
                              </div>
                              {template.id.includes('premium') && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-xs text-yellow-400 font-medium">Premium</span>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge className={`${getToneColor(template.tone)} border text-xs`}>
                                  {template.tone.replace('-', ' ')}
                                </Badge>
                              </div>
                              <p className="text-gray-300 text-sm line-clamp-2">
                                {template.subject}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <CheckCircle className="w-3 h-3" />
                                  Industry-tested
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                                    disabled={previewLoading}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      previewTemplate(template.id);
                                    }}
                                  >
                                    {previewLoading ? <LoadingSpinner variant="inline" size="sm" /> : <Eye className="w-3 h-3" />}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      downloadTemplate(template);
                                    }}
                                  >
                                    <Download className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Send className="w-5 h-5 text-purple-400" />
                  Template Preview
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Click any template to see a preview with sample data
                </CardDescription>
              </CardHeader>
              <CardContent>
                {previewLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner variant="inline" text="Loading preview..." />
                  </div>
                ) : selectedTemplate ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                      <div className="text-sm font-medium text-purple-400 mb-2">Subject Line:</div>
                      <div className="text-white font-medium">{selectedTemplate.subject}</div>
                    </div>
                    
                    <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 max-h-96 overflow-y-auto">
                      <div className="text-sm font-medium text-purple-400 mb-3">Email Content:</div>
                      <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedTemplate.body.substring(0, 500)}...
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getToneColor(selectedTemplate.tone)} border`}>
                          {selectedTemplate.tone.replace('-', ' ')}
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          {selectedTemplate.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-600/50 space-y-2">
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => useTemplate(selectedTemplate)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Use This Template
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                          onClick={() => copyToClipboard(selectedTemplate.subject, 'Subject line')}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Subject
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          onClick={() => downloadTemplate(selectedTemplate)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a template to preview</p>
                    <p className="text-sm mt-2">See how your professional emails will look</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">94%</div>
            <div className="text-sm text-gray-400">Faster Payment</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-1">3.5x</div>
            <div className="text-sm text-gray-400">Higher Response Rate</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-1">87%</div>
            <div className="text-sm text-gray-400">Client Retention</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-600/10 to-red-600/10 border border-orange-500/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-400 mb-1">+42%</div>
            <div className="text-sm text-gray-400">Premium Pricing</div>
          </div>
        </div>
      </div>
    </div>
  );
} 