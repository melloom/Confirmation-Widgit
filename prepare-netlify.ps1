# PowerShell script for preparing Netlify deployment
# Run with: .\prepare-netlify.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Preparing files for Netlify deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Building Electron app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check errors above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating downloads folder..." -ForegroundColor Yellow
if (-not (Test-Path "website\downloads")) {
    New-Item -ItemType Directory -Path "website\downloads" | Out-Null
}

Write-Host ""
Write-Host "Step 3: Copying installer to website folder..." -ForegroundColor Yellow
if (Test-Path "dist\Long Home Confirmation Helper Setup.exe") {
    Copy-Item "dist\Long Home Confirmation Helper Setup.exe" "website\downloads\" -Force
    Write-Host "✓ Installer copied successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Installer not found! Please run 'npm run build' first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 4: Copying favicon..." -ForegroundColor Yellow
if (Test-Path "favicon.svg") {
    Copy-Item "favicon.svg" "website\" -Force
    Write-Host "✓ Favicon copied!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Ready for Netlify deployment!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://app.netlify.com/drop"
Write-Host "2. Drag the 'website' folder to the drop zone"
Write-Host "3. Your site will be live in seconds!"
Write-Host ""
Write-Host "OR use Git:" -ForegroundColor Yellow
Write-Host "1. Commit and push your changes"
Write-Host "2. Connect to Netlify via Git"
Write-Host "3. Set publish directory to 'website'"
Write-Host ""
Read-Host "Press Enter to exit"

