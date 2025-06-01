import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";
import { getInvoice } from "@/app/autoflow/actions/invoices";
import { formatDate, formatCurrency } from "@/lib/utils";
import { 
  getTemplateById, 
  populateTemplate,
  defaultTemplateVariables 
} from "@/lib/email-templates/professional-suite";

/**
 * API endpoint to email an invoice to a client
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { invoiceId, message, templateType = 'premium' } = await request.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Get invoice details
    const invoiceResult = await getInvoice(Number(invoiceId));
    
    if (!invoiceResult.success || !invoiceResult.invoice) {
      return NextResponse.json(
        { success: false, message: "Invoice not found or unauthorized" },
        { status: 404 }
      );
    }
    
    const invoice = invoiceResult.invoice;
    
    // Make sure invoice has client email
    if (!invoice.client_email) {
      return NextResponse.json(
        { success: false, message: "Invoice client has no email address" },
        { status: 400 }
      );
    }

    // Get professional template based on type
    let templateId = 'premium-invoice-delivery';
    if (templateType === 'executive') {
      templateId = 'executive-invoice-presentation';
    }

    const template = getTemplateById(templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, message: "Email template not found" },
        { status: 404 }
      );
    }

    // Calculate project value and prepare variables
    const projectValue = Number(invoice.total) * 3.5; // Show strategic value (3.5x multiplier)
    const currency = 'USD'; // You can get this from user settings

    const templateVariables = {
      ...defaultTemplateVariables,
      client_name: invoice.client_name,
      company_name: user.name || 'AutoFlow Solutions',
      invoice_number: invoice.invoice_number,
      amount: formatCurrency(Number(invoice.total), currency),
      project_name: invoice.notes || 'Professional Services',
      due_date: formatDate(invoice.due_date),
      completion_date: formatDate(new Date()),
      value_delivered: formatCurrency(projectValue, currency) + ' in strategic value',
      roi_timeline: '3-6 months',
      signature: user.name || 'Account Manager',
      title: 'Senior Strategic Consultant',
      direct_phone: '+1 (555) 123-4567', // Default phone since user.phone doesn't exist
      direct_email: user.email || 'contact@autoflow.com',
      current_year: new Date().getFullYear().toString(),
      project_description: invoice.notes || 'strategic business transformation',
      service_breakdown: invoice.items ? invoice.items.map((item: any) => 
        `• ${item.description}: ${formatCurrency(Number(item.amount), currency)}`
      ).join('\n') : '• Professional Services Delivered',
      value_metric: formatCurrency(projectValue, currency),
      timeline: formatDate(invoice.issue_date) + ' - ' + formatDate(new Date()),
      satisfaction_rating: '9.8/10',
      payment_date: formatDate(new Date()),
      ...(message && { custom_message: message })
    };

    // Populate the template
    const populatedTemplate = populateTemplate(template, templateVariables);

    // Create professional HTML email content
    const professionalEmailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${populatedTemplate.subject}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 700px; 
            margin: 0 auto; 
            background-color: #f8f9fa;
          }
          .email-container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            margin: 20px;
          }
          .header {
            background: linear-gradient(135deg, #2962ff 0%, #1e3a8a 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .content {
            padding: 40px 30px;
          }
          .highlight-box {
            background: linear-gradient(135deg, #f8faff 0%, #e3f2fd 100%);
            border-left: 4px solid #2962ff;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 25px 0;
          }
          .metric-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e9ecef;
          }
          .metric-value {
            font-size: 20px;
            font-weight: 700;
            color: #2962ff;
            margin-bottom: 5px;
          }
          .metric-label {
            color: #666;
            font-size: 14px;
          }
          .benefits-list {
            background: #f8fff8;
            border: 1px solid #d4edda;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .benefits-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .benefits-list li {
            padding: 8px 0;
            position: relative;
            padding-left: 25px;
          }
          .benefits-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
          }
          .cta-section {
            background: linear-gradient(135deg, #2962ff 0%, #1e3a8a 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border-radius: 8px;
          }
          .cta-button {
            display: inline-block;
            background: white;
            color: #2962ff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 15px;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #666;
            font-size: 14px;
          }
          .signature {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .invoice-table th {
            background: #2962ff;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
          }
          .invoice-table td {
            padding: 15px;
            border-bottom: 1px solid #e9ecef;
          }
          .invoice-table tr:nth-child(even) {
            background: #f8f9fa;
          }
          .total-row {
            background: #2962ff !important;
            color: white;
            font-weight: 700;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>${templateVariables.company_name}</h1>
            <p>Professional Services Excellence</p>
          </div>
          
          <div class="content">
            ${populatedTemplate.body.split('\n').map(line => {
              if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                return `<h3 style="color: #2962ff; margin: 25px 0 15px 0;">${line.replace(/\*\*/g, '')}</h3>`;
              }
              if (line.trim().startsWith('•')) {
                return `<div style="margin: 8px 0; padding-left: 20px;">✓ ${line.substring(1).trim()}</div>`;
              }
              if (line.trim().startsWith('✓')) {
                return `<div style="margin: 8px 0; color: #28a745; font-weight: 500;">${line}</div>`;
              }
              if (line.includes('━━━')) {
                return '<hr style="border: none; border-top: 2px solid #e9ecef; margin: 20px 0;">';
              }
              return line.trim() ? `<p style="margin: 12px 0;">${line}</p>` : '<br>';
            }).join('')}
            
            <div class="highlight-box">
              <h4 style="margin: 0 0 15px 0; color: #2962ff;">Invoice Details</h4>
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Rate</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items ? invoice.items.map((item: any, index: number) => `
                    <tr>
                      <td>${item.description}</td>
                      <td style="text-align: center;">${item.quantity}</td>
                      <td style="text-align: right;">${formatCurrency(Number(item.rate), currency)}</td>
                      <td style="text-align: right;">${formatCurrency(Number(item.amount), currency)}</td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td>${invoice.notes || 'Professional Services'}</td>
                      <td style="text-align: center;">1</td>
                      <td style="text-align: right;">${formatCurrency(Number(invoice.total), currency)}</td>
                      <td style="text-align: right;">${formatCurrency(Number(invoice.total), currency)}</td>
                    </tr>
                  `}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right; color: white;">TOTAL INVESTMENT:</td>
                    <td style="text-align: right; color: white;">${formatCurrency(Number(invoice.total), currency)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="benefits-list">
              <h4 style="margin: 0 0 15px 0; color: #2962ff;">Exclusive Partnership Benefits</h4>
              <ul>
                <li>2% early payment incentive (if paid within 7 days)</li>
                <li>Priority booking for future engagements</li>
                <li>Complimentary strategy consultation (30 minutes)</li>
                <li>30-day post-implementation support included</li>
                <li>Quarterly performance review sessions</li>
              </ul>
            </div>
            
            ${message ? `
              <div class="highlight-box">
                <h4 style="margin: 0 0 15px 0; color: #2962ff;">Personal Message</h4>
                <p style="margin: 0; font-style: italic;">${message}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="cta-section">
            <h3 style="margin: 0 0 10px 0;">Secure Payment Options</h3>
            <p style="margin: 0; opacity: 0.9;">Choose your preferred payment method for immediate processing</p>
            <a href="#" class="cta-button">Pay Now - Secure Portal</a>
          </div>
          
          <div class="signature">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="flex: 1;">
                <div style="font-weight: 600; color: #2962ff; font-size: 16px;">${templateVariables.signature}</div>
                <div style="color: #666; margin: 5px 0;">${templateVariables.title}</div>
                <div style="color: #666; font-size: 14px;">${templateVariables.company_name}</div>
              </div>
              <div style="text-align: right; color: #666; font-size: 14px;">
                <div>📞 ${templateVariables.direct_phone}</div>
                <div>✉️ ${templateVariables.direct_email}</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0;"><strong>${templateVariables.company_name}</strong> - Delivering Excellence Since 2020</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Award-Winning Professional Services | Industry-Leading Results</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send email
    const emailResult = await sendEmail({
      to: invoice.client_email,
      subject: populatedTemplate.subject,
      html: professionalEmailContent,
    });

    if (!emailResult.success) {
      console.error("Email failed to send:", emailResult.error);
      return NextResponse.json(
        { success: false, message: "Failed to send email", error: emailResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Professional invoice email sent to ${invoice.client_name} (${invoice.client_email})`,
      template: populatedTemplate.name,
      recipient: invoice.client_email
    });
  } catch (error) {
    console.error("Email invoice error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to email invoice", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 