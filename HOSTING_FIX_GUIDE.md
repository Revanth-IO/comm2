# Fix: Website Shows File Manager Instead of Content

## The Problem
When you visit upkar.org, you're seeing a file manager/directory listing instead of your website. This happens when:
1. The web server can't find or serve the `index.html` file
2. Directory indexing is enabled instead of serving the default page
3. File permissions are incorrect
4. The domain isn't pointing to the right directory

## Quick Fix Steps

### Step 1: Check File Location
1. Log into your Namecheap cPanel
2. Go to **File Manager**
3. Navigate to `public_html`
4. Verify these files are directly in `public_html` (not in a subfolder):
   ```
   public_html/
   ├── index.html          ← Must be here
   ├── assets/
   ├── favicon.svg
   ├── robots.txt
   ├── sitemap.xml
   └── .htaccess
   ```

### Step 2: Fix File Permissions
1. In File Manager, select `index.html`
2. Right-click → **Change Permissions**
3. Set to `644` (Owner: Read+Write, Group: Read, World: Read)
4. Do the same for all files in `assets/` folder

### Step 3: Create/Fix .htaccess File
Create a new file called `.htaccess` in `public_html` with this content:

```apache
# Force index.html as default page
DirectoryIndex index.html

# Disable directory browsing
Options -Indexes

# Enable rewrite engine for SPA routing
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Step 4: Check Domain Configuration
1. In cPanel, go to **Subdomains** or **Addon Domains**
2. Ensure `upkar.org` points to `public_html` (not a subfolder)
3. If you see it pointing to `public_html/upkar.org` or similar, change it to just `public_html`

### Step 5: Clear Everything and Re-upload
If the above doesn't work:

1. **Delete everything in public_html**
2. **Upload only these 4 files from your dist folder:**
   - `index.html`
   - `assets/` (entire folder)
   - `favicon.svg`
   - `.htaccess`

3. **Set permissions:**
   - Files: `644`
   - Folders: `755`

### Step 6: Test Immediately
1. Clear your browser cache completely
2. Visit `https://upkar.org` in an incognito window
3. If still not working, try `https://upkar.org/index.html`

## Alternative Solutions

### Solution A: Rename index.html
Some servers expect different default files:
1. Try renaming `index.html` to `index.php`
2. Or create a simple `index.php` file:
```php
<?php include 'index.html'; ?>
```

### Solution B: Check cPanel Settings
1. Go to **Website** section in cPanel
2. Look for **Directory Privacy** or **Index Manager**
3. Ensure directory indexing is disabled
4. Set `index.html` as the default document

### Solution C: Contact Namecheap Support
If nothing works, contact Namecheap support and tell them:
- "My domain shows directory listing instead of serving index.html"
- "Please ensure mod_rewrite is enabled"
- "Please check if index.html is set as default document"

## Quick Diagnostic Commands
If you have SSH access, run these:
```bash
# Check if files exist
ls -la /home/yourusername/public_html/

# Check permissions
ls -la /home/yourusername/public_html/index.html

# Test if index.html is readable
cat /home/yourusername/public_html/index.html | head -10
```

## Most Likely Causes & Solutions

### Cause 1: Files in wrong location
**Fix:** Move all files directly to `public_html`, not in a subfolder

### Cause 2: No .htaccess file
**Fix:** Create the .htaccess file with DirectoryIndex directive

### Cause 3: Wrong file permissions
**Fix:** Set index.html to 644 permissions

### Cause 4: Domain misconfiguration
**Fix:** Ensure domain points to `public_html` not a subfolder

### Cause 5: Server configuration
**Fix:** Contact hosting support to enable proper settings

## Test Your Fix
After making changes:
1. Wait 2-3 minutes for changes to propagate
2. Clear browser cache completely
3. Test in incognito mode
4. Try different browsers
5. Test from mobile device

Your website should now load properly at upkar.org!