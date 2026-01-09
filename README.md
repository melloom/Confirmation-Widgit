# Long Home Confirmation Helper

A polished desktop widget application that guides you through appointment confirmation calls step-by-step. Built for call center teams who need clarity, speed, and consistency on every confirmation call.

🌐 **Live Website**: [https://quickconfirm.netlify.app/](https://quickconfirm.netlify.app/)

## Features

- **Step-by-Step Guidance**: Never miss a detail. Follow a structured script that adapts based on customer responses
- **Smart Time Detection**: Automatically detects time of day for appropriate greetings and filters available appointment slots
- **Always on Top**: Floating widget stays visible during calls. No switching apps, no losing your place
- **Ready-to-Send Scripts**: Copy a complete, formatted confirmation script when you're done. No manual formatting needed
- **Product-Specific Flows**: Tailored scripts for Roof and Bath confirmations. Each flow optimized for its product line
- **Cancellation Retention**: Built-in retention scripts for handling cancellations with smart discount offers
- **Remembers Your Name**: Enter your name once. It's saved for all future calls, keeping your workflow smooth
- **Draggable Widget**: Always-on-top, frameless window that can be moved around your screen

## Download

### Windows
- **Installer**: Download from [Live Site](https://quickconfirm.netlify.app/) or from `website/downloads/` folder
- **Portable**: No installation required, runs directly from the executable

### Mac
- **DMG**: Available via GitHub Releases (links to releases from the live site)

Visit the [live website](https://quickconfirm.netlify.app/) to download the latest version for your platform.

## Installation

### For Development

1. Clone the repository:
```bash
git clone https://github.com/melloom/Confirmation-Widgit.git
cd Confirmation-Widgit
```

2. Install dependencies:
```bash
npm install
```

3. Run the app:
```bash
npm start
```

## Building

### Build for Windows
```bash
npm run build:win
```

### Build for Mac
```bash
npm run build:mac
```

### Build for Both Platforms
```bash
npm run build:all
```

Built files will be in the `dist/` folder.

## How to Use

1. **Select Confirmation Type**: Choose "Roof Confirmation" or "Bath Confirmation"
2. **Enter Appointment Details**: Select date and time from quick-pick options
3. **Follow the Script**: Step through each prompt, answering questions as needed
4. **Handle Responses**: 
   - Spouse/companion questions
   - Cancellation retention flows (if needed)
   - Decision-maker confirmations
5. **Complete**: Get a ready-to-copy confirmation script
6. **Start New**: Begin a new confirmation call

## Confirmation Flows

### Standard Confirmation
- Opening greeting (time-based)
- Date & time confirmation
- Address verification
- Time commitment explanation
- Spouse/companion check
- Decision-makers confirmation
- Final confirmation
- Contact information
- Closing statement
- Vacation promo (optional)

### Cancellation Retention
- Empathetic opening
- Reason identification (sick, bad time, not interested)
- Smart discount offers (50% off, free installation, etc.)
- Flexible rescheduling options
- Urgency and value reinforcement
- Strong closing

## Project Structure

```
├── main.js              # Electron main process (window creation)
├── index.html           # Main HTML structure
├── renderer.js          # Application logic and script flows
├── styles.css           # Widget styling
├── package.json         # Dependencies and build config
├── website/             # Download website
│   ├── index.html       # Landing page
│   ├── script.js        # Download logic
│   ├── downloads/       # Windows builds
│   └── ...
└── dist/                # Build output
```

## Customization

You can customize the confirmation scripts by editing the `getScriptPrompts()` function in `renderer.js`:

```javascript
function getScriptPrompts() {
    // Customize roof, bath, and cancellation prompts
    return {
        roof: [...],
        bath: [...],
        cancellation: [...]
    };
}
```

## System Requirements

- **Windows**: Windows 10 or later
- **Mac**: macOS 10.12 or later
- **Disk Space**: ~50 MB
- **Internet**: Required for initial download only

## Technologies

- **Electron**: Desktop application framework
- **Node.js**: Runtime environment
- **HTML/CSS/JavaScript**: Frontend

## License

MIT

## Links

- 🌐 **Live Website**: [https://quickconfirm.netlify.app/](https://quickconfirm.netlify.app/)
- 📦 **GitHub Repository**: [https://github.com/melloom/Confirmation-Widgit](https://github.com/melloom/Confirmation-Widgit)
- 📥 **Releases**: [GitHub Releases](https://github.com/melloom/Confirmation-Widgit/releases)

## Author

Long Home

---

© 2024 Long Home. All rights reserved.
