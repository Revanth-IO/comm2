# Complete cPanel Reset and Clean Deployment Guide

## Step 1: Backup Important Data (If Any)
Before resetting, backup any important files:
1. Log into cPanel
2. Go to **File Manager**
3. Download any important files you want to keep
4. Go to **MySQL Databases** and export any databases you need

## Step 2: Clean Public_HTML Directory
1. In cPanel, go to **File Manager**
2. Navigate to `public_html` folder
3. **Select All Files** (Ctrl+A or Cmd+A)
4. Click **Delete** to remove everything
5. Confirm deletion

## Step 3: Clean Up Databases (If Any)
1. Go to **MySQL Databases** in cPanel
2. Delete any old databases you don't need
3. Remove associated database users

## Step 4: Clear Cache and Temporary Files
1. In File Manager, go to the root directory (above public_html)
2. Look for folders like:
   - `tmp/`
   - `cache/`
   - `.htaccess` files outside public_html
3. Delete these if they exist and aren't needed

## Step 5: Reset File Permissions
1. In File Manager, right-click on `public_html`
2. Select **Change Permissions**
3. Set to `755` for directories
4. Set to `644` for files

## Step 6: Upload Fresh Website Files
1. In File Manager, navigate to `public_html`
2. Click **Upload**
3. Upload ALL files from your `dist` folder:
   - `index.html`
   - `assets/` folder (with all JS/CSS files)
   - `favicon.svg`
   - `robots.txt`
   - `sitemap.xml`
   - `.htaccess`

## Step 7: Verify File Structure
Your `public_html` should look like this:
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── .htaccess
```

## Step 8: Set Correct Permissions
1. Select all uploaded files
2. Right-click → **Change Permissions**
3. Set permissions:
   - Folders: `755`
   - Files: `644`
   - `.htaccess`: `644`

## Step 9: Clear Browser Cache
1. Clear your browser cache completely
2. Try accessing your site in an incognito/private window
3. Test on different devices/browsers

## Step 10: Domain Configuration Check
1. In cPanel, go to **Subdomains** or **Addon Domains**
2. Ensure your domain points to `public_html`
3. Check **DNS Zone Editor** if needed

## Step 11: SSL Certificate
1. Go to **SSL/TLS** in cPanel
2. Ensure SSL is enabled for your domain
3. Force HTTPS redirect (usually automatic)

## Troubleshooting Common Issues

### Issue: "Nothing is happening" / Blank page
**Solutions:**
1. Check browser console for errors (F12)
2. Verify all files uploaded correctly
3. Check file permissions
4. Clear browser cache completely

### Issue: 404 Errors
**Solutions:**
1. Ensure `.htaccess` file is uploaded
2. Check if mod_rewrite is enabled (contact hosting support)
3. Verify index.html is in public_html root

### Issue: CSS/JS not loading
**Solutions:**
1. Check file permissions (should be 644)
2. Verify assets folder uploaded completely
3. Check .htaccess for compression settings

### Issue: Images not loading
**Solutions:**
1. Check if images are external URLs (Pexels links)
2. Verify internet connection on server
3. Check browser console for blocked requests

## Step 12: Test Everything
1. Visit your domain: `https://upkar.org`
2. Test all navigation links
3. Try the sign-in functionality
4. Test responsive design on mobile
5. Check page load speed

## Step 13: Monitor and Verify
1. Use Google PageSpeed Insights to test performance
2. Check Google Search Console for crawl errors
3. Verify SSL certificate is working
4. Test from different locations/devices

## Emergency Reset Commands (If File Manager Fails)
If you have SSH access, you can use these commands:
```bash
# Navigate to public_html
cd public_html

# Remove all files and folders
rm -rf *
rm -rf .*

# Verify it's empty
ls -la
```

## Contact Support
If issues persist:
1. Contact Namecheap support
2. Mention you need help with:
   - mod_rewrite enabled
   - PHP version (if applicable)
   - File permissions
   - SSL certificate

## Final Checklist
- [ ] public_html completely cleared
- [ ] All dist files uploaded
- [ ] File permissions set correctly
- [ ] .htaccess file present
- [ ] SSL certificate active
- [ ] Domain pointing to public_html
- [ ] Browser cache cleared
- [ ] Site loads without errors
- [ ] All features working