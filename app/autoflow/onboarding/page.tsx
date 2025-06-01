"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Building2, 
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
  CheckCircle,
  Users,
  FileText,
  Zap,
  Rocket
} from "lucide-react";

const industries = [
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    icon: Stethoscope,
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Medical practices, clinics, hospitals, therapy centers",
    features: ["HIPAA Compliance", "Appointment Booking", "Patient Records", "Insurance Claims"],
    examples: ["Family Practice", "Dental Clinic", "Physical Therapy", "Mental Health"]
  },
  {
    id: "plumbing",
    name: "Plumbing & HVAC",
    icon: Wrench,
    color: "from-orange-600 to-red-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    description: "Plumbers, HVAC technicians, maintenance services",
    features: ["Service Calls", "Equipment Tracking", "Emergency Scheduling", "Parts Inventory"],
    examples: ["Residential Plumbing", "Commercial HVAC", "Emergency Repairs", "Maintenance"]
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: Briefcase,
    color: "from-purple-600 to-indigo-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "Law firms, attorneys, legal consultants",
    features: ["Time Tracking", "Case Management", "Client Confidentiality", "Billing by Hour"],
    examples: ["Corporate Law", "Family Law", "Personal Injury", "Real Estate Law"]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car,
    color: "from-gray-600 to-slate-600",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/30",
    description: "Auto repair, car dealerships, mechanics",
    features: ["Vehicle Records", "Service History", "Parts Ordering", "Warranty Tracking"],
    examples: ["Auto Repair", "Oil Change", "Body Shop", "Car Dealership"]
  },
  {
    id: "beauty",
    name: "Beauty & Wellness",
    icon: Scissors,
    color: "from-pink-600 to-rose-600",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    description: "Salons, spas, beauty professionals",
    features: ["Appointment Booking", "Service Packages", "Client Preferences", "Loyalty Programs"],
    examples: ["Hair Salon", "Nail Spa", "Massage Therapy", "Beauty Studio"]
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    color: "from-green-600 to-emerald-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "Photographers, videographers, studios",
    features: ["Event Scheduling", "Package Pricing", "Gallery Management", "Client Proofing"],
    examples: ["Wedding Photography", "Portrait Studio", "Event Photography", "Commercial"]
  },
  {
    id: "education",
    name: "Education & Training",
    icon: GraduationCap,
    color: "from-yellow-600 to-amber-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    description: "Tutors, training centers, courses",
    features: ["Course Management", "Student Progress", "Certification", "Payment Plans"],
    examples: ["Private Tutoring", "Language School", "Music Lessons", "Skill Training"]
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: Home,
    color: "from-teal-600 to-cyan-600",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    description: "Realtors, property management, agents",
    features: ["Property Listings", "Commission Tracking", "Client Matching", "Contract Management"],
    examples: ["Residential Sales", "Property Management", "Commercial Real Estate", "Rentals"]
  },
  {
    id: "hospitality",
    name: "Hospitality & Food",
    icon: Utensils,
    color: "from-red-600 to-pink-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    description: "Restaurants, catering, food services",
    features: ["Menu Management", "Event Catering", "Dietary Tracking", "Seasonal Pricing"],
    examples: ["Restaurant", "Catering Service", "Food Truck", "Bakery"]
  },
  {
    id: "fitness",
    name: "Fitness & Sports",
    icon: Dumbbell,
    color: "from-indigo-600 to-purple-600",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    description: "Gyms, personal trainers, sports coaches",
    features: ["Class Scheduling", "Membership Management", "Progress Tracking", "Nutrition Plans"],
    examples: ["Personal Training", "Yoga Studio", "CrossFit Gym", "Sports Coaching"]
  }
];

