"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { 
  FileText, 
  Mail, 
  Eye, 
  Download, 
  Copy, 
  Edit,
  Sparkles,
  Stethoscope,
  Wrench,
  Briefcase,
  Car,
  Scissors,
  Camera,
  GraduationCap,
  Home,
  Utensils,
  Dumbbell,
  Star,
  Clock,
  CheckCircle,
  X,
  Crown
} from "lucide-react";

const industryTemplates = {
  healthcare: {
    name: "Healthcare & Medical",
    icon: Stethoscope,
    color: "from-blue-600 to-cyan-600",
    invoiceTemplates: [
      {
        id: "medical-consultation",
        name: "Medical Consultation Invoice",
        description: "Professional invoice for medical consultations and appointments",
        features: ["HIPAA Compliant", "Insurance Details", "Diagnosis Codes", "Treatment Notes"],
        popular: true
      },
      {
        id: "dental-services",
        name: "Dental Services Invoice",
        description: "Specialized template for dental procedures and treatments",
        features: ["Procedure Codes", "Insurance Claims", "Payment Plans", "X-ray Records"]
      },
      {
        id: "therapy-session",
        name: "Therapy Session Invoice",
        description: "Template for therapy and counseling sessions",
        features: ["Session Notes", "Treatment Plans", "Progress Tracking", "Confidentiality"]
      }
    ],
    emailTemplates: [
      {
        id: "appointment-reminder",
        name: "Appointment Reminder",
        description: "Automated reminder for upcoming medical appointments",
        features: ["Patient Info", "Appointment Details", "Preparation Instructions", "Contact Info"]
      },
      {
        id: "test-results",
        name: "Test Results Notification",
        description: "Secure notification for test results availability",
        features: ["Secure Portal Link", "Result Summary", "Next Steps", "Doctor Contact"]
      }
    ]
  },
  plumbing: {
    name: "Plumbing & HVAC",
    icon: Wrench,
    color: "from-orange-600 to-red-600",
    invoiceTemplates: [
      {
        id: "emergency-service",
        name: "Emergency Service Call",
        description: "Invoice template for emergency plumbing services",
        features: ["Emergency Rates", "Service Times", "Parts Used", "Warranty Info"],
        popular: true
      },
      {
        id: "installation-project",
        name: "Installation Project",
        description: "Comprehensive invoice for installation projects",
        features: ["Material Costs", "Labor Hours", "Permits", "Project Timeline"]
      },
      {
        id: "maintenance-contract",
        name: "Maintenance Contract",
        description: "Recurring maintenance service invoice",
        features: ["Monthly/Yearly Plans", "Service Checklist", "Next Service Date", "Discounts"]
      }
    ],
    emailTemplates: [
      {
        id: "service-confirmation",
        name: "Service Confirmation",
        description: "Confirmation email for scheduled service appointments",
        features: ["Service Time", "Technician Info", "Preparation Steps", "Pricing Estimate"]
      },
      {
        id: "job-completion",
        name: "Job Completion Summary",
        description: "Summary email after service completion",
        features: ["Work Performed", "Parts Used", "Warranty Details", "Maintenance Tips"]
      }
    ]
  },
  legal: {
    name: "Legal Services",
    icon: Briefcase,
    color: "from-purple-600 to-indigo-600",
    invoiceTemplates: [
      {
        id: "hourly-billing",
        name: "Hourly Billing Statement",
        description: "Detailed hourly billing for legal services",
        features: ["Time Tracking", "Billable Hours", "Case References", "Client Confidentiality"],
        popular: true
      },
      {
        id: "retainer-invoice",
        name: "Retainer Invoice",
        description: "Invoice for retainer fees and advance payments",
        features: ["Retainer Terms", "Trust Account", "Service Scope", "Payment Schedule"]
      },
      {
        id: "court-representation",
        name: "Court Representation",
        description: "Invoice for court appearances and representation",
        features: ["Court Dates", "Case Numbers", "Representation Type", "Travel Expenses"]
      }
    ],
    emailTemplates: [
      {
        id: "case-update",
        name: "Case Status Update",
        description: "Professional case status update for clients",
        features: ["Case Progress", "Next Steps", "Required Actions", "Confidential Handling"]
      },
      {
        id: "document-request",
        name: "Document Request",
        description: "Request for additional documents or information",
        features: ["Document List", "Deadline", "Submission Method", "Confidentiality Notice"]
      }
    ]
  },
  beauty: {
    name: "Beauty & Wellness",
    icon: Scissors,
    color: "from-pink-600 to-rose-600",
    invoiceTemplates: [
      {
        id: "salon-services",
        name: "Salon Services Invoice",
        description: "Beautiful invoice for salon and spa services",
        features: ["Service Packages", "Stylist Details", "Product Sales", "Loyalty Points"],
        popular: true
      },
      {
        id: "wedding-package",
        name: "Wedding Package",
        description: "Special pricing for wedding beauty services",
        features: ["Bridal Package", "Trial Sessions", "Travel Fees", "Group Discounts"]
      }
    ],
    emailTemplates: [
      {
        id: "appointment-booking",
        name: "Appointment Booking",
        description: "Confirmation for beauty appointment bookings",
        features: ["Service Details", "Stylist Info", "Preparation Tips", "Cancellation Policy"]
      },
      {
        id: "aftercare-tips",
        name: "Aftercare Tips",
        description: "Post-service care instructions and tips",
        features: ["Care Instructions", "Product Recommendations", "Follow-up Booking", "Special Offers"]
      }
    ]
  }
};

