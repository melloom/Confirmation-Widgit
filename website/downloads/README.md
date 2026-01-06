# Downloads Folder

This folder should contain the installer file for download.

## Setup Instructions

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Copy the installer:**
   - Copy `dist/Long Home Confirmation Helper Setup.exe` 
   - Paste it into this `downloads/` folder
   - The file should be named: `Long Home Confirmation Helper Setup.exe`

3. **Deploy to Netlify:**
   - The file will be automatically available at: `/downloads/Long Home Confirmation Helper Setup.exe`
   - Users can download it from the website

## File Structure

```
website/
  downloads/
    Long Home Confirmation Helper Setup.exe  ← Place the installer here
    README.md  ← This file
```

## Note

The download button on the website will check if this file exists. If it's not found, users will see a helpful error message with these instructions.

