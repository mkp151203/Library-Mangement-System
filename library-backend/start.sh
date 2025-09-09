#!/bin/bash

# Create a directory to hold the unzipped wallet files
mkdir -p /app/wallet

# Unzip the secure wallet file from Render's secret file location
unzip /etc/secrets/wallet.zip -d /app/wallet

# Set the TNS_ADMIN environment variable
# This tells the 'oracledb' library where to find the wallet files
export TNS_ADMIN=/app/wallet/

# Start your Node.js application
node sever.js