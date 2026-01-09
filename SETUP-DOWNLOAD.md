# Setup Download System

## ✅ What's Been Set Up

1. **electron-builder** - Installed and configured
2. **Build Configuration** - Added to `package.json`
3. **Website Download Button** - Configured in `website/script.js`
4. **Build Scripts** - Ready to use

## 🚀 How to Build the App

### Step 1: Build the Installer
```bash
npm run build
```

This will create:
- **Installer**: `dist/Long Home Confirmation Helper Setup.exe` (NSIS installer with setup wizard)
- **Portable**: `dist/Long Home Confirmation Helper.exe` (portable version, no installation)

### Step 2: Test the Download
1. Build the app using `npm run build`
2. Open `website/index.html` in a browser
3. Click the download button
4. It should download the installer from `dist/` folder

## 📦 What Gets Built

- **Windows Installer (.exe)**: Full installer with setup wizard
  - Users can choose installation directory
  - Creates desktop shortcut
  - Creates start menu shortcut
  - Professional installer experience

- **Portable Version (.exe)**: Standalone executable
  - No installation needed
  - Can run from USB drive
  - Good for testing or temporary use

## 🌐 For Production/Website Hosting

When you're ready to host the download:

1. **Build the app**: `npm run build`
2. **Upload the installer** to your web server:
   - Upload `dist/Long Home Confirmation Helper Setup.exe` to your server
   - Example: `https://yourdomain.com/downloads/Long Home Confirmation Helper Setup.exe`
3. **Update the download URL** in `website/script.js`:
   ```javascript
   const downloadUrl = 'https://yourdomain.com/downloads/Long Home Confirmation Helper Setup.exe';
   ```

## 📝 Build Commands

- `npm run build` - Build for current platform (Windows)
- `npm run build:win` - Build specifically for Windows
- `npm run dist` - Build without publishing

## ⚙️ Build Configuration

The build is configured in `package.json` under the `"build"` section:
- App ID: `com.longhome.confirmation-helper`
- Product Name: `Long Home Confirmation Helper`
- Output: `dist/` folder
- Icon: Uses `icon.png`
- Creates both installer and portable versions

## 🎯 Next Steps

1. Run `npm run build` to create the installer
2. Test the download button on the website
3. When ready, upload to your hosting and update the URL

The download system is now fully set up! 🎉

