# Website Deployment Guide

## For Netlify Deployment

### Quick Start:

1. **Build the Electron app:**
   ```bash
   npm run build
   ```

2. **Copy installer to website folder:**
   ```bash
   mkdir website\downloads
   copy "dist\Long Home Confirmation Helper Setup.exe" website\downloads\
   ```

3. **Deploy to Netlify:**
   - Option A: Drag `website` folder to https://app.netlify.com/drop
   - Option B: Connect Git repository and deploy automatically

### File Structure for Netlify:
```
website/
├── index.html
├── styles.css
├── script.js
├── downloads/
│   └── Long Home Confirmation Helper Setup.exe
└── README.md
```

### Important Notes:
- The installer file must be in `website/downloads/` folder
- The download URL in `script.js` is set to `/downloads/Long Home Confirmation Helper Setup.exe`
- Netlify will serve files from the `website` folder as the root

