#!/bin/bash

# --- Deployment Script for cPanel ---
#
# This script uses `lftp` to upload the contents of the `dist` directory
# to your cPanel hosting server. `lftp` is a sophisticated command-line
# file transfer program.

# --- Prerequisites ---
# 1. Install lftp: 
#    - Windows: Use WSL (Windows Subsystem for Linux) and run `sudo apt-get install lftp`
#    - macOS: `brew install lftp`
#    - Linux: `sudo apt-get install lftp` or `sudo yum install lftp`
# 2. cPanel FTP Credentials: You need your FTP host, username, and password.

# --- Configuration ---
# IMPORTANT: Replace these placeholder values with your actual cPanel FTP credentials.
# For better security, consider using environment variables instead of hardcoding passwords.
FTP_HOST="ftp.yourdomain.com"  # Replace with your server's FTP address
FTP_USER="your_ftp_username" # Replace with your cPanel FTP username
FTP_PASS="your_ftp_password"   # Replace with your FTP password

# --- Directories ---
LOCAL_DIR="dist/" # The local directory to upload (should be the build output)
REMOTE_DIR="/public_html/" # The remote directory on your cPanel server

# --- LFTP Command ---
# The following command will "mirror" your local `dist` directory to the remote `public_html`.
# It's fast because it only uploads new or changed files.

echo "🚀 Starting deployment to $FTP_HOST..."

lftp -c "
open -u $FTP_USER,$FTP_PASS $FTP_HOST
set ftp:ssl-allow no; # This setting is often required for cPanel FTP, remove if you use FTPS
cd $REMOTE_DIR
mirror -R -e -v --parallel=5 --log=lftp-deploy.log $LOCAL_DIR $REMOTE_DIR
exit
"

echo "✅ Deployment finished successfully!"
