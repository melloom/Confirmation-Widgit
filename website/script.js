// Download button functionality
document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadBtn2 = document.getElementById('downloadBtn2');
    
    // Detect OS
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
                  navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
    const isWindows = navigator.platform.toUpperCase().indexOf('WIN') >= 0 || 
                      navigator.userAgent.toUpperCase().indexOf('WIN') >= 0;
    
    // GitHub release URLs
    const githubBaseUrl = 'https://github.com/melloom/Confirmation-Widgit/releases/download/V1.0.0';
    const macDownloadUrl = `${githubBaseUrl}/Long.Home.Confirmation.Helper.dmg`;
    const windowsSetupUrl = `${githubBaseUrl}/Long.Home.Confirmation.Helper.Setup.exe`;
    const windowsPortableUrl = `${githubBaseUrl}/Long.Home.Confirmation.Helper.exe`;
    
    // Local download URLs (Windows only)
    const localWindowsSetupUrl = '/downloads/Long Home Confirmation Helper Setup.exe';
    const localWindowsPortableUrl = '/downloads/Long Home Confirmation Helper.exe';
    
    // Determine download URLs and file names based on OS
    let primaryUrl, fallbackUrl, fileName, osName;
    
    if (isMac) {
        primaryUrl = macDownloadUrl;
        fileName = 'Long Home Confirmation Helper.dmg';
        osName = 'Mac';
    } else if (isWindows) {
        // Windows: try local first, then GitHub
        primaryUrl = localWindowsSetupUrl;
        fallbackUrl = windowsSetupUrl;
        fileName = 'Long Home Confirmation Helper Setup.exe';
        osName = 'Windows';
    } else {
        // Default to Windows for unknown OS
        primaryUrl = localWindowsSetupUrl;
        fallbackUrl = windowsSetupUrl;
        fileName = 'Long Home Confirmation Helper Setup.exe';
        osName = 'Windows';
    }
    
    function downloadFile(url, filename) {
        return new Promise((resolve, reject) => {
            // For external URLs (GitHub), use direct download
            if (url.startsWith('http://') || url.startsWith('https://')) {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                resolve();
            } else {
                // For local files, check if exists first
                fetch(url, { method: 'HEAD' })
                    .then(response => {
                        if (response.ok) {
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = filename;
                            link.style.display = 'none';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            resolve();
                        } else {
                            reject(new Error('File not found'));
                        }
                    })
                    .catch(reject);
            }
        });
    }
    
    function handleDownload(e) {
        e.preventDefault();
        
        const button = e.currentTarget;
        const originalHTML = button.innerHTML;
        
        // Update button state
        button.innerHTML = `
            <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Starting Download...</span>
        `;
        button.style.opacity = '0.8';
        button.style.pointerEvents = 'none';
        
        // Try primary URL first, then fallback if available
        downloadFile(primaryUrl, fileName)
            .then(() => {
                // Success
                button.innerHTML = `
                    <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Download Started!</span>
                `;
                button.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.opacity = '1';
                    button.style.pointerEvents = 'auto';
                    button.style.background = '';
                }, 2500);
            })
            .catch(() => {
                // Primary failed, try fallback if available
                if (fallbackUrl) {
                    return downloadFile(fallbackUrl, fileName);
                } else {
                    throw new Error('No fallback available');
                }
            })
            .then(() => {
                // Fallback succeeded
                button.innerHTML = `
                    <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Download Started!</span>
                `;
                button.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.opacity = '1';
                    button.style.pointerEvents = 'auto';
                    button.style.background = '';
                }, 2500);
            })
            .catch(error => {
                // Both failed - show error message
                button.innerHTML = `
                    <svg class="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>Download Failed</span>
                `;
                button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.opacity = '1';
                    button.style.pointerEvents = 'auto';
                    button.style.background = '';
                }, 3000);
            });
    }
    
    // Update button text based on OS
    function updateButtonText(button) {
        if (button) {
            const span = button.querySelector('span');
            if (span) {
                if (isMac) {
                    span.textContent = 'Download for Mac';
                } else {
                    span.textContent = 'Download for Windows';
                }
            }
        }
    }
    
    if (downloadBtn) {
        updateButtonText(downloadBtn);
        downloadBtn.addEventListener('click', handleDownload);
    }
    
    if (downloadBtn2) {
        updateButtonText(downloadBtn2);
        downloadBtn2.addEventListener('click', handleDownload);
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Skip empty anchors
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and download card
    document.querySelectorAll('.feature-card, .download-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
