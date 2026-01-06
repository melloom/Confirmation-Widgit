// Download button functionality
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Download URL - update this to your hosted file location
        // For local testing: '../dist/Long Home Confirmation Helper Setup.exe'
        // For Netlify production: '/downloads/Long Home Confirmation Helper Setup.exe'
        // For custom domain: 'https://yourdomain.com/downloads/Long Home Confirmation Helper Setup.exe'
        const downloadUrl = '/downloads/Long Home Confirmation Helper Setup.exe';
        const fileName = 'Long Home Confirmation Helper Setup.exe';
        
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<span class="download-icon">⬇</span><span>Starting Download...</span>';
        downloadBtn.style.opacity = '0.8';
        downloadBtn.style.pointerEvents = 'none';
        
        // Check if file exists first
        fetch(downloadUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // File exists, proceed with download
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = fileName;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    downloadBtn.innerHTML = '<span class="download-icon">✓</span><span>Download Started!</span>';
                    setTimeout(() => {
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.style.opacity = '1';
                        downloadBtn.style.pointerEvents = 'auto';
                    }, 2000);
                } else {
                    // File doesn't exist
                    throw new Error('File not found');
                }
            })
            .catch(error => {
                // File not available - show helpful message
                downloadBtn.innerHTML = '<span class="download-icon">⚠</span><span>File Not Available</span>';
                downloadBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                
                // Show alert with instructions
                setTimeout(() => {
                    alert('The installer file is not yet available on the server.\n\nTo make it available:\n1. Build the app using: npm run build\n2. Copy the file from dist/ folder to website/downloads/ folder\n3. Deploy to Netlify');
                    
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.style.opacity = '1';
                    downloadBtn.style.pointerEvents = 'auto';
                    downloadBtn.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
                }, 500);
            });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
