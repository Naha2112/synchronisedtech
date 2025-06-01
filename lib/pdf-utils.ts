import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { type Invoice, type InvoiceItem } from '@/app/autoflow/actions/invoices';
import { formatCurrency as utilsFormatCurrency } from '@/lib/utils';

// Add type declarations for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Define a Color type for consistent use
type Color = [number, number, number];

// Extend the Invoice type to include client phone
interface ExtendedInvoice extends Invoice {
  client_phone?: string;
  client_email?: string;
  client_address?: string;
  currency?: string;
}

// Define the theme type for autoTable
type ThemeType = 'striped' | 'grid' | 'plain';

/**
 * Generate a PDF invoice using a modern professional design
 */
export function generateInvoicePdf(
  invoice: ExtendedInvoice, 
  currentUser: { name?: string, company?: string, email?: string, phone?: string, address?: string, currency?: string }
) {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    
    // Define colors
    const primaryColor: Color = [41, 98, 255];  // RGB for modern blue
    const secondaryColor: Color = [80, 80, 80]; // Dark gray
    const lightGray: Color = [240, 240, 240];   // Light gray for background elements
    
    // Determine the currency to use (GBP by default, can be overridden)
    const currency = invoice.currency || currentUser.currency || 'GBP';
    
    // Format currency for the PDF
    const formatCurrency = (amount: number): string => {
      return utilsFormatCurrency(amount, currency);
    };
    
    // Add top header background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add company logo/name section
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(currentUser.company || 'AutoFlow', margin, margin + 5);
    
    // Add "INVOICE" text on right side
    doc.setFontSize(30);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('INVOICE', pageWidth - margin, margin + 5, { align: 'right' });
    
    // Add invoice number under the INVOICE text
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`#${invoice.invoice_number}`, pageWidth - margin, margin + 15, { align: 'right' });
    
    // Set font for body text
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    
    // Add client and invoice info section
    const infoStartY = 50;
    
    // Left side - Client information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO', margin, infoStartY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(invoice.client_name || 'Client Name', margin, infoStartY + lineHeight);
    
    // Add client contact information if available
    let clientInfoY = infoStartY + lineHeight;
    if (invoice.client_address) {
      doc.text(invoice.client_address, margin, clientInfoY + lineHeight);
      clientInfoY += lineHeight;
    }
    if (invoice.client_phone) {
      doc.text(`Phone: ${invoice.client_phone}`, margin, clientInfoY + lineHeight);
      clientInfoY += lineHeight;
    }
    if (invoice.client_email) {
      doc.text(`Email: ${invoice.client_email}`, margin, clientInfoY + lineHeight);
    }
    
    // Right side - Invoice details in a clean box
    const detailsX = pageWidth / 2 + 10;
    const detailsY = infoStartY;
    const detailsWidth = pageWidth - detailsX - margin;
    const detailsHeight = 60;
    
    // Add detail box background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(detailsX, detailsY - 5, detailsWidth, detailsHeight, 3, 3, 'F');
    
    // Add invoice details
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Date:', detailsX + 5, detailsY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(format(new Date(invoice.issue_date), 'MMMM dd, yyyy'), detailsX + detailsWidth - 5, detailsY + 5, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.text('Due Date:', detailsX + 5, detailsY + 20);
    doc.setFont('helvetica', 'normal');
    doc.text(format(new Date(invoice.due_date), 'MMMM dd, yyyy'), detailsX + detailsWidth - 5, detailsY + 20, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Number:', detailsX + 5, detailsY + 35);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.invoice_number, detailsX + detailsWidth - 5, detailsY + 35, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', detailsX + 5, detailsY + 50);
    doc.setFont('helvetica', 'normal');
    
    // Set status color based on value
    const status = invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1);
    let statusColor: Color = secondaryColor;
    if (status === 'Paid') {
      statusColor = [39, 174, 96]; // Green
    } else if (status === 'Overdue') {
      statusColor = [231, 76, 60]; // Red
    } else if (status === 'Sent' || status === 'Viewed') {
      statusColor = [241, 196, 15]; // Yellow
    }
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(status, detailsX + detailsWidth - 5, detailsY + 50, { align: 'right' });
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    
    // Items table with improved styling
    const tableStartY = infoStartY + 75;
    
    // Define table styles
    autoTable(doc, {
      startY: tableStartY,
      head: [['Description', 'QTY', 'Rate', 'AMOUNT']],
      body: invoice.items?.map((item: InvoiceItem) => [
        item.description,
        item.quantity.toString(),
        formatCurrency(Number(item.rate)),
        formatCurrency(Number(item.amount))
      ]) || [],
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        lineWidth: 0,
        cellPadding: 8,
      },
      bodyStyles: {
        lineWidth: 0.1,
        lineColor: [220, 220, 220],
        cellPadding: 8,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
      margin: { left: margin, right: margin },
      theme: 'grid',
      tableLineColor: [220, 220, 220],
      tableLineWidth: 0.1,
    });
    
    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Add subtotal, tax and total with improved design
    const rightColumnX = pageWidth - margin - 100;
    const rightColumnWidth = 100;
    
    // Add summary box background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(rightColumnX, finalY, rightColumnWidth, lineHeight * 5 + 10, 3, 3, 'F');
    
    // Summary content
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', rightColumnX + 5, finalY + lineHeight);
    doc.text(formatCurrency(Number(invoice.subtotal)), rightColumnX + rightColumnWidth - 5, finalY + lineHeight, { align: 'right' });
    
    doc.text(`Tax (${invoice.tax_rate}%)`, rightColumnX + 5, finalY + lineHeight * 2);
    doc.text(formatCurrency(Number(invoice.tax_amount)), rightColumnX + rightColumnWidth - 5, finalY + lineHeight * 2, { align: 'right' });
    
    // Add separator line
    doc.setDrawColor(220, 220, 220);
    doc.line(rightColumnX + 5, finalY + lineHeight * 3, rightColumnX + rightColumnWidth - 5, finalY + lineHeight * 3);
    
    // Total with more emphasis
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('TOTAL:', rightColumnX + 5, finalY + lineHeight * 4);
    doc.text(formatCurrency(Number(invoice.total)), rightColumnX + rightColumnWidth - 5, finalY + lineHeight * 4, { align: 'right' });
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Add payment information section
    const paymentY = finalY + lineHeight * 7;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Information', margin, paymentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Please make payment via bank transfer or online payment using the details below:', margin, paymentY + lineHeight);
    doc.text('Payment Terms: Due within 30 days of invoice date', margin, paymentY + lineHeight * 2);
    
    // Add terms and conditions
    const termsY = paymentY + lineHeight * 4;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions', margin, termsY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoice.notes || 'Thank you for your business. We appreciate your prompt payment.', margin, termsY + lineHeight, { 
      maxWidth: pageWidth - (margin * 2)
    });
    
    // Add footer with company info
    const footerY = pageHeight - 25;
    
    // Add footer background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(0, footerY - 10, pageWidth, 35, 'F');
    
    // Footer content
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    
    // Left side - Company info
    const companyName = currentUser.company || currentUser.name || 'AutoFlow';
    const companyInfo = [
      companyName,
      currentUser.address || '',
      `Phone: ${currentUser.phone || ''}`,
      `Email: ${currentUser.email || ''}`,
    ].filter(Boolean).join(' | ');
    
    doc.text(companyInfo, pageWidth / 2, footerY, { align: 'center', maxWidth: pageWidth - (margin * 2) });
    
    // Page number
    doc.text(`Page 1 of 1`, pageWidth - margin, footerY + 10, { align: 'right' });
    
    return doc;
  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw error;
  }
}

export function downloadInvoicePdf(
  invoice: ExtendedInvoice, 
  currentUser: { name?: string, company?: string, email?: string, phone?: string, address?: string, currency?: string }
) {
  try {
    const doc = generateInvoicePdf(invoice, currentUser);
    doc.save(`Invoice-${invoice.invoice_number}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
} 