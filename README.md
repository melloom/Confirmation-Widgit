# Confirmation Widget - Electron App

A draggable widget application for appointment confirmation workflows. Helps confirmation team members guide through appointment confirmations step-by-step.

## Features

- **Draggable Widget**: Always-on-top, frameless window that can be moved around your screen
- **Confirmation Types**: Choose between "Bath" or "Bathroom" confirmation workflows
- **Step-by-Step Questions**: Guided question flow that helps confirm appointments
- **Progress Tracking**: Shows current question number and total questions
- **Completion Summary**: Displays confirmation details upon completion

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the App

```bash
npm start
```

## How to Use

1. **Select Confirmation Type**: Click either "Bath" or "Bathroom" button
2. **Answer Questions**: Fill in each question one at a time:
   - Appointment Date
   - Appointment Time
   - Client Name
   - Service Address
   - Contact Phone
   - Type of service (Bath type or Bathroom type)
   - Confirmation checkbox
3. **Complete**: Click "Complete" on the last question
4. **Review**: See the confirmation summary
5. **Start New**: Click "Start New Confirmation" to begin again

## Customization

You can customize the questions by editing the `questions` object in `renderer.js`:

```javascript
const questions = {
    bath: [
        // Add or modify questions here
    ],
    bathroom: [
        // Add or modify questions here
    ]
};
```

## Project Structure

- `main.js` - Electron main process (window creation)
- `index.html` - Main HTML structure
- `styles.css` - Widget styling
- `renderer.js` - Application logic and question flow

