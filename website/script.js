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
        
        // Create download link
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Trigger download
        setTimeout(() => {
            try {
                link.click();
                downloadBtn.innerHTML = '<span class="download-icon">✓</span><span>Download Started!</span>';
                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.style.opacity = '1';
                }, 2000);
            } catch (error) {
                // If download fails, try opening in new window
                window.open(downloadUrl, '_blank');
                downloadBtn.innerHTML = '<span class="download-icon">↗</span><span>Opening Download...</span>';
                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.style.opacity = '1';
                }, 2000);
            }
            document.body.removeChild(link);
        }, 100);
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
