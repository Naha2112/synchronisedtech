#!/bin/bash

# Script to set up a cron job for scheduled emails
PROJECT_DIR="/Users/nahavipusans/Desktop/autoflow final"
SCRIPT_PATH="$PROJECT_DIR/scripts/run-scheduler.sh"

# Make sure scripts are executable
chmod +x "$SCRIPT_PATH"
chmod +x "$PROJECT_DIR/scripts/run-cron.js"

# Create a temp file for the crontab
TEMP_CRONTAB=$(mktemp)

# Export current crontab to the temp file
crontab -l > "$TEMP_CRONTAB" 2>/dev/null || echo "" > "$TEMP_CRONTAB"

# Check if the cron job already exists
if grep -q "run-scheduler.sh" "$TEMP_CRONTAB"; then
  echo "Cron job already exists. No changes made."
else
  # Add the new cron job to run every minute
  echo "# AutoFlow scheduled emails - runs every minute" >> "$TEMP_CRONTAB"
  echo "* * * * * $SCRIPT_PATH >> $PROJECT_DIR/cron.log 2>&1" >> "$TEMP_CRONTAB"
  
  # Install the new crontab
  crontab "$TEMP_CRONTAB"
  echo "Cron job installed successfully! It will run every minute."
fi

# Clean up
rm "$TEMP_CRONTAB"

echo ""
echo "To check if your cron job is running, you can view the logs with:"
echo "cat $PROJECT_DIR/cron.log"
echo ""
echo "The first email should be processed within 1 minute."

# Generate a random API secret if none exists
ENV_FILE=.env.local
if ! grep -q "CRON_API_SECRET=" $ENV_FILE; then
  API_SECRET=$(openssl rand -hex 16)
  echo "" >> $ENV_FILE
  echo "# Cron job configuration" >> $ENV_FILE
  echo "CRON_API_SECRET=\"$API_SECRET\"" >> $ENV_FILE
  echo "Added CRON_API_SECRET to $ENV_FILE"
else
  echo "CRON_API_SECRET already exists in $ENV_FILE"
fi

echo "
=== Scheduled Emails Cron Setup ===

Your cron job is now configured. To run it manually:

npm run cron:emails

To set up an automated scheduled task:

=== On macOS/Linux ===
Run this command to edit your crontab:
crontab -e

Then add this line to run every 5 minutes:
*/5 * * * * cd $(pwd) && npm run cron:emails

=== On Windows ===
1. Open Task Scheduler
2. Create a Basic Task
3. Set trigger to run every 5 minutes
4. Set action to start a program
5. Program/script: npm
6. Arguments: run cron:emails
7. Start in: $(pwd)

=== Using a Cron Service ===
For production, consider using a service like:
- Vercel Cron Jobs
- AWS EventBridge
- Google Cloud Scheduler

API Endpoint: $(grep NEXTAUTH_URL .env.local | cut -d '=' -f2)/api/cron/scheduled-emails
API Secret: $(grep CRON_API_SECRET .env.local | cut -d '=' -f2)
" 