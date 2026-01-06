# Deploying to Netlify - Step by Step Guide

## 📋 Prerequisites
- Netlify account (free at netlify.com)
- Git repository (GitHub, GitLab, or Bitbucket) - OR use Netlify Drop
- Built Electron app installer

---

## Step 1: Build Your Electron App

1. **Open terminal in your project folder**
2. **Build the installer:**
   ```bash
   npm run build
   ```
3. **Wait for build to complete** - This creates files in the `dist/` folder
4. **Verify the installer exists:**
   - Check that `dist/Long Home Confirmation Helper Setup.exe` exists

---

## Step 2: Prepare Files for Netlify

### Option A: Using Netlify Drop (Easiest - No Git Required)

1. **Create a deployment folder:**
   ```bash
   mkdir netlify-deploy
   ```

2. **Copy website files:**
   ```bash
   copy website\* netlify-deploy\
   ```

3. **Copy the built installer:**
   ```bash
   copy "dist\Long Home Confirmation Helper Setup.exe" netlify-deploy\downloads\
   ```
   (Create `downloads` folder first if it doesn't exist)

4. **Copy favicon:**
   ```bash
   copy favicon.svg netlify-deploy\
   ```

### Option B: Using Git (Recommended for Updates)

1. **Create a `netlify.toml` file** (see below)
2. **Update `website/script.js`** with production URL
3. **Commit and push to your Git repository**

---

## Step 3: Create Netlify Configuration

Create a file called `netlify.toml` in your project root:

```toml
[build]
  publish = "website"
  command = "npm run build"

[[redirects]]
  from = "/download"
  to = "/downloads/Long Home Confirmation Helper Setup.exe"
  status = 200
  force = true

[[headers]]
  for = "/downloads/*.exe"
  [headers.values]
    Content-Type = "application/octet-stream"
    Content-Disposition = "attachment"
```

---

## Step 4: Update Website Download Script

Update `website/script.js`:

```javascript
// Change this line:
const downloadUrl = '../dist/Long Home Confirmation Helper Setup.exe';

// To this (for Netlify):
const downloadUrl = '/downloads/Long Home Confirmation Helper Setup.exe';
```

---

## Step 5: Deploy to Netlify

### Method 1: Netlify Drop (Drag & Drop)

1. **Go to:** https://app.netlify.com/drop
2. **Drag your `netlify-deploy` folder** (or `website` folder with downloads subfolder) to the drop zone
3. **Wait for upload** - Netlify will give you a URL
4. **Your site is live!** 🎉

### Method 2: Git Integration (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Go to:** https://app.netlify.com
3. **Click "Add new site" → "Import an existing project"**
4. **Connect your Git provider** (GitHub, etc.)
5. **Select your repository**
6. **Configure build settings:**
   - Build command: `npm run build` (optional, or leave blank)
   - Publish directory: `website`
7. **Click "Deploy site"**
8. **Wait for deployment** - Usually takes 1-2 minutes

---

## Step 6: Upload the Installer File

### If using Netlify Drop:
- The installer should already be in your upload folder

### If using Git:
1. **Go to your Netlify site dashboard**
2. **Click "Site settings" → "File browser"**
3. **Navigate to your site folder**
4. **Create a `downloads` folder** (if it doesn't exist)
5. **Upload `Long Home Confirmation Helper Setup.exe`** to the downloads folder
   - OR use Netlify CLI (see below)

### Using Netlify CLI (Alternative):

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Link your site:**
   ```bash
   netlify link
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

5. **Upload installer manually:**
   ```bash
   netlify deploy --prod --dir=website
   ```
   Then upload the installer through the dashboard

---

## Step 7: Update Download URL (If Needed)

1. **Go to your Netlify site dashboard**
2. **Click "Site settings" → "Domain management"**
3. **Note your site URL** (e.g., `your-site.netlify.app`)
4. **Update `website/script.js`** if you want absolute URL:
   ```javascript
   const downloadUrl = 'https://your-site.netlify.app/downloads/Long Home Confirmation Helper Setup.exe';
   ```
5. **Redeploy** (if using Git, push changes; if using Drop, re-upload)

---

## Step 8: Test the Download

1. **Visit your Netlify site**
2. **Click the download button**
3. **Verify the installer downloads**
4. **Test installing the app** on a Windows machine

---

## 🔄 Updating the App

### When you update the Electron app:

1. **Rebuild:**
   ```bash
   npm run build
   ```

2. **Upload new installer:**
   - **Netlify Drop:** Replace the file in your folder and re-upload
   - **Git:** Replace `website/downloads/Long Home Confirmation Helper Setup.exe` and push
   - **Netlify Dashboard:** Upload new file through file browser

3. **Redeploy** (if needed)

---

## 📝 Quick Checklist

- [ ] Built the app (`npm run build`)
- [ ] Created `netlify.toml` (if using Git)
- [ ] Updated `website/script.js` download URL
- [ ] Uploaded installer to Netlify
- [ ] Tested download button
- [ ] Verified installer works

---

## 🆘 Troubleshooting

**Download button doesn't work:**
- Check file path in `website/script.js`
- Verify installer is in `downloads/` folder
- Check Netlify file browser to confirm file exists

**File not found error:**
- Make sure installer is uploaded to Netlify
- Check file name matches exactly (case-sensitive)
- Verify path in script matches folder structure

**Build fails:**
- Make sure `website` folder exists
- Check `netlify.toml` configuration
- Verify all files are committed (if using Git)

---

## 🎉 You're Done!

Your landing page is now live on Netlify and users can download your app!

