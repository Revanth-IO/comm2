# Fix: .htaccess File Not Visible in cPanel File Manager

## The Problem
The `.htaccess` file starts with a dot (.), making it a "hidden file" in Unix/Linux systems. cPanel File Manager hides these files by default.

## Solution: Show Hidden Files in cPanel

### Step 1: Enable Hidden Files in File Manager
1. Log into your Namecheap cPanel
2. Go to **File Manager**
3. Look for **Settings** button (usually top-right corner)
4. Click **Settings**
5. Check the box that says **"Show Hidden Files (dotfiles)"**
6. Click **Save**

### Step 2: Verify .htaccess is Now Visible
After enabling hidden files, you should see:
- `.htaccess` file in your public_html directory
- Other hidden files like `.well-known/` folder (if any)

### Step 3: If .htaccess Still Missing, Upload It Manually
If you don't see the `.htaccess` file after showing hidden files:

1. In File Manager, navigate to `public_html`
2. Click **+ File** (Create New File)
3. Name it exactly: `.htaccess` (with the dot at the beginning)
4. Click **Create New File**
5. Right-click the new file → **Edit**
6. Paste this content:

```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# Redirect to HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Handle client-side routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Prevent access to sensitive files
<Files ~ "^\.">
    Order allow,deny
    Deny from all
</Files>

<Files ~ "\.env$">
    Order allow,deny
    Deny from all
</Files>
```

7. Click **Save Changes**

### Step 4: Set Correct Permissions
1. Right-click the `.htaccess` file
2. Select **Change Permissions**
3. Set to `644`
4. Click **Change Permissions**

### Step 5: Test Your Website
1. Clear your browser cache
2. Visit `https://upkar.org`
3. The website should now load properly

## Alternative Upload Method

If the File Manager method doesn't work:

### Method 1: Upload via FTP
1. Use an FTP client (like FileZilla)
2. Connect to your hosting account
3. Navigate to `public_html`
4. Upload the `.htaccess` file from your `dist` folder
5. Ensure it's named exactly `.htaccess`

### Method 2: Rename After Upload
1. Upload the file as `htaccess.txt`
2. After upload, rename it to `.htaccess`
3. Set permissions to `644`

## Verification Checklist
After fixing the .htaccess visibility:

- [ ] Hidden files are enabled in File Manager settings
- [ ] `.htaccess` file is visible in public_html
- [ ] `.htaccess` file permissions are set to 644
- [ ] Website loads at upkar.org without showing file manager
- [ ] HTTPS redirect works (http://upkar.org redirects to https://upkar.org)

## Common Issues & Solutions

### Issue: Still can't see .htaccess
**Solution:** Try refreshing the File Manager page after enabling hidden files

### Issue: .htaccess uploads but gets renamed
**Solution:** Some systems rename it. Check for files like `_htaccess` or `htaccess.txt`

### Issue: Permission denied when creating .htaccess
**Solution:** Contact Namecheap support - there might be server-level restrictions

### Issue: Website still shows file manager after adding .htaccess
**Solution:** 
1. Check if `index.html` exists in public_html
2. Verify file permissions (644 for files, 755 for folders)
3. Wait 5-10 minutes for changes to take effect
4. Clear browser cache completely

## Quick Test
To verify .htaccess is working:
1. Visit `http://upkar.org` (without https)
2. It should automatically redirect to `https://upkar.org`
3. If it does, your .htaccess is working correctly

Your website should now be fully functional at upkar.org!