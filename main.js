const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Disable hardware acceleration to fix GPU process errors on Windows
app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, 'icon.png');
  const iconExists = require('fs').existsSync(iconPath);
  
  const windowOptions = {
    width: 400,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false
    }
  };
  
  // Only set icon if it exists
  if (iconExists) {
    windowOptions.icon = iconPath;
  }
  
  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadFile('index.html');

  // Make window draggable
  mainWindow.setMovable(true);

  // Ensure app quits when window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window close attempt
  mainWindow.on('close', (event) => {
    // Force quit on Windows
    if (process.platform !== 'darwin') {
      app.exit(0);
    }
  });

  // Open DevTools for debugging (so you can see console logs)
  mainWindow.webContents.openDevTools();
}

// Handle window close from renderer
ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
  // Force exit
  app.exit(0);
});

// Handle window minimize from renderer
ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Force exit on Windows to ensure process terminates
  if (process.platform !== 'darwin') {
    app.exit(0);
  } else {
    app.quit();
  }
});

// Ensure app exits when quitting
app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.removeAllListeners('close');
  }
});

// Force exit on any uncaught errors
process.on('SIGTERM', () => {
  app.exit(0);
});

process.on('SIGINT', () => {
  app.exit(0);
});

