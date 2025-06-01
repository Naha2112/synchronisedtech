"use client";

import { useState } from 'react';
import { Check, Send } from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { markInvoiceAsPaid, sendInvoiceReminder } from '@/app/autoflow/actions/invoices';
import { useRouter } from 'next/navigation';

interface InvoiceActionProps {
  invoiceId: number;
}

/**
 * Dropdown menu item to mark an invoice as paid
 */
export function MarkAsPaidMenuItem({ invoiceId }: InvoiceActionProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleMarkAsPaid = async () => {
    try {
      setIsProcessing(true);
      toast.loading('Updating invoice status...');

      const result = await markInvoiceAsPaid(invoiceId);
      
      if (result.success) {
        toast.dismiss();
        toast.success('Invoice marked as paid');
        // Refresh the page to update the UI
        router.refresh();
      } else {
        toast.dismiss();
        toast.error(result.message || 'Failed to update invoice status');
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      toast.dismiss();
      toast.error('An error occurred while updating the invoice');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DropdownMenuItem 
      disabled={isProcessing}
      onClick={(e) => {
        e.preventDefault();
        handleMarkAsPaid();
      }}
    >
      <Check className="mr-2 h-4 w-4" />
      Mark as paid
    </DropdownMenuItem>
  );
}

/**
 * Dropdown menu item to send a reminder email for an invoice
 */
export function SendReminderMenuItem({ invoiceId }: InvoiceActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const router = useRouter();

  const handleSendReminder = async () => {
    try {
      setIsProcessing(true);
      toast.loading('Sending reminder email...');

      const result = await sendInvoiceReminder(invoiceId, customMessage);
      
      if (result.success) {
        toast.dismiss();
        toast.success('Reminder email sent successfully');
        setIsOpen(false);
        setCustomMessage('');
        // Refresh the page to update the UI
        router.refresh();
      } else {
        toast.dismiss();
        toast.error(result.message || 'Failed to send reminder email');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.dismiss();
      toast.error('An error occurred while sending the reminder');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <DropdownMenuItem 
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <Send className="mr-2 h-4 w-4" />
        Send reminder
      </DropdownMenuItem>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <DialogDescription>
              Send a payment reminder email to the client for this invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-message">Additional Message (Optional)</Label>
              <Textarea
                id="custom-message"
                placeholder="Add a custom message to include in the reminder email"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSendReminder} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Sending...' : 'Send Reminder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 