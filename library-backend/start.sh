#!/bin/bash

# Exit if any command fails
set -e

# Temporary directory for wallet
WALLET_DIR=/tmp/wallet
WALLET_ZIP=/tmp/wallet.zip

# Create directory
mkdir -p $WALLET_DIR

# Decode base64 wallet string into zip file
echo "$WALLET_B64" | base64 -d > $WALLET_ZIP

# Unzip wallet
unzip -o $WALLET_ZIP -d $WALLET_DIR

# Export TNS_ADMIN so OracleDB knows where to look
export TNS_ADMIN=$WALLET_DIR

# Start the Node.js application
node server.js
