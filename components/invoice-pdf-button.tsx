"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from "sonner";
import { downloadInvoicePdf } from '@/lib/pdf-utils';
import { Invoice } from '@/app/autoflow/actions/invoices';
import { useCurrency } from '@/components/currency-provider';

interface UserProfile {
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  currency?: string;
}

// Extended invoice type to include client_phone for the PDF
interface ExtendedInvoice extends Invoice {
  client_phone?: string;
  currency?: string;
}

interface InvoicePdfButtonProps {
  invoice: Invoice;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  className?: string;
}

export function InvoicePdfButton({ invoice, variant = "default", className }: InvoicePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currency } = useCurrency(); // Get current currency setting
  
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (data.success && data.profile) {
          setUserProfile({
            name: data.profile.name || data.profile.company || "Your Company",
            email: data.profile.email || "hello@reallygreatsite.com",
            company: data.profile.company || "Your Company",
            phone: data.profile.phone || "123-456-7890",
            address: data.profile.address || "123 Anywhere St., Any City",
            currency: data.profile.currency || currency || "GBP"
          });
        } else {
          // Fallback to defaults if API fails
          setUserProfile({
            name: "Your Company",
            email: "hello@reallygreatsite.com",
            company: "Your Company",
            phone: "123-456-7890",
            address: "123 Anywhere St., Any City",
            currency: currency || "GBP"
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fallback to defaults if API fails
        setUserProfile({
          name: "Your Company",
          email: "hello@reallygreatsite.com",
          company: "Your Company",
          phone: "123-456-7890",
          address: "123 Anywhere St., Any City",
          currency: currency || "GBP"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [currency]);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      toast.loading("Generating PDF...");
      
      // Use the profile data or fallback to defaults
      const currentUser = userProfile || {
        name: "Your Company",
        email: "hello@reallygreatsite.com",
        company: "Your Company",
        phone: "123-456-7890",
        address: "123 Anywhere St., Any City",
        currency: currency || "GBP"
      };
      
      // Create an extended invoice with client_phone and currency
      const extendedInvoice: ExtendedInvoice = {
        ...invoice,
        client_phone: "", // Default empty string for client_phone
        currency: currency || "GBP" // Set the currency for formatting
      };
      
      // Try to download the PDF with error handling
      setTimeout(() => {
        try {
          // Download the PDF
          const success = downloadInvoicePdf(extendedInvoice, currentUser);
          
          if (success) {
            toast.dismiss();
            toast.success("Invoice PDF downloaded successfully");
          } else {
            toast.dismiss();
            toast.error("Failed to generate PDF - Please try again");
          }
        } catch (error) {
          console.error("Error in PDF generation:", error);
          toast.dismiss();
          toast.error("PDF generation failed");
        } finally {
          setIsGenerating(false);
        }
      }, 200); // Small delay to ensure UI responsiveness
      
    } catch (error) {
      console.error("Error starting PDF generation:", error);
      toast.dismiss();
      toast.error("Failed to start PDF generation");
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      className={className}
      onClick={handleDownload}
      disabled={isGenerating || isLoading}
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  );
} 