export default function TemplatesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState("healthcare");
  const [activeTab, setActiveTab] = useState("invoices");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [previewType, setPreviewType] = useState<'invoice' | 'email'>('invoice');

  const currentIndustry = industryTemplates[selectedIndustry as keyof typeof industryTemplates];

  const openPreview = (template: any, type: 'invoice' | 'email') => {
    setPreviewTemplate(template);
    setPreviewType(type);
    setPreviewOpen(true);
  };

  const InvoicePreview = ({ template }: { template: any }) => (
    <div className="bg-white text-black p-8 rounded-lg max-w-2xl mx-auto">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-600">Invoice #INV-2024-001</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">$1,250.00</div>
            <p className="text-gray-600">Due: Jan 30, 2024</p>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
          <div className="text-gray-700">
            <p className="font-medium">Your Business Name</p>
            <p>123 Business Street</p>
            <p>City, State 12345</p>
            <p>phone@business.com</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">To:</h3>
          <div className="text-gray-700">
            <p className="font-medium">Client Name</p>
            <p>456 Client Avenue</p>
            <p>City, State 67890</p>
            <p>client@email.com</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Services:</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Description</th>
                <th className="px-4 py-3 text-right font-medium text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-3 text-gray-700">{template.name}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">$1,250.00</td>
              </tr>
            </tbody>
          </table>
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-blue-600">$1,250.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Industry Features:</h4>
        <ul className="space-y-1">
          {template.features.map((feature: string) => (
            <li key={feature} className="text-blue-800 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const EmailPreview = ({ template }: { template: any }) => (
    <div className="bg-white text-black rounded-lg max-w-2xl mx-auto">
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">From:</span>
            <span className="text-gray-600">your-business@email.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">To:</span>
            <span className="text-gray-600">client@email.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">Subject:</span>
            <span className="text-gray-900 font-medium">{template.name}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{template.name}</h2>
          <p className="text-gray-700 mb-4">Dear [Client Name],</p>
          <p className="text-gray-700 mb-4">{template.description}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-blue-900 mb-3">This email includes:</h4>
          <ul className="space-y-2">
            {template.features.map((feature: string) => (
              <li key={feature} className="text-blue-800 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-gray-700">
          <p className="mb-4">Best regards,</p>
          <p className="font-medium">Your Business Name</p>
          <p className="text-sm text-gray-600">123 Business Street, City, State 12345</p>
          <p className="text-sm text-gray-600">phone@business.com</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950/30 via-gray-950/30 to-slate-900/30 text-white p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Industry Templates
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Professional templates included with your plan
              </p>
            </div>
          </div>
        </div>

        {/* Industry Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {Object.entries(industryTemplates).map(([key, industry]) => (
              <button
                key={key}
                onClick={() => setSelectedIndustry(key)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedIndustry === key
                    ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500/50 shadow-lg shadow-purple-500/20"
                    : "border-gray-600/50 hover:border-gray-500/50 bg-gray-700/20"
                }`}
              >
                <industry.icon className="w-5 h-5 text-white" />
                <span className="font-medium text-white">{industry.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-gray-800/50 border border-gray-700/50 p-1">
            <TabsTrigger value="invoices" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-purple-600/30">
              <FileText className="w-4 h-4" />
              Invoice Templates
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-purple-600/30">
              <Mail className="w-4 h-4" />
              Email Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentIndustry.invoiceTemplates.map((template) => (
                <Card key={template.id} className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  {template.popular && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${currentIndustry.color} bg-opacity-20 border border-purple-500/30`}>
                        <currentIndustry.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-green-400 font-medium">
                          <Crown className="w-4 h-4" />
                          <span className="text-sm">Included</span>
                        </div>
                        <div className="text-xs text-gray-400">in your plan</div>
                      </div>
                    </div>
                    <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {template.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => openPreview(template, 'invoice')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="emails" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {currentIndustry.emailTemplates.map((template) => (
                <Card key={template.id} className="group bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-500/30">
                        <Mail className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white group-hover:text-blue-300 transition-colors">
                            {template.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
                            <Crown className="w-4 h-4" />
                            <span>Included</span>
                          </div>
                        </div>
                        <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {template.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        onClick={() => openPreview(template, 'email')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Customize
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 border-purple-500/30 backdrop-blur-xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Need a Custom Template?</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Can't find the perfect template for your business? Our team can create custom templates 
                tailored specifically to your industry and workflow needs.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Request Custom Template
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl">
                {previewType === 'invoice' ? 'Invoice Preview' : 'Email Preview'}: {previewTemplate?.name}
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          
          <div className="mt-4">
            {previewTemplate && previewType === 'invoice' && <InvoicePreview template={previewTemplate} />}
            {previewTemplate && previewType === 'email' && <EmailPreview template={previewTemplate} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 