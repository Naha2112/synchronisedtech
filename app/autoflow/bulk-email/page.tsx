'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, X, Save, Send, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parse } from 'csv-parse/sync';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  content: string;
};

export default function BulkEmailPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [template, setTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalEmails, setTotalEmails] = useState(0);
  const [sentEmails, setSentEmails] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('custom');
  const [sendDelay, setSendDelay] = useState(0); // Delay in ms between emails
  const [testMode, setTestMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [sendingResults, setSendingResults] = useState<{
    sentCount: number;
    total: number;
    testMode: boolean;
  } | null>(null);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/email-templates');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.templates) {
            setTemplates(data.templates);
          }
        }
      } catch (error) {
        console.error('Failed to fetch email templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      try {
        // Parse CSV for preview
        const text = await selectedFile.text();
        const records = parse(text, {
          columns: true,
          skip_empty_lines: true,
        });
        
        setCsvData(records.slice(0, 5)); // Preview first 5 rows
        setTotalEmails(records.length);
      } catch (error) {
        toast.error('Error parsing CSV file');
        console.error('CSV parse error:', error);
      }
    }
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplateId(value);
    
    if (value === "custom") {
      // For custom template, clear the content
      setSubject("");
      setTemplate("");
      return;
    }
    
    const selectedTemplate = templates.find(t => t.id.toString() === value);
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject);
      setTemplate(selectedTemplate.content);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !template || !subject) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setSentEmails(0);
    setErrors([]);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('template', template);
    formData.append('subject', subject);
    formData.append('delay', sendDelay.toString());
    formData.append('testMode', testMode.toString());

    try {
      const response = await fetch('/api/bulk-email/send', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send emails');
      }

      const data = await response.json();
      
      if (data.errors && data.errors.length > 0) {
        setErrors(data.errors);
        toast.warning(`Sent ${data.sentCount} emails with ${data.errors.length} errors`);
      } else {
        toast.success(`Successfully sent ${data.sentCount} emails`);
      }
      
      // Store results for confirmation dialog
      setSendingResults({
        sentCount: data.sentCount,
        total: data.total,
        testMode: data.testMode
      });
      setConfirmationOpen(true);
      
      if (!testMode) {
        setFile(null);
        setCsvData([]);
        if (selectedTemplateId === "custom") {
          setTemplate('');
          setSubject('');
        }
      }
    } catch (error) {
      toast.error('Failed to send emails');
      setErrors(['Failed to send emails: Server error']);
    } finally {
      setIsLoading(false);
    }
  };

  // For real-time progress updates
  useEffect(() => {
    if (isLoading && totalEmails > 0) {
      const progressInterval = setInterval(() => {
        fetch('/api/bulk-email/status')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setSentEmails(data.sent || 0);
              setProgress(Math.round((data.sent / totalEmails) * 100));
              
              if (data.completed) {
                clearInterval(progressInterval);
              }
            }
          })
          .catch(err => console.error('Error fetching status:', err));
      }, 1000);
      
      return () => clearInterval(progressInterval);
    }
  }, [isLoading, totalEmails]);

  const handleSaveTemplate = async () => {
    if (!templateName || !subject || !template) {
      toast.error('Template name, subject, and content are required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/email-templates/save-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateName,
          subject,
          content: template,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      const data = await response.json();
      if (data.success) {
        toast.success('Template saved successfully');
        setSaveTemplateOpen(false);
        setTemplateName('');
        
        // Refresh templates list
        const newTemplate = {
          id: data.templateId,
          name: templateName,
          subject,
          content: template,
        };
        setTemplates([...templates, newTemplate]);
        setSelectedTemplateId(data.templateId.toString());
      } else {
        toast.error(data.message || 'Failed to save template');
      }
    } catch (error) {
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulk Email Sender</CardTitle>
          <CardDescription>
            Upload a spreadsheet with contact information and customize your email template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose">
            <TabsList className="mb-4">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="preview" disabled={csvData.length === 0}>Data Preview</TabsTrigger>
              {errors.length > 0 && <TabsTrigger value="errors">Errors ({errors.length})</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="compose">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Spreadsheet (CSV)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    CSV should have columns: email, name, phone (optional)
                  </p>
                  {csvData.length > 0 && (
                    <p className="text-sm text-green-600">
                      ✓ Parsed {totalEmails} recipients from CSV
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-select">Email Template</Label>
                  <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template or create custom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom template</SelectItem>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Email Content</Label>
                  <Textarea
                    id="template"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    placeholder="Enter your email template. Use {name} for personalization"
                    className="min-h-[200px]"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Use {"{name}"} to personalize the email with the recipient's name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Sending Options</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="testMode" className="text-sm">Test Mode</Label>
                      <p className="text-xs text-gray-500">
                        Only send to first 3 recipients for testing
                      </p>
                    </div>
                    <Switch 
                      id="testMode" 
                      checked={testMode}
                      onCheckedChange={setTestMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delay">Delay Between Emails ({sendDelay}ms)</Label>
                  <Slider 
                    id="delay"
                    defaultValue={[0]} 
                    max={1000} 
                    step={100}
                    onValueChange={(value) => setSendDelay(value[0])}
                  />
                  <p className="text-xs text-gray-500">
                    Adding a delay can help prevent rate limiting by email providers
                  </p>
                </div>

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sending progress...</span>
                      <span>{sentEmails} of {totalEmails}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : testMode ? 'Send Test Emails' : 'Send All Emails'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isLoading || !(template && subject)}
                    onClick={() => setSaveTemplateOpen(true)}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save as Template
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="preview">
              {csvData.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Preview of first {csvData.length} rows (of {totalEmails} total):
                  </h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(csvData[0]).map(header => (
                            <TableHead key={header}>{header}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.map((row, i) => (
                          <TableRow key={i}>
                            {Object.values(row).map((value, j) => (
                              <TableCell key={j}>{value as string}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <p>No CSV data to preview</p>
              )}
            </TabsContent>
            
            <TabsContent value="errors">
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">
                  Errors ({errors.length}):
                </h3>
                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                  <ul className="space-y-1">
                    {errors.map((error, i) => (
                      <li key={i} className="text-sm text-red-600 flex">
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-xs text-gray-500">
            Ensure your CSV has valid email addresses. The system will handle any bounced emails and track open rates if configured.
          </div>
        </CardFooter>
      </Card>

      {/* Dialog for saving template */}
      <Dialog open={saveTemplateOpen} onOpenChange={setSaveTemplateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save this email as a reusable template
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter a name for this template"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSaveTemplateOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSaveTemplate} 
              disabled={isSaving || !templateName}
            >
              {isSaving ? "Saving..." : "Save Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Email Sending Complete</DialogTitle>
            <DialogDescription>
              Your emails have been processed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {sendingResults && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  {errors.length === 0 ? (
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                  )}
                </div>
                
                <div className="text-center space-y-2">
                  <p className="font-medium">
                    {sendingResults.sentCount} of {sendingResults.total} emails sent successfully
                  </p>
                  
                  {errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {errors.length} emails failed to send
                    </p>
                  )}
                  
                  {sendingResults.testMode && (
                    <p className="text-xs text-gray-500 mt-2">
                      Test mode was enabled. Only the first 3 recipients were processed.
                    </p>
                  )}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-2">What would you like to do next?</h4>
                  <div className="flex flex-col space-y-2">
                    {sendingResults.testMode && (
                      <Button 
                        type="button" 
                        onClick={() => {
                          setTestMode(false);
                          setConfirmationOpen(false);
                        }}
                        className="w-full"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send to All Recipients
                      </Button>
                    )}
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setConfirmationOpen(false);
                        // Reset form if needed
                        if (!testMode) {
                          setFile(null);
                          setCsvData([]);
                          if (selectedTemplateId === "custom") {
                            setTemplate('');
                            setSubject('');
                          }
                        }
                      }}
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 