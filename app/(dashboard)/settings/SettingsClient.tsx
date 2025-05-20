"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useSettingsStore } from "@/lib/settings-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsClient({ userData }: { userData: any }) {
  const [user, setUser] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    company: userData?.company || "",
    phone: userData?.phone || "",
  })

  const [isLoading, setIsLoading] = useState({
    profile: false,
    password: false,
    notifications: false,
    appSettings: false,
  })

  // Get settings from store
  const {
    defaultCurrency,
    defaultPaymentTerms,
    compactView,
    apiAccess,
    dataExport,
    notifications,
    updateCurrency,
    updatePaymentTerms,
    toggleCompactView,
    toggleApiAccess,
    toggleDataExport,
    toggleNotification,
  } = useSettingsStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setUser(prev => ({ ...prev, [id]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(prev => ({ ...prev, profile: true }))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    })
    
    setIsLoading(prev => ({ ...prev, profile: false }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(prev => ({ ...prev, password: true }))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully."
    })
    
    setIsLoading(prev => ({ ...prev, password: false }))
    
    // Reset password fields
    const form = e.target as HTMLFormElement
    form.reset()
  }

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(prev => ({ ...prev, notifications: true }))
    
    // No need for API call, the store is already updated
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated."
    })
    
    setIsLoading(prev => ({ ...prev, notifications: false }))
  }

  const handleAppSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(prev => ({ ...prev, appSettings: true }))
    
    // No need for API call, the store is already updated
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast({
      title: "App settings saved",
      description: "Your application settings have been updated."
    })
    
    setIsLoading(prev => ({ ...prev, appSettings: false }))
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="app-settings">App Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleProfileSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={user.name} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user.email} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      value={user.company} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={user.phone} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isLoading.profile}>
                    {isLoading.profile ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordSubmit}>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isLoading.password}>
                    {isLoading.password ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleNotificationsSubmit}>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Invoice Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive updates about invoice status changes</div>
                    </div>
                    <Switch 
                      id="invoice-notifications" 
                      checked={notifications.invoice}
                      onCheckedChange={() => toggleNotification('invoice')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Payment Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive updates when payments are received</div>
                    </div>
                    <Switch 
                      id="payment-notifications" 
                      checked={notifications.payment}
                      onCheckedChange={() => toggleNotification('payment')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Workflow Alerts</div>
                      <div className="text-sm text-muted-foreground">Receive alerts about automation workflow events</div>
                    </div>
                    <Switch 
                      id="workflow-notifications" 
                      checked={notifications.workflow}
                      onCheckedChange={() => toggleNotification('workflow')}
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">System Notifications</h3>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Browser Notifications</div>
                      <div className="text-sm text-muted-foreground">Enable browser notifications for important events</div>
                    </div>
                    <Switch 
                      id="browser-notifications" 
                      checked={notifications.browser}
                      onCheckedChange={() => toggleNotification('browser')}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isLoading.notifications}>
                    {isLoading.notifications ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="app-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Customize how AutoFlow works for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleAppSettingsSubmit}>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Display</h3>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Compact View</div>
                      <div className="text-sm text-muted-foreground">Display more information on screen with compact layouts</div>
                    </div>
                    <Switch 
                      id="compact-view" 
                      checked={compactView}
                      onCheckedChange={toggleCompactView}
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Default Settings</h3>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="default-currency">Default Currency</Label>
                      <Select 
                        defaultValue={defaultCurrency} 
                        onValueChange={updateCurrency}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar (C$)</SelectItem>
                          <SelectItem value="AUD">AUD - Australian Dollar (A$)</SelectItem>
                          <SelectItem value="JPY">JPY - Japanese Yen (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="default-payment-terms">Default Payment Terms (days)</Label>
                      <Select 
                        defaultValue={defaultPaymentTerms.toString()} 
                        onValueChange={(value) => updatePaymentTerms(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="45">45 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Advanced</h3>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">API Access</div>
                      <div className="text-sm text-muted-foreground">Enable API access for third-party integrations</div>
                    </div>
                    <Switch 
                      id="api-access" 
                      checked={apiAccess}
                      onCheckedChange={toggleApiAccess}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Data Export</div>
                      <div className="text-sm text-muted-foreground">Enable regular data exports</div>
                    </div>
                    <Switch 
                      id="data-export" 
                      checked={dataExport}
                      onCheckedChange={toggleDataExport}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isLoading.appSettings}>
                    {isLoading.appSettings ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 