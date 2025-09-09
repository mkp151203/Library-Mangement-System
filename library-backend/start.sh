#!/bin/bash

# Create a directory for the unzipped wallet inside the project source directory
mkdir -p /opt/render/project/src/wallet

# Unzip the secure wallet file from Render's secret file location
unzip /etc/secrets/wallet.zip -d /opt/render/project/src/wallet

# Set the TNS_ADMIN environment variable to the unzipped wallet location
export TNS_ADMIN=/opt/render/project/src/wallet

# Run the Node.js application, correcting the file name from 'sever.js' to 'server.js'
node server.js