const steps = [
  { id: 1, title: "Welcome", description: "Get started with AutoFlow" },
  { id: 2, title: "Industry", description: "Choose your business type" },
  { id: 3, title: "Business Info", description: "Tell us about your business" },
  { id: 4, title: "Setup Complete", description: "You're ready to go!" }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const router = useRouter();

  const selectedIndustryData = industries.find(i => i.id === selectedIndustry);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/autoflow/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold ${
                  currentStep >= step.id 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 text-white" 
                    : "border-gray-600 text-gray-400"
                }`}>
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-24 mx-4 rounded ${
                    currentStep > step.id ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-700"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-400">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-3xl mx-auto">
          {currentStep === 1 && (
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50 text-center">
              <CardContent className="p-12">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                    <Rocket className="w-10 h-10 text-blue-400" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent mb-4">
                    Welcome to AutoFlow!
                  </h1>
                  <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Let's set up your business automation platform in just a few simple steps. 
                    We'll customize everything to match your industry and needs.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-600/50">
                    <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Smart Invoicing</h3>
                    <p className="text-sm text-gray-400">Professional invoices tailored to your industry</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-600/50">
                    <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Automation</h3>
                    <p className="text-sm text-gray-400">Streamline your workflow with smart automation</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-700/30 border border-gray-600/50">
                    <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Client Management</h3>
                    <p className="text-sm text-gray-400">Keep track of all your clients and communications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-white text-2xl">
                  <Building2 className="w-6 h-6 text-blue-400" />
                  Choose Your Industry
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Select your industry to get customized templates and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {industries.map((industry) => (
                    <div
                      key={industry.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedIndustry === industry.id
                          ? `${industry.bgColor} ${industry.borderColor} shadow-lg shadow-blue-500/20`
                          : "border-gray-600/50 hover:border-gray-500/50 bg-gray-700/20"
                      }`}
                      onClick={() => setSelectedIndustry(industry.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-lg ${industry.bgColor} ${industry.borderColor} border`}>
                          <industry.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{industry.name}</h3>
                          <p className="text-xs text-gray-400 mb-3">{industry.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {industry.examples.slice(0, 2).map((example) => (
                              <Badge key={example} variant="secondary" className="text-xs bg-gray-600/50 text-gray-300">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-white text-2xl">
                  <FileText className="w-6 h-6 text-green-400" />
                  Business Information
                </CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Tell us a bit about your business to personalize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedIndustryData && (
                  <div className={`p-4 rounded-xl ${selectedIndustryData.bgColor} ${selectedIndustryData.borderColor} border`}>
                    <div className="flex items-center gap-3 mb-3">
                      <selectedIndustryData.icon className="w-6 h-6 text-white" />
                      <span className="font-semibold text-white">{selectedIndustryData.name}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {selectedIndustryData.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="business-name" className="text-gray-300 mb-2 block">
                      Business Name *
                    </Label>
                    <Input
                      id="business-name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Enter your business name"
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business-size" className="text-gray-300 mb-2 block">
                      Business Size
                    </Label>
                    <select
                      id="business-size"
                      value={businessSize}
                      onChange={(e) => setBusinessSize(e.target.value)}
                      className="w-full p-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                    >
                      <option value="">Select size</option>
                      <option value="solo">Just me (Solo)</option>
                      <option value="small">2-10 employees</option>
                      <option value="medium">11-50 employees</option>
                      <option value="large">50+ employees</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50 text-center">
              <CardContent className="p-12">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent mb-4">
                    You're All Set!
                  </h1>
                  <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Your AutoFlow account has been configured for <strong>{selectedIndustryData?.name}</strong>. 
                    You now have access to industry-specific templates and features.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Industry Templates</h3>
                    <p className="text-sm text-gray-400">Access specialized invoice and email templates</p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Smart Features</h3>
                    <p className="text-sm text-gray-400">Industry-specific automation and workflows</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-white mb-2">Ready to Use</h3>
                    <p className="text-sm text-gray-400">Start creating invoices and managing clients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center text-gray-400 text-sm">
            Step {currentStep} of {steps.length}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={currentStep === 2 && !selectedIndustry || currentStep === 3 && !businessName}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {currentStep === 4 ? "Go to Dashboard" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
} 