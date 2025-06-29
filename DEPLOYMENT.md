# Upkar Website Deployment Guide

## Namecheap Deployment Instructions

### 1. Build the Project
```bash
npm run build:production
```

### 2. Upload Files
1. Log into your Namecheap cPanel
2. Go to File Manager
3. Navigate to `public_html` directory
4. Upload all files from the `dist` folder to `public_html`
5. Ensure the `.htaccess` file is uploaded (it handles routing and security)

### 3. Domain Configuration
- Ensure your domain `upkar.org` points to your Namecheap hosting
- SSL certificate should be enabled (usually automatic with Namecheap)

### 4. Environment Variables
1. Create a `.env` file in your hosting root with production values:
```
VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id
VITE_API_URL=https://api.upkar.org
VITE_SITE_URL=https://upkar.org
VITE_ENVIRONMENT=production
```

### 5. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create/select your project
3. Enable Google Identity Services API
4. Create OAuth 2.0 Client ID credentials
5. Add authorized origins:
   - `https://upkar.org`
   - `https://www.upkar.org` (if using www)
6. Add authorized redirect URIs:
   - `https://upkar.org`
   - `https://www.upkar.org`
7. Copy the Client ID to your `.env` file

### 6. Analytics Setup (Optional)
1. Create a Google Analytics 4 property
2. Replace `G-XXXXXXXXXX` in `src/utils/analytics.ts` with your tracking ID
3. Rebuild and redeploy

### 7. Performance Optimization
The site is already optimized with:
- ✅ Gzip compression
- ✅ Browser caching
- ✅ Image optimization
- ✅ Code splitting
- ✅ Minification
- ✅ SEO meta tags
- ✅ Structured data
- ✅ Security headers

### 8. Post-Deployment Checklist
- [ ] Test all pages load correctly
- [ ] Verify SSL certificate is working
- [ ] Check Google OAuth login functionality
- [ ] Test responsive design on mobile devices
- [ ] Verify all images load properly
- [ ] Test form submissions
- [ ] Check site speed with Google PageSpeed Insights
- [ ] Submit sitemap to Google Search Console

### 9. Monitoring
- Set up Google Search Console for SEO monitoring
- Monitor site performance with Google Analytics
- Set up uptime monitoring (optional)

### 10. Maintenance
- Regularly update dependencies
- Monitor for security updates
- Backup your site regularly
- Update content and events regularly

## File Structure After Build
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
├── .htaccess
└── og-image.jpg (add your own)
```

## Support
For technical issues, contact: support@upkar.org