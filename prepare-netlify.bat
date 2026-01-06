@echo off
echo ========================================
echo Preparing files for Netlify deployment
echo ========================================
echo.

echo Step 1: Building Electron app...
call npm run build
if errorlevel 1 (
    echo Build failed! Please check errors above.
    pause
    exit /b 1
)

echo.
echo Step 2: Creating downloads folder...
if not exist "website\downloads" mkdir "website\downloads"

echo.
echo Step 3: Copying installer to website folder...
if exist "dist\Long Home Confirmation Helper Setup.exe" (
    copy "dist\Long Home Confirmation Helper Setup.exe" "website\downloads\" >nul
    echo ✓ Installer copied successfully!
) else (
    echo ✗ Installer not found! Please run 'npm run build' first.
    pause
    exit /b 1
)

echo.
echo Step 4: Copying favicon...
if exist "favicon.svg" (
    copy "favicon.svg" "website\" >nul
    echo ✓ Favicon copied!
)

echo.
echo ========================================
echo ✓ Ready for Netlify deployment!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://app.netlify.com/drop
echo 2. Drag the 'website' folder to the drop zone
echo 3. Your site will be live in seconds!
echo.
echo OR use Git:
echo 1. Commit and push your changes
echo 2. Connect to Netlify via Git
echo 3. Set publish directory to 'website'
echo.
pause

