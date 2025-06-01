# Email Setup Instructions

## Issue: Email Sending Failures

The application is currently unable to send emails due to an invalid Resend API key. To fix this issue, follow these steps:

## Step 1: Sign up for Resend

1. Go to [Resend](https://resend.com) and sign up for an account if you don't have one already.
2. Once logged in, go to the API Keys section.
3. Create a new API key.

## Step 2: Update your .env.local file

1. Make sure you have a `.env.local` file in the root of your project.
2. Add the following environment variables:

```
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=AutoFlow <your-verified-email@yourdomain.com>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Notes:
- Replace `re_your_actual_api_key_here` with the API key you obtained from Resend.
- The EMAIL_FROM must be in the format "Name <email>" and must use an email domain that you've verified with Resend.

## Step 3: Verify your setup

Run the environment checker script to make sure your configuration is correct:

```
node check-env.js
```

## Step 4: Test email sending

Send a test email to verify everything works:

```
node test-email.js your-email@example.com
```

Replace `your-email@example.com` with your actual email address.

## Step 5: Restart the application

Restart your development server to apply the changes:

```
npm run dev
```

## Troubleshooting

If you continue to experience issues:

1. Check the Resend dashboard to see if your emails are being processed.
2. Make sure your API key is correct and does not contain any spaces or special characters.
3. Verify that you're using a sender email domain that's been verified with Resend.
4. Check the application logs for any specific error messages.

For more help, refer to the [Resend documentation](https://resend.com/docs). 