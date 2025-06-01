#!/bin/bash

# Script to run the scheduled email cron job
# Path to the project directory - update this if needed
PROJECT_DIR="/Users/nahavipusans/Desktop/autoflow final"

# Go to the project directory
cd "$PROJECT_DIR"

# Log the execution time with timezone
echo "Scheduler started at $(date '+%Y-%m-%d %H:%M:%S %Z')" >> "$PROJECT_DIR/scheduler.log"

# Run the cron job
npm run cron:emails

# Log the completion time
echo "Scheduler completed at $(date '+%Y-%m-%d %H:%M:%S %Z')" >> "$PROJECT_DIR/scheduler.log"
echo "" >> "$PROJECT_DIR/scheduler.log" 