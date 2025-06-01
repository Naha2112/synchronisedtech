# AutoFlow System Guide for AI Assistant

## Overview
AutoFlow is a comprehensive business management platform that helps service businesses automate client management, appointments, invoicing, and communications. This guide explains how to use all system features.

## Core Features

### 1. Dashboard
- Shows business overview with key metrics (pending invoices, revenue, etc.)
- Displays upcoming bookings and recent activity
- Quick access to all main features

### 2. Client Management
- Add, edit, and delete client records with contact information
- View client history, including past bookings and invoices
- Filter and search clients by various criteria
- Access client details through `/clients` and individual clients at `/clients/[id]`

### 3. Booking System
- Create appointments with date, time, duration, and client assignment
- Calendar view with daily, weekly, and list views 
- Status tracking (scheduled, confirmed, cancelled, completed)
- Add detailed notes and location information
- Send booking confirmations and reminders automatically
- Access through `/bookings` with weekly calendar and list views
- Create bookings at `/bookings/new`
- View/edit individual bookings at `/bookings/[id]` and `/bookings/[id]/edit`

### 4. Invoice Management
- Create professional invoices tied to clients
- Add line items with descriptions, quantities, rates
- Apply taxes and discounts
- Track invoice status (draft, sent, viewed, paid, overdue)
- Generate PDF versions for download/email
- Send invoice reminders automatically
- Access through `/invoices` and create at `/invoices/new`

### 5. Email Templates
- Create reusable email templates for common communications
- Personalize with variables (client name, booking details, invoice amounts)
- Categorize templates by purpose (welcome, booking confirmation, invoice, etc.)
- Preview emails before sending
- Access through `/email-templates`
- Create new templates at `/email-templates/new`

### 6. Automation
- Set up trigger-based workflows (new client, invoice sent, etc.)
- Configure multi-step actions (send email, wait period, follow-up)
- Schedule recurring tasks and communications
- Monitor automation performance and logs
- Access through `/automation`

### 7. AI Assistant
- Natural language interface for common tasks
- Generate email content based on requirements
- Answer questions about client history and appointments
- Suggest next actions based on context
- Create invoices directly when requested
- Generate email templates automatically
- Access through `/ai`

## AI Assistant Capabilities

AutoFlow's AI Assistant can help you with the following:

1. **General questions** about how to use AutoFlow and its features
2. **Finding information** about clients, bookings, and invoices
3. **Creating email templates** by providing a description of what you want
4. **Creating invoices** by simply describing what you need (client, amount, description)
5. **Emailing invoices** to clients directly from the chat
6. **Explaining features** and walking you through how to use them

You can ask the AI to create an invoice or send an invoice by using natural language, for example:
- "Create an invoice for John Smith for $500 for web design services"
- "Email invoice INV-2025-05-0001 to the client"
- "Email invoice INV-2025-05-0001 with message: Thank you for your business, please pay within 30 days"

## Database Structure
The system uses MySQL with tables for:
- Users (staff accounts)
- Clients
- Bookings
- Invoices and Invoice Items
- Email Templates
- Automation Workflows and Steps

## Common User Tasks

### Creating a New Booking
1. Navigate to `/bookings`
2. Click "New Booking"
3. Select client from dropdown
4. Choose date and time
5. Add title, description, and location
6. Set status (default: scheduled)
7. Add optional notes
8. Click "Create Booking"

### Creating an Invoice
1. Navigate to `/invoices`
2. Click "New Invoice"
3. Select client from dropdown
4. Set issue date and payment terms
5. Add line items (description, quantity, rate)
6. Apply taxes if needed
7. Add notes or payment instructions
8. Save as draft or finalize
9. Optional: send immediately via email

**Alternatively, you can ask the AI Assistant to create an invoice for you directly by saying: "Create an invoice for [client name] for [amount] for [service description]"**

### Creating and Sending Emails
1. Navigate to `/email-templates`
2. Create template or use existing
3. Select recipient(s) from client list
4. Customize content if needed
5. Preview email
6. Send immediately or schedule for later

**Alternatively, you can ask the AI Assistant to create email templates for you directly by saying: "Create a [type] email template for [purpose]"**

### Setting Up Automation
1. Navigate to `/automation`
2. Click "Create Workflow"
3. Select trigger type
4. Configure conditions
5. Add action steps (email, status update, notification)
6. Set timing between steps
7. Activate workflow

## Important Notes
- All actions require authentication
- Date/time handling follows ISO standards with proper MySQL formatting
- Client information is required for most operations
- Templates and automations save significant time for repetitive tasks
- The AI assistant can help with generating content and providing guidance
- The AI assistant can directly create invoices and email templates when requested 