/**
 * Professional Email Template Suite
 * Industry-grade templates designed to position services as premium and valuable
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'invoice' | 'reminder' | 'follow-up' | 'client-relations' | 'project' | 'payment';
  industry?: string;
  tone: 'professional' | 'friendly-professional' | 'authoritative' | 'consultative';
}

export const professionalEmailTemplates: EmailTemplate[] = [
  
  // === INVOICE TEMPLATES ===
  {
    id: 'premium-invoice-delivery',
    name: 'Premium Service Invoice Delivery',
    subject: 'Investment Summary: {{invoice_number}} - {{project_name}}',
    body: `Dear {{client_name}},

I trust this message finds you well.

Please find attached your investment summary for the professional services we've delivered. This comprehensive document outlines the strategic value and measurable outcomes we've achieved together.

**Investment Details:**
• Project: {{project_name}}
• Investment Amount: {{amount}}
• Value Delivered: {{value_delivered}}
• Completion Date: {{completion_date}}
• ROI Timeline: {{roi_timeline}}

**Key Deliverables Completed:**
✓ Strategic consultation and expert analysis
✓ Custom solution implementation 
✓ Quality assurance and optimization
✓ Comprehensive documentation and handover
✓ 30-day post-implementation support included

**Investment Terms:**
Payment is due within 14 days to maintain our preferred client status and ensure continued priority access to our expertise.

**Exclusive Benefits for Prompt Payment:**
• 2% early payment incentive (if paid within 7 days)
• Priority booking for future engagements
• Complimentary strategy consultation (30 minutes)

We're proud of the exceptional results we've delivered and look forward to your continued success with the solutions we've implemented.

For any questions about this investment or to discuss your next strategic initiative, I'm personally available at {{direct_phone}} or {{direct_email}}.

Best regards,

{{signature}}
{{title}}
{{company_name}}

P.S. As a valued client, you now have exclusive access to our quarterly industry insights report. I'll send this separately this week.`,
    category: 'invoice',
    tone: 'consultative'
  },

  {
    id: 'executive-invoice-presentation',
    name: 'Executive-Level Invoice Presentation',
    subject: 'Professional Services Summary - {{invoice_number}} | {{company_name}}',
    body: `Dear {{client_name}},

Thank you for entrusting us with {{project_description}}. Our team has successfully delivered the comprehensive solution we outlined, and I'm pleased to present the final investment summary.

**PROJECT IMPACT SUMMARY:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Strategic Value Delivered: {{value_metric}}
Implementation Timeline: {{timeline}} 
Quality Score: 98.5% (Industry benchmark: 78%)
Client Satisfaction Rating: {{satisfaction_rating}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**PROFESSIONAL SERVICES BREAKDOWN:**
{{service_breakdown}}

**Total Professional Investment: {{amount}}**

**PAYMENT TERMS & BENEFITS:**
• Standard Terms: Net 14 days
• Early Settlement Discount: 2% (if paid within 7 days)
• Preferred Client Benefits: Activated upon payment

**WHAT'S INCLUDED POST-PAYMENT:**
• 30-day implementation warranty
• Direct access to senior consulting team
• Quarterly performance review (complimentary)
• Priority support channel activation

**SECURE PAYMENT OPTIONS:**
• Bank Transfer: [Details in attached payment guide]
• Corporate Credit: Available for amounts over $5,000
• Installment Plans: Available for strategic partnerships

This investment reflects not just the work completed, but the ongoing strategic value and competitive advantage we've built into your operations.

I'll personally follow up within 24 hours to ensure everything meets your expectations and to discuss the implementation of your success metrics.

Strategically yours,

{{signature}}
{{title}} | {{company_name}}
Direct: {{direct_phone}} | {{direct_email}}

Confidential & Proprietary - {{company_name}} {{current_year}}`,
    category: 'invoice',
    tone: 'authoritative'
  },

  // === PAYMENT REMINDER TEMPLATES ===
  {
    id: 'respectful-payment-reminder',
    name: 'Respectful Professional Reminder',
    subject: 'Friendly Reminder: Investment {{invoice_number}} - Partnership {{company_name}}',
    body: `Dear {{client_name}},

I hope you're seeing excellent results from the {{project_name}} we recently completed for you.

I wanted to reach out personally regarding investment summary {{invoice_number}} for {{amount}}, which was due on {{due_date}}. I know how busy you are, and these things can sometimes slip through the cracks.

**Quick Reminder Details:**
• Investment Amount: {{amount}}
• Original Due Date: {{due_date}}
• Days Outstanding: {{days_overdue}}
• Project Delivered: {{project_name}}

**What This Investment Covered:**
✓ {{key_deliverable_1}}
✓ {{key_deliverable_2}}
✓ {{key_deliverable_3}}
✓ Ongoing support and warranty

I understand that cash flow timing can be challenging in business. If you need to discuss alternative payment arrangements or have any concerns about the work delivered, I'm here to help find a solution that works for both of us.

**Easy Payment Options:**
• Online Payment Portal: {{payment_link}}
• Bank Transfer: {{bank_details}}
• Phone Payment: {{payment_phone}}

**Still Available:**
• 1% prompt payment discount (if paid within 5 days)
• Complimentary strategy session for future projects

Your partnership means a great deal to us, and I want to ensure our working relationship continues smoothly. 

Could you please confirm when we might expect payment, or let me know if there's anything I can do to assist?

Looking forward to hearing from you soon.

Warm regards,

{{signature}}
{{title}}
{{company_name}}
{{direct_phone}} | {{direct_email}}

P.S. I'd love to hear how the {{project_name}} implementation is performing for you. Feel free to share any wins or feedback!`,
    category: 'reminder',
    tone: 'friendly-professional'
  },

  {
    id: 'executive-payment-reminder',
    name: 'Executive Payment Reminder',
    subject: 'Action Required: Professional Services Investment {{invoice_number}}',
    body: `Dear {{client_name}},

Re: Outstanding Professional Services Investment - {{invoice_number}}

Our records indicate that the above investment of {{amount}} for {{project_name}} remains outstanding, with payment originally due on {{due_date}} ({{days_overdue}} days ago).

**Investment Summary:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Services Delivered: {{project_name}}
Professional Investment: {{amount}}
Value Delivered: {{value_delivered}}
Original Due Date: {{due_date}}
Current Status: {{days_overdue}} days overdue
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Immediate Action Required:**
To maintain our professional relationship and avoid any interruption to ongoing support services, please arrange payment within the next 5 business days.

**Payment Status Impact:**
• Overdue accounts affect our ability to provide priority support
• Extended delays may require formal collection procedures
• Future project availability may be impacted

**Resolution Options:**
1. Full Payment: {{amount}} - Immediately restores account to good standing
2. Payment Plan: Contact us to discuss structured payment options
3. Dispute Resolution: If you have concerns about the work delivered

**Secure Payment Methods:**
• Corporate Banking: {{bank_transfer_details}}
• Online Payment Portal: {{secure_payment_link}}
• Direct Discussion: {{payment_phone}}

We value our professional relationship and want to resolve this matter promptly. If there are circumstances affecting payment that you'd like to discuss confidentially, please contact me directly.

**Next Steps:**
If payment is not received within 5 business days, we will need to:
• Suspend ongoing support services
• Initiate formal collection procedures
• Review terms for future engagements

I trust we can resolve this matter quickly and maintain our positive working relationship.

Professionally yours,

{{signature}}
{{title}}
{{company_name}}
Direct Line: {{direct_phone}}
{{professional_email}}

Confidential Business Communication`,
    category: 'reminder',
    tone: 'authoritative'
  },

  // === CLIENT RELATIONSHIP TEMPLATES ===
  {
    id: 'premium-welcome-onboarding',
    name: 'Premium Client Onboarding Experience',
    subject: 'Welcome to Excellence: Your {{company_name}} Partnership Begins',
    body: `Dear {{client_name}},

Welcome to the {{company_name}} family! 

You've just made an exceptional decision by choosing to work with us. Our track record speaks for itself: over {{years_experience}} years of delivering transformational results for organizations like yours, with an average ROI of {{average_roi}} and a client satisfaction rate of {{satisfaction_rate}}.

**Your Exclusive Partnership Benefits:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Dedicated Senior Account Manager (that's me!)
✓ Priority access to our expert team
✓ 24/7 emergency support line
✓ Quarterly strategic review sessions
✓ Exclusive industry insights and reports
✓ First access to new services and innovations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**What Happens Next:**

**Week 1:** Deep-dive discovery and strategic planning
• Comprehensive needs assessment
• Custom solution architecture
• Timeline and milestone planning
• Team introductions and communication setup

**Week 2-4:** Implementation and optimization
• Expert execution of your custom solution
• Real-time progress tracking and reporting
• Proactive communication and updates
• Quality assurance at every step

**Ongoing:** Partnership and growth
• Continuous optimization and refinement
• Strategic guidance and consultation
• Scalability planning for future growth
• Performance monitoring and reporting

**Your Direct Contacts:**
• Primary Account Manager: {{account_manager}} - {{manager_phone}}
• Technical Lead: {{technical_lead}} - {{technical_phone}}
• Emergency Support: {{emergency_line}}
• Client Portal: {{client_portal_link}}

**Immediate Access:**
I've already set up your exclusive client portal where you can:
• Track project progress in real-time
• Access all documentation and reports
• Submit requests and communicate directly with the team
• View your investment history and upcoming milestones

**My Personal Commitment:**
As your dedicated account manager, I'm personally committed to ensuring this partnership exceeds your expectations. I'll be in touch within 24 hours to schedule our kickoff session and answer any questions you might have.

**Industry Recognition:**
You're now working with a {{certification_level}} certified team that has been recognized by {{industry_awards}} for excellence in {{specialty_area}}.

I'm genuinely excited about the results we're going to achieve together. Your success is our success, and we're here to make sure you get exceptional value from every dollar invested.

Welcome aboard!

{{signature}}
{{title}} & Senior Account Manager
{{company_name}}
Direct: {{direct_phone}} | {{direct_email}}

P.S. Keep an eye out for our exclusive monthly "Strategic Insights" report - it's packed with industry trends and actionable strategies that our clients use to stay ahead of their competition. The first one arrives next week!`,
    category: 'client-relations',
    tone: 'consultative'
  },

  {
    id: 'project-completion-excellence',
    name: 'Project Completion & Value Demonstration',
    subject: 'Mission Accomplished: {{project_name}} Delivers {{value_metric}} Impact',
    body: `Dear {{client_name}},

I'm thrilled to officially mark the successful completion of {{project_name}}!

After {{project_duration}} of dedicated work, strategic planning, and expert execution, we've not only met but exceeded the objectives we set out to achieve.

**MISSION ACCOMPLISHED:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Primary Objective: {{primary_objective}}
✅ Result Achieved: {{result_achieved}}
📊 Performance Metric: {{performance_metric}}
💰 Value Generated: {{value_generated}}
⏱️ Delivered: {{delivery_status}} ({{timeline_performance}})
⭐ Quality Score: {{quality_score}}/100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Key Achievements Unlocked:**
✓ {{achievement_1}}
✓ {{achievement_2}}
✓ {{achievement_3}}
✓ {{achievement_4}}
✓ {{achievement_5}}

**The Numbers That Matter:**
• ROI Projection: {{roi_projection}}
• Efficiency Gain: {{efficiency_gain}}
• Cost Savings: {{cost_savings}}
• Performance Improvement: {{performance_improvement}}

**What's Included in Your Success Package:**
📋 Complete documentation and user guides
🔧 All source files and access credentials
📊 Performance baseline and monitoring setup
🛡️ 30-day warranty and support coverage
📞 Direct hotline to our technical team
📈 Quarterly performance review sessions

**Your Competitive Advantage:**
You now have a {{competitive_advantage}} that puts you ahead of 87% of your industry peers. This isn't just a completed project - it's a strategic asset that will continue delivering value for years to come.

**Immediate Next Steps:**
1. **Today:** Full system handover and access transfer
2. **This Week:** User training and knowledge transfer sessions
3. **30 Days:** First performance review and optimization check
4. **90 Days:** Strategic planning session for next phase

**Ongoing Partnership Value:**
• Priority support and maintenance packages available
• Early access to upgrades and enhancements
• Strategic consultation sessions (quarterly)
• Industry benchmarking and competitive analysis

**Client Success Metrics:**
Based on similar implementations, you can expect:
• {{metric_1}}: {{improvement_percentage_1}} improvement
• {{metric_2}}: {{improvement_percentage_2}} enhancement
• {{metric_3}}: {{improvement_percentage_3}} optimization

**Exclusive Opportunity:**
Because of the exceptional results we've achieved together, I'd like to offer you first access to our upcoming {{new_service}} program, specifically designed for high-performing organizations like yours.

**Recognition:**
Your project has been selected as a case study for our upcoming industry conference presentation on "{{conference_topic}}" - a testament to the innovative approach and outstanding results we've achieved together.

**Personal Note:**
Working with you and your team has been an absolute pleasure. Your vision, collaboration, and commitment to excellence made this success possible. I'm genuinely excited to see how these improvements impact your business in the months ahead.

**Celebration & What's Next:**
I'll be calling you personally this week to celebrate this achievement and discuss how we can build on this momentum for your next strategic initiative.

Here's to your continued success!

{{signature}}
{{title}}
{{company_name}}
Direct: {{direct_phone}} | {{direct_email}}

P.S. I've arranged for our CEO to personally send you a handwritten note acknowledging your partnership and this project's success. It should arrive by Friday!

---
{{company_name}} - Delivering Excellence Since {{founded_year}}
Award-Winning {{industry}} Solutions | {{certifications}}`,
    category: 'project',
    tone: 'consultative'
  },

  // === FOLLOW-UP AND RELATIONSHIP BUILDING ===
  {
    id: 'strategic-check-in',
    name: 'Strategic Partnership Check-in',
    subject: 'Strategic Update: Maximizing Your {{project_name}} Investment',
    body: `Dear {{client_name}},

I hope this message finds you capitalizing on the results from our recent {{project_name}} implementation.

It's been {{time_since_completion}} since we completed your project, and I wanted to personally check in on how everything is performing and ensure you're extracting maximum value from your investment.

**Performance Checkpoint:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Expected Performance at {{time_since_completion}}: {{expected_performance}}
Industry Benchmark: {{industry_benchmark}}
Optimization Opportunities Identified: {{opportunities_count}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Quick Questions for You:**
1. How are the results comparing to your initial expectations?
2. Are there any areas where you'd like to see enhanced performance?
3. Have new challenges or opportunities emerged that we should address?
4. What additional strategic objectives are on your horizon?

**Proactive Value Adds:**
Based on our experience with similar implementations, here are three strategic recommendations for maximizing your ROI:

🎯 **Optimization Opportunity #1:** {{optimization_1}}
Expected Impact: {{impact_1}}

🎯 **Optimization Opportunity #2:** {{optimization_2}}
Expected Impact: {{impact_2}}

🎯 **Optimization Opportunity #3:** {{optimization_3}}
Expected Impact: {{impact_3}}

**Exclusive Partnership Benefits:**
As a valued client, you have access to:
• Complimentary performance optimization review (30 minutes)
• Priority access to our latest {{new_technology}} solutions
• Invitation to our exclusive {{industry}} roundtable next month
• Early access to our Q{{quarter}} industry insights report

**Strategic Expansion Opportunities:**
Given your success with {{project_name}}, you might be interested in these natural next steps:
• {{expansion_opportunity_1}} - ROI: {{roi_1}}
• {{expansion_opportunity_2}} - ROI: {{roi_2}}
• {{expansion_opportunity_3}} - ROI: {{roi_3}}

**No-Obligation Consultation:**
I'd love to schedule a brief 15-minute call to:
✓ Celebrate your wins and success metrics
✓ Identify any quick optimization opportunities
✓ Discuss your strategic roadmap for the next quarter
✓ Share industry insights specific to your situation

**Book Your Complimentary Strategy Session:**
{{calendar_link}} or reply to this email with your preferred time.

**Industry Intelligence:**
FYI - We're seeing significant movement in {{industry_trend}} that could impact organizations like yours. I'll share our proprietary analysis during our call.

Your continued success is our primary measure of achievement. Let's ensure you're positioned not just to meet your goals, but to exceed them significantly.

Looking forward to connecting soon!

{{signature}}
{{title}}
{{company_name}}
Direct: {{direct_phone}} | {{direct_email}}

P.S. I've attached our latest "{{industry}} Performance Benchmarks" report - it includes data showing how organizations like yours are outperforming their competitors by {{performance_gap}}. You might find the insights particularly relevant for your {{current_quarter}} planning.`,
    category: 'follow-up',
    tone: 'consultative'
  },

  // === PAYMENT SUCCESS AND APPRECIATION ===
  {
    id: 'payment-received-appreciation',
    name: 'Payment Received - Partnership Appreciation',
    subject: 'Thank You: Payment Confirmed - Partnership {{company_name}} Strengthened',
    body: `Dear {{client_name}},

Thank you! Your payment of {{amount}} for {{project_name}} has been received and processed.

**Payment Confirmation:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Amount Received: {{amount}}
✅ Payment Date: {{payment_date}}
✅ Invoice: {{invoice_number}}
✅ Project: {{project_name}}
✅ Account Status: Excellent Standing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Your Partnership Benefits Are Now Active:**
🎯 Priority support channel activated
📞 Direct access to senior team members
📊 Quarterly strategic review sessions enabled
🚀 Early access to new service offerings
💼 Preferred client pricing on future projects
📈 Complimentary industry insights and reports

**What This Means for You:**
Your prompt payment demonstrates the professionalism and partnership approach that makes working together so rewarding. You're now in our "Platinum Partner" tier, which means:

• **Response Time:** Maximum 2-hour response on all communications
• **Access Level:** Direct line to project leads and specialists
• **Strategic Value:** Quarterly business review and optimization sessions
• **Future Projects:** 15% preferred client discount automatically applied
• **Industry Intel:** Exclusive access to our proprietary market research

**Immediate Activation:**
✓ Your dedicated support portal is now live: {{support_portal_link}}
✓ Direct support hotline activated: {{direct_hotline}}
✓ Next quarterly review scheduled for: {{next_review_date}}

**Performance Tracking:**
Your {{project_name}} is performing exceptionally:
• {{performance_metric_1}}: {{current_performance_1}} ({{vs_target_1}} vs target)
• {{performance_metric_2}}: {{current_performance_2}} ({{vs_target_2}} vs target)
• Overall satisfaction rating: {{satisfaction_rating}}/10

**Upcoming Opportunities:**
Based on your {{project_name}} success, here are three strategic opportunities that might interest you:

1. **{{opportunity_1}}** - Expected ROI: {{roi_1}}
2. **{{opportunity_2}}** - Expected ROI: {{roi_2}}
3. **{{opportunity_3}}** - Expected ROI: {{roi_3}}

**Exclusive Invitation:**
You're now invited to our monthly "Strategic Partners Roundtable" where we share industry insights, discuss emerging trends, and facilitate networking among our top-tier clients. The next session is {{next_roundtable_date}}.

**Recognition:**
Your project has achieved results that put you in the top 10% of implementations in your industry. We'd love to feature your success (with your permission) in our upcoming case study series.

**Personal Commitment:**
As your account manager, I'm personally committed to ensuring you continue receiving exceptional value from our partnership. I'll be proactively monitoring your project performance and reaching out with optimization recommendations.

**Next Touchpoint:**
I'll personally call you within the next week to:
✅ Ensure everything is exceeding expectations
✅ Discuss any questions or optimization opportunities
✅ Share exclusive industry insights relevant to your business
✅ Explore natural expansion opportunities

Thank you again for your trust, professionalism, and partnership. Your success truly is our success.

Strategically yours,

{{signature}}
{{title}} & Your Dedicated Account Manager
{{company_name}}
Direct Line: {{direct_phone}}
Strategic Email: {{strategic_email}}

P.S. I've arranged for our CEO to personally send you an executive gift as a token of appreciation for your partnership. It should arrive by {{gift_delivery_date}} along with a handwritten note recognizing your organization's strategic vision.

---
{{company_name}} | {{tagline}}
Serving {{industry}} Leaders Since {{founded_year}}
{{certifications}} | {{awards}}`,
    category: 'payment',
    tone: 'consultative'
  }
];

// Utility function to populate template variables
export function populateTemplate(template: EmailTemplate, variables: Record<string, string>): EmailTemplate {
  let populatedSubject = template.subject;
  let populatedBody = template.body;

  // Replace all variables in subject and body
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    populatedSubject = populatedSubject.replace(new RegExp(placeholder, 'g'), value);
    populatedBody = populatedBody.replace(new RegExp(placeholder, 'g'), value);
  });

  return {
    ...template,
    subject: populatedSubject,
    body: populatedBody
  };
}

// Get templates by category
export function getTemplatesByCategory(category: EmailTemplate['category']): EmailTemplate[] {
  return professionalEmailTemplates.filter(template => template.category === category);
}

// Get templates by industry
export function getTemplatesByIndustry(industry: string): EmailTemplate[] {
  return professionalEmailTemplates.filter(template => 
    template.industry === industry || !template.industry
  );
}

// Get template by ID
export function getTemplateById(id: string): EmailTemplate | undefined {
  return professionalEmailTemplates.find(template => template.id === id);
}

// Default variables for testing/preview
export const defaultTemplateVariables = {
  client_name: "Sarah Johnson",
  company_name: "AutoFlow Solutions", 
  invoice_number: "INV-2024-0123",
  amount: "$12,500",
  project_name: "Digital Transformation Initiative",
  due_date: "March 15, 2024",
  completion_date: "February 28, 2024",
  value_delivered: "$47,500 in operational savings",
  roi_timeline: "6-8 months",
  signature: "Michael Thompson",
  title: "Senior Strategic Consultant",
  direct_phone: "+1 (555) 123-4567",
  direct_email: "m.thompson@autoflow.com",
  current_year: new Date().getFullYear().toString(),
  days_overdue: "7",
  satisfaction_rating: "9.8",
  years_experience: "12",
  average_roi: "340%",
  satisfaction_rate: "98.7%"
}; 