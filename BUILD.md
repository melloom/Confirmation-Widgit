# Building the Long Home Confirmation Helper

## Prerequisites
- Node.js installed
- npm installed

## Building the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Windows
```bash
npm run build
```

This will create:
- **Installer**: `dist/Long Home Confirmation Helper Setup.exe` (NSIS installer)
- **Portable**: `dist/Long Home Confirmation Helper.exe` (portable version, no installation needed)

### 3. Build Options

**Windows Installer (Recommended):**
```bash
npm run build:win
```

**Development Build:**
```bash
npm run dist
```

## Output Location
All built files will be in the `dist/` folder.

## For Distribution

1. Build the app using `npm run build`
2. Upload the installer file (`Long Home Confirmation Helper Setup.exe`) to your hosting/server
3. Update the download URL in `website/script.js` to point to your hosted file
4. The website download button will then work for users

## Notes
- The installer includes all dependencies and doesn't require Node.js on the user's machine
- The portable version can run directly without installation
- Both versions are 64-bit Windows executables

