"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { 
  Settings, 
  Palette, 
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
  Users,
  FileText,
  Mail,
  Zap,
  Save,
  Upload,
  Eye,
  Sparkles,
  CheckCircle,
  User,
  Bell,
  Monitor
} from "lucide-react";

// Industry data
const industries = [
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    icon: Stethoscope,
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Medical practices, clinics, hospitals",
    features: ["HIPAA Compliance", "Appointment Booking", "Patient Records", "Insurance Claims"]
  },
  {
    id: "plumbing",
    name: "Plumbing & HVAC",
    icon: Wrench,
    color: "from-orange-600 to-red-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    description: "Plumbers, HVAC technicians, maintenance",
    features: ["Service Calls", "Equipment Tracking", "Emergency Scheduling", "Parts Inventory"]
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: Briefcase,
    color: "from-purple-600 to-indigo-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "Law firms, attorneys, legal consultants",
    features: ["Time Tracking", "Case Management", "Client Confidentiality", "Billing by Hour"]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car,
    color: "from-gray-600 to-slate-600",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/30",
    description: "Auto repair, car dealerships, mechanics",
    features: ["Vehicle Records", "Service History", "Parts Ordering", "Warranty Tracking"]
  },
  {
    id: "beauty",
    name: "Beauty & Wellness",
    icon: Scissors,
    color: "from-pink-600 to-rose-600",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    description: "Salons, spas, beauty professionals",
    features: ["Appointment Booking", "Service Packages", "Client Preferences", "Loyalty Programs"]
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    color: "from-green-600 to-emerald-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    description: "Photographers, videographers, studios",
    features: ["Event Scheduling", "Package Pricing", "Gallery Management", "Client Proofing"]
  },
  {
    id: "education",
    name: "Education & Training",
    icon: GraduationCap,
    color: "from-yellow-600 to-amber-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    description: "Tutors, training centers, courses",
    features: ["Course Management", "Student Progress", "Certification", "Payment Plans"]
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: Home,
    color: "from-teal-600 to-cyan-600",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    description: "Realtors, property management, agents",
    features: ["Property Listings", "Commission Tracking", "Client Matching", "Contract Management"]
  },
  {
    id: "hospitality",
    name: "Hospitality & Food",
    icon: Utensils,
    color: "from-red-600 to-pink-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    description: "Restaurants, catering, food services",
    features: ["Menu Management", "Event Catering", "Dietary Tracking", "Seasonal Pricing"]
  },
  {
    id: "fitness",
    name: "Fitness & Sports",
    icon: Dumbbell,
    color: "from-indigo-600 to-purple-600",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    description: "Gyms, personal trainers, sports coaches",
    features: ["Class Scheduling", "Membership Management", "Progress Tracking", "Nutrition Plans"]
  }
];

