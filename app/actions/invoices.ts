import prisma from '@/lib/prisma';

export async function markInvoiceAsPaid(invoiceId: number) {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'paid' },
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    return { success: false, message: 'Failed to mark invoice as paid.' };
  }
}

export async function sendInvoiceReminder(invoiceId: number, customMessage?: string) {
  try {
    // Simulate sending an email (replace with real email logic as needed)
    console.log(`Sending reminder for invoice #${invoiceId}. Message: ${customMessage || ''}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending invoice reminder:', error);
    return { success: false, message: 'Failed to send invoice reminder.' };
  }
} 