const colorSchemes = [
  { name: "Professional Blue", primary: "blue", gradient: "from-blue-600 to-blue-700" },
  { name: "Medical Green", primary: "emerald", gradient: "from-emerald-600 to-emerald-700" },
  { name: "Corporate Purple", primary: "purple", gradient: "from-purple-600 to-purple-700" },
  { name: "Energy Orange", primary: "orange", gradient: "from-orange-600 to-orange-700" },
  { name: "Tech Cyan", primary: "cyan", gradient: "from-cyan-600 to-cyan-700" },
  { name: "Creative Pink", primary: "pink", gradient: "from-pink-600 to-pink-700" },
  { name: "Premium Gold", primary: "yellow", gradient: "from-yellow-600 to-yellow-700" },
  { name: "Modern Slate", primary: "slate", gradient: "from-slate-600 to-slate-700" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const {
    colorScheme,
    setColorScheme,
    selectedIndustry,
    setSelectedIndustry,
    businessName,
    setBusinessName,
    businessDescription,
    setBusinessDescription,
    features,
    setFeatures,
    saveSettings
  } = useSettings();

  // Original settings state
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    timezone: 'UTC'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    invoice: true,
    client: true,
    workflow: false,
    browser: true
  });

  const [compactView, setCompactView] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [apiAccess, setApiAccess] = useState(false);
  const [dataExport, setDataExport] = useState(false);

  const [isLoading, setIsLoading] = useState({
    profile: false,
    notifications: false,
    appSettings: false
  });

  const selectedIndustryData = industries.find(i => i.id === selectedIndustry);

  const handleSaveSettings = () => {
    saveSettings();
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved and applied successfully.",
    });
  };

  const handleFeatureChange = (featureKey: string, value: boolean) => {
    setFeatures((prev: typeof features) => ({
      ...prev,
      [featureKey]: value
    }));
  };

  // Original settings handlers
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, profile: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, notifications: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save preferences. Please try again.",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, notifications: false }));
    }
  };

  const handleAppSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, appSettings: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your application settings have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, appSettings: false }));
    }
  };

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const toggleCompactView = () => setCompactView(!compactView);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleApiAccess = () => setApiAccess(!apiAccess);
  const toggleDataExport = () => setDataExport(!dataExport);

  useEffect(() => {
    const handleSettingsSaved = (event: any) => {
      console.log('Settings saved:', event.detail);
    };

    window.addEventListener('settings-saved', handleSettingsSaved);
    return () => window.removeEventListener('settings-saved', handleSettingsSaved);
  }, []);

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
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Manage your account, preferences, and business settings
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="bg-gray-800/50 border border-gray-700/50 p-1 grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-purple-600/30">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-purple-600/30">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="app-settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-purple-600/30">
              <Monitor className="w-4 h-4" />
              App Settings
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/30 data-[state=active]:to-purple-600/30">
              <Building2 className="w-4 h-4" />
              Business
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5 text-blue-400" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your account information and personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={(e) => setUser(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-gray-300">Company</Label>
                      <Input
                        id="company"
                        value={user.company}
                        onChange={(e) => setUser(prev => ({ ...prev, company: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role" className="text-gray-300">Role</Label>
                      <Input
                        id="role"
                        value={user.role}
                        onChange={(e) => setUser(prev => ({ ...prev, role: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Enter your role"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
                      <Select value={user.timezone} onValueChange={(value) => setUser(prev => ({ ...prev, timezone: value }))}>
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="UTC" className="text-white">UTC</SelectItem>
                          <SelectItem value="EST" className="text-white">Eastern (EST)</SelectItem>
                          <SelectItem value="PST" className="text-white">Pacific (PST)</SelectItem>
                          <SelectItem value="GMT" className="text-white">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isLoading.profile}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      {isLoading.profile ? "Saving..." : "Save Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="w-5 h-5 text-green-400" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white">Email Notifications</h3>
                    <Separator className="bg-gray-600/50" />
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                      <div>
                        <div className="font-medium text-white">Invoice Updates</div>
                        <div className="text-sm text-gray-400">Receive emails about invoice status changes</div>
                      </div>
                      <Switch 
                        checked={notifications.invoice}
                        onCheckedChange={() => toggleNotification('invoice')}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                      <div>
                        <div className="font-medium text-white">Client Activities</div>
                        <div className="text-sm text-gray-400">Get notified about new client interactions</div>
                      </div>
                      <Switch 
                        checked={notifications.client}
                        onCheckedChange={() => toggleNotification('client')}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                      <div>
                        <div className="font-medium text-white">Workflow Alerts</div>
                        <div className="text-sm text-gray-400">Receive alerts about automation workflow events</div>
                      </div>
                      <Switch 
                        checked={notifications.workflow}
                        onCheckedChange={() => toggleNotification('workflow')}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white">System Notifications</h3>
                    <Separator className="bg-gray-600/50" />
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                      <div>
                        <div className="font-medium text-white">Browser Notifications</div>
                        <div className="text-sm text-gray-400">Enable browser notifications for important events</div>
                      </div>
                      <Switch 
                        checked={notifications.browser}
                        onCheckedChange={() => toggleNotification('browser')}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isLoading.notifications}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      {isLoading.notifications ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* App Settings */}
          <TabsContent value="app-settings" className="space-y-6">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Monitor className="w-5 h-5 text-purple-400" />
                  Application Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize how AutoFlow works for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAppSettingsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white">Display</h3>
                    <Separator className="bg-gray-600/50" />
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                      <div>
                        <div className="font-medium text-white">Compact View</div>
                        <div className="text-sm text-gray-400">Display more information on screen with compact layouts</div>
                      </div>
                      <Switch 
                        checked={compactView}
                        onCheckedChange={toggleCompactView}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-white">Advanced</h3>
                    <Separator className="bg-gray-600/50" />
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                      <div>
                        <div className="font-medium text-white">API Access</div>
                        <div className="text-sm text-gray-400">Enable API access for third-party integrations</div>
                      </div>
                      <Switch 
                        checked={apiAccess}
                        onCheckedChange={toggleApiAccess}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                      <div>
                        <div className="font-medium text-white">Data Export</div>
                        <div className="text-sm text-gray-400">Enable regular data exports</div>
                      </div>
                      <Switch 
                        checked={dataExport}
                        onCheckedChange={toggleDataExport}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isLoading.appSettings}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    >
                      {isLoading.appSettings ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Settings */}
          <TabsContent value="business" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Industry & Business Info */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Building2 className="w-5 h-5 text-blue-400" />
                      Industry & Specialization
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Choose your industry to get customized features and templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {industries.map((industry) => (
                        <div
                          key={industry.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            selectedIndustry === industry.id
                              ? `${industry.bgColor} ${industry.borderColor} shadow-lg`
                              : "border-gray-600/50 hover:border-gray-500/50 bg-gray-700/20"
                          }`}
                          onClick={() => setSelectedIndustry(industry.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${industry.bgColor} ${industry.borderColor} border`}>
                              <industry.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-1">{industry.name}</h3>
                              <p className="text-xs text-gray-400 mb-2">{industry.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {industry.features.slice(0, 2).map((feature) => (
                                  <Badge key={feature} variant="secondary" className="text-xs bg-gray-600/50 text-gray-300">
                                    {feature}
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

                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <FileText className="w-5 h-5 text-green-400" />
                      Business Information
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Customize your business details and branding
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="business-name" className="text-gray-300">Business Name</Label>
                        <Input
                          id="business-name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="bg-gray-700/50 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry-select" className="text-gray-300">Industry Type</Label>
                        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {industries.map((industry) => (
                              <SelectItem key={industry.id} value={industry.id} className="text-white">
                                {industry.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="business-description" className="text-gray-300">Business Description</Label>
                      <Textarea
                        id="business-description"
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                        placeholder="Describe your business and services..."
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Business Logo</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Feature Configuration
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Enable features specific to your industry needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(features).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                          <div>
                            <Label className="text-white font-medium">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Label>
                            <p className="text-sm text-gray-400">
                              {key === 'appointmentBooking' && 'Allow clients to book appointments online'}
                              {key === 'inventoryTracking' && 'Track parts, supplies, and inventory'}
                              {key === 'timeTracking' && 'Track billable hours and time spent'}
                              {key === 'clientPortal' && 'Give clients access to their own portal'}
                              {key === 'mobileApp' && 'Enable mobile app functionality'}
                              {key === 'customFields' && 'Add custom fields to forms and records'}
                            </p>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => handleFeatureChange(key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Theme & Preview */}
              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Palette className="w-5 h-5 text-pink-400" />
                      Color Scheme
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Choose colors that match your brand
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {colorSchemes.map((scheme) => (
                        <div
                          key={scheme.primary}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            colorScheme === scheme.primary
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                          onClick={() => setColorScheme(scheme.primary)}
                        >
                          <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${scheme.gradient} mb-2`}></div>
                          <p className="text-xs text-white font-medium">{scheme.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedIndustryData && (
                  <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Eye className="w-5 h-5 text-cyan-400" />
                        Industry Features
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Features available for {selectedIndustryData.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedIndustryData.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/30">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedIndustryData.color}`}></div>
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Eye className="w-5 h-5 text-purple-400" />
                      Theme Preview
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      See how your color scheme looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div style={{ backgroundColor: `rgb(var(--color-primary))` }} className="h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                        Primary Color
                      </div>
                      <div style={{ backgroundColor: `rgb(var(--color-primary-dark))` }} className="h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                        Primary Dark
                      </div>
                      <div style={{ backgroundColor: `rgb(var(--color-accent))` }} className="h-8 rounded-lg flex items-center justify-center text-gray-900 text-sm font-medium">
                        Accent Color
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Button 
                    onClick={handleSaveSettings}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save All Settings
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 