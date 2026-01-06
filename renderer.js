const { ipcRenderer } = require('electron');

// Helper function to format date
function formatDateForScript(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${dayName}, ${month} ${day}`;
}

function formatTimeForScript(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Helper function to get time-based greeting
function getTimeBasedGreeting() {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
        return 'morning';
    } else if (hour < 17) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}

// Helper function to get full greeting phrase
function getFullGreeting() {
    const greeting = getTimeBasedGreeting();
    return `Good ${greeting}`;
}

// Helper function to get decision makers text based on spouse status
function getDecisionMakersText(hasSpouse, time) {
    if (hasSpouse === true) {
        return `"We truly value your time, and we ask that you do the same for this visit. This complimentary estimate is reserved specifically for you, and our specialist will need all homeowners and decision-makers present to properly review your wants, needs, and pricing options. Can I confirm that you and [Name from Salesforce] will both be home and available at ${time} for the full 60-90 minutes?"`;
    } else if (hasSpouse === false) {
        return `"We truly value your time, and we ask that you do the same for this visit. This complimentary estimate is reserved specifically for you, and our specialist will need you present to properly review your wants, needs, and pricing options. Can I confirm that you will be home and available at ${time} for the full 60-90 minutes?"`;
    } else {
        // Default text if not asked yet
        return `"We truly value your time, and we ask that you do the same for this visit. This complimentary estimate is reserved specifically for you, and our specialist will need all homeowners and decision-makers present to properly review your wants, needs, and pricing options. Can I confirm that you and [Name from Salesforce] will both be home and available at ${time} for the full 60-90 minutes?"`;
    }
}

// Confirmation script prompts/questions to ask - using function to get dynamic data
function getScriptPrompts() {
    const date = formatDateForScript(appointmentData.date);
    const time = formatTimeForScript(appointmentData.time);
    const confirmerName = getSavedConfirmerName() || '[Your Name]';
    const greeting = getTimeBasedGreeting();
    
    // Get decision makers text based on spouse status
    const decisionMakersText = getDecisionMakersText(appointmentData.hasSpouse, time);
    
    return {
        roof: [
            { 
                id: 'greeting', 
                title: 'STEP 1: OPENING GREETING',
                text: `"${getFullGreeting()}, this is ${confirmerName} with Long Home on a recorded line. I'm calling to confirm your appt..."`
            },
            { 
                id: 'confirmDateTime', 
                title: 'STEP 2: CONFIRM DATE & TIME',
                text: `"I'm calling to confirm your appt on ${date} at ${time} for your free estimate on replacing your roof. Does that work for you?"`
            },
            { 
                id: 'confirmAddress', 
                title: 'STEP 3: CONFIRM THE ADDRESS',
                text: '"Our Product Specialist will be making a special trip out to your home at [Address from Salesforce]. Please confirm this is the correct address."'
            },
            { 
                id: 'timeCommitment', 
                title: 'STEP 4: EXPLAIN TIME COMMITMENT',
                text: '"The appointment takes about 60 to 90 minutes, which allows us time to show samples, answer your questions, and provide personalized recommendations for your roof replacement."'
            },
            { 
                id: 'spouseCheck', 
                title: 'STEP 5: CHECK FOR SPOUSE/COMPANION',
                text: 'Ask: "Is there a spouse or companion who will also be involved in making decisions about this project?"'
            },
            { 
                id: 'decisionMakers', 
                title: 'STEP 6: CONFIRM DECISION-MAKERS',
                text: decisionMakersText
            },
            { 
                id: 'finalConfirmation', 
                title: 'STEP 7: FINAL CONFIRMATION',
                text: `"Can I count on you, and everyone involved, to be available at ${time} on ${date} for the full 60 to 90 minutes? Our specialist is dedicating their time specifically to your project, so it's very important that everyone is present."`
            },
            { 
                id: 'contactInfo', 
                title: 'STEP 8: PROVIDE CONTACT INFO',
                text: '"If anything changes or you need to reach us before the appointment, please call 1-800-518-7218 as soon as possible. We want to make sure our specialist\'s time is respected, just as we\'re respecting yours."'
            },
            { 
                id: 'closing', 
                title: 'STEP 9: CLOSING STATEMENT',
                text: `"Perfect! Now that you're all confirmed, the next point of contact will be our Product Specialist at your door on ${date} at ${time} to assist you with your roof replacement needs. Thanks for considering Long Home, and have a great ${getTimeBasedGreeting()}!"`
            },
            { 
                id: 'vacationPromo', 
                title: 'STEP 10: VACATION PROMO (Optional)',
                text: `"We have even more great news for you! When you move forward with your roof replacement project, you'll also receive a vacation package — just our way of saying thank you for choosing Long Home. Be sure to ask your Product Specialist for all the details when they visit your home on ${date}."`
            }
        ],
    bath: [
            { 
                id: 'greeting', 
                title: 'STEP 1: OPENING GREETING',
                text: `"${getFullGreeting()}, this is ${confirmerName} with Long Home on a recorded line. I'm calling to confirm your appt..."`
            },
            { 
                id: 'confirmDateTime', 
                title: 'STEP 2: CONFIRM DATE & TIME',
                text: `"I'm calling to confirm your appt on ${date} at ${time} for your free estimate on replacing your bath. Does that work for you?"`
            },
            { 
                id: 'confirmAddress', 
                title: 'STEP 3: CONFIRM THE ADDRESS',
                text: '"Our Product Specialist will be making a special trip out to your home at [Address from Salesforce]. Please confirm this is the correct address."'
            },
            { 
                id: 'timeCommitment', 
                title: 'STEP 4: EXPLAIN TIME COMMITMENT',
                text: '"The appointment takes about 60 to 90 minutes, which allows us time to show samples, answer your questions, and provide personalized recommendations for your bath replacement."'
            },
            { 
                id: 'spouseCheck', 
                title: 'STEP 5: CHECK FOR SPOUSE/COMPANION',
                text: 'Ask: "Is there a spouse or companion who will also be involved in making decisions about this project?"'
            },
            { 
                id: 'decisionMakers', 
                title: 'STEP 6: CONFIRM DECISION-MAKERS',
                text: decisionMakersText
            },
            { 
                id: 'finalConfirmation', 
                title: 'STEP 7: FINAL CONFIRMATION',
                text: `"Can I count on you, and everyone involved, to be available at ${time} on ${date} for the full 60 to 90 minutes? Our specialist is dedicating their time specifically to your project, so it's very important that everyone is present."`
            },
            { 
                id: 'contactInfo', 
                title: 'STEP 8: PROVIDE CONTACT INFO',
                text: '"If anything changes or you need to reach us before the appointment, please call 1-800-518-7218 as soon as possible. We want to make sure our specialist\'s time is respected, just as we\'re respecting yours."'
            },
            { 
                id: 'closing', 
                title: 'STEP 9: CLOSING STATEMENT',
                text: `"Perfect! Now that you're all confirmed, the next point of contact will be our Product Specialist at your door on ${date} at ${time} to assist you with your bath replacement needs. Thanks for considering Long Home, and have a great ${getTimeBasedGreeting()}!"`
            },
            { 
                id: 'vacationPromo', 
                title: 'STEP 10: VACATION PROMO (Optional)',
                text: `"We have even more great news for you! When you move forward with your bath replacement project, you'll also receive a vacation package — just our way of saying thank you for choosing Long Home. Be sure to ask your Product Specialist for all the details when they visit your home on ${date}."`
            }
        ]
    };
}

let currentStep = 1;
let currentType = null;
let currentPromptIndex = 0;
let completedPrompts = {};
let appointmentData = {
    date: '',
    time: '',
    hasSpouse: null // null = not asked yet, true = yes, false = no
};

// Functions to save/load confirmer name
function getSavedConfirmerName() {
    return localStorage.getItem('confirmerName') || '';
}

function saveConfirmerName(name) {
    if (name && name.trim() !== '') {
        localStorage.setItem('confirmerName', name.trim());
    }
}

// DOM elements
const step1 = document.getElementById('step1');
const step1_5 = document.getElementById('step1_5');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');
const questionContainer = document.getElementById('questionContainer');
const dataEntryContainer = document.getElementById('dataEntryContainer');
const nextBtn = document.getElementById('nextBtn');
const startScriptBtn = document.getElementById('startScriptBtn');
const restartBtn = document.getElementById('restartBtn');
const viewScriptBtn = document.getElementById('viewScriptBtn');
const backToSummaryBtn = document.getElementById('backToSummaryBtn');
const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const completionText = document.getElementById('completionText');
const scriptText = document.getElementById('scriptText');

// Confirmation type buttons - use event delegation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('confirmation-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const type = e.target.getAttribute('data-type');
        console.log('Button clicked, type:', type);
        if (type && (type === 'roof' || type === 'bath')) {
            currentType = type;
            console.log('Starting flow for:', currentType);
            showDataEntry();
        }
    }
});

// Start script button
if (startScriptBtn) {
    startScriptBtn.addEventListener('click', () => {
        if (validateDataEntry()) {
            step1_5.classList.add('hidden');
            step2.classList.remove('hidden');
            currentPromptIndex = 0;
            completedPrompts = {};
            showPrompt();
        }
    });
}

// Next button
nextBtn.addEventListener('click', () => {
    const scriptPrompts = getScriptPrompts();
    const prompts = scriptPrompts[currentType];
    const prompt = prompts[currentPromptIndex];
    
    // Special handling for spouse check step
    if (prompt.id === 'spouseCheck') {
        // Show options for yes/no
        showSpouseOptions();
        return;
    }
    
    // Automatically mark as completed when moving to next step
    completedPrompts[prompt.id] = true;
    
    currentPromptIndex++;
    if (currentPromptIndex < prompts.length) {
        showPrompt();
    } else {
        completeConfirmation();
    }
});

function showSpouseOptions() {
    const scriptPrompts = getScriptPrompts();
    const prompts = scriptPrompts[currentType];
    const prompt = prompts[currentPromptIndex];
    
    questionContainer.innerHTML = `
        <div class="prompt-item">
            <div class="prompt-title">${prompt.title}</div>
            <div class="prompt-text">${prompt.text}</div>
            <div class="spouse-options" style="margin-top: 20px; display: flex; gap: 15px; justify-content: center;">
                <button class="action-btn" id="spouseYes" style="padding: 12px 30px; font-size: 16px;">Yes, there is a spouse/companion</button>
                <button class="action-btn" style="padding: 12px 30px; font-size: 16px; background: #666;" id="spouseNo">No, just me</button>
            </div>
        </div>
        <div class="progress-indicator">Step ${currentPromptIndex + 1} / ${prompts.length}</div>
    `;
    
    // Handle yes button
    document.getElementById('spouseYes').addEventListener('click', () => {
        appointmentData.hasSpouse = true;
        completedPrompts[prompt.id] = true;
        currentPromptIndex++;
        // Scroll to top before showing next prompt
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            widgetContent.scrollTop = 0;
        }
        showPrompt(); // This will now show the updated decision makers step
    });
    
    // Handle no button
    document.getElementById('spouseNo').addEventListener('click', () => {
        appointmentData.hasSpouse = false;
        completedPrompts[prompt.id] = true;
        currentPromptIndex++;
        // Scroll to top before showing next prompt
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            widgetContent.scrollTop = 0;
        }
        showPrompt(); // This will now show the updated decision makers step
    });
}

// Restart button
restartBtn.addEventListener('click', () => {
    resetWidget();
});

// View Script button
viewScriptBtn.addEventListener('click', () => {
    showScript();
});

// Back to Summary button
backToSummaryBtn.addEventListener('click', () => {
    step4.classList.add('hidden');
    step3.classList.remove('hidden');
});

// Restart button from script view
const restartBtn2 = document.getElementById('restartBtn2');
if (restartBtn2) {
    restartBtn2.addEventListener('click', () => {
        resetWidget();
    });
}

// Close button
closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-window');
});

// Minimize button
minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});

function showNameInputDialog() {
    return new Promise((resolve) => {
        // Create a modal dialog
        const dialog = document.createElement('div');
        dialog.className = 'name-input-dialog';
        dialog.innerHTML = `
            <div class="dialog-overlay">
                <div class="dialog-content">
                    <h3>Enter Your Name</h3>
                    <p>This will be saved for future use</p>
                    <input type="text" id="nameInput" placeholder="Your name" autofocus>
                    <div class="dialog-buttons">
                        <button id="nameSubmitBtn" class="action-btn">Save</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        
        const input = dialog.querySelector('#nameInput');
        const submitBtn = dialog.querySelector('#nameSubmitBtn');
        
        const cleanup = () => {
            document.body.removeChild(dialog);
        };
        
        const submit = () => {
            const name = input.value.trim();
            if (name) {
                saveConfirmerName(name);
                cleanup();
                resolve(name);
            }
        };
        
        submitBtn.addEventListener('click', submit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submit();
            }
        });
        
        // Focus on input
        setTimeout(() => input.focus(), 100);
    });
}

function getDateOptions() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    const formatDate = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return {
            dayName: days[date.getDay()],
            month: months[date.getMonth()],
            day: date.getDate(),
            year: date.getFullYear(),
            dateString: date.toISOString().split('T')[0]
        };
    };
    
    return {
        today: formatDate(today),
        tomorrow: formatDate(tomorrow),
        dayAfter: formatDate(dayAfter)
    };
}

function showDataEntry() {
    // First, get confirmer name if not saved
    const savedName = getSavedConfirmerName();
    if (!savedName) {
        showNameInputDialog().then(() => {
            displayDataEntryForm();
        });
            } else {
        displayDataEntryForm();
    }
}

function getAvailableTimes(selectedDate) {
    const now = new Date();
    const selected = new Date(selectedDate + 'T00:00:00');
    const isToday = selected.toDateString() === now.toDateString();
    
    const times = [
        { value: '10:00', label: '10:00 AM', hour: 10 },
        { value: '14:00', label: '2:00 PM', hour: 14 },
        { value: '18:00', label: '6:00 PM', hour: 18 }
    ];
    
    if (!isToday) {
        // If not today, all times are available
        return times;
    }
    
    // If today, filter out times within 4 hours
    const currentHour = now.getHours();
    const cutoffHour = currentHour + 4;
    
    return times.filter(time => {
        // If the time has already passed today, exclude it
        if (time.hour < currentHour) {
            return false;
        }
        // If the time is within 4 hours, exclude it
        if (time.hour < cutoffHour) {
            return false;
        }
        return true;
    });
}

function displayDataEntryForm() {
    const dates = getDateOptions();
    step1.classList.add('hidden');
    step1_5.classList.remove('hidden');
    
    dataEntryContainer.innerHTML = `
        <div class="data-entry-item">
            <label>Appointment Date *</label>
            <div class="date-buttons">
                <button class="date-btn" data-date="${dates.today.dateString}">Today - ${dates.today.dayName}, ${dates.today.month} ${dates.today.day}</button>
                <button class="date-btn" data-date="${dates.tomorrow.dateString}">Tomorrow - ${dates.tomorrow.dayName}, ${dates.tomorrow.month} ${dates.tomorrow.day}</button>
                <button class="date-btn" data-date="${dates.dayAfter.dateString}">Day After - ${dates.dayAfter.dayName}, ${dates.dayAfter.month} ${dates.dayAfter.day}</button>
            </div>
            <div id="selectedDate" class="selected-date"></div>
        </div>
        <div class="data-entry-item">
            <label>Appointment Time *</label>
            <div class="time-buttons" id="timeButtons">
                <!-- Time buttons will be populated based on selected date -->
            </div>
            <div id="selectedTime" class="selected-date"></div>
                </div>
            `;
    
    // Set up date button handlers
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            appointmentData.date = e.target.getAttribute('data-date');
            const selectedDateDiv = document.getElementById('selectedDate');
            selectedDateDiv.textContent = `Selected: ${e.target.textContent}`;
            
            // Update available times based on selected date
            updateTimeButtons(appointmentData.date);
        });
    });
    
    // Initially show times for today
    updateTimeButtons(dates.today.dateString);
}

function updateTimeButtons(selectedDate) {
    const availableTimes = getAvailableTimes(selectedDate);
    const timeButtonsContainer = document.getElementById('timeButtons');
    const selectedTimeDiv = document.getElementById('selectedTime');
    
    if (availableTimes.length === 0) {
        timeButtonsContainer.innerHTML = '<p style="color: #666; font-size: 14px;">No available times for this date. Please select a different date.</p>';
        appointmentData.time = '';
        selectedTimeDiv.textContent = '';
        return;
    }
    
    timeButtonsContainer.innerHTML = availableTimes.map(time => 
        `<button class="time-btn" data-time="${time.value}">${time.label}</button>`
    ).join('');
    
    // Set up time button handlers
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            appointmentData.time = e.target.getAttribute('data-time');
            selectedTimeDiv.textContent = `Selected: ${e.target.textContent}`;
        });
    });
}

function validateDataEntry() {
    if (!appointmentData.date) {
        alert('Please select an appointment date');
                return false;
            }
    if (!appointmentData.time) {
        alert('Please select an appointment time');
                return false;
            }
    
    return true;
}

function showPrompt() {
    console.log('showPrompt called, currentType:', currentType, 'index:', currentPromptIndex);
    
    const scriptPrompts = getScriptPrompts();
    
    if (!currentType || !scriptPrompts[currentType]) {
        console.error('Invalid currentType:', currentType);
        return;
    }
    
    const prompts = scriptPrompts[currentType];
    if (!prompts || currentPromptIndex >= prompts.length) {
        console.error('Invalid prompt index or prompts array');
        return;
    }
    
    const prompt = prompts[currentPromptIndex];
    const progress = `${currentPromptIndex + 1} / ${prompts.length}`;
    const isCompleted = completedPrompts[prompt.id] || false;
    
    if (!questionContainer) {
        console.error('questionContainer not found!');
        return;
    }
    
    // Use title if available, otherwise use text
    const title = prompt.title || prompt.text.split('\n')[0];
    const text = prompt.title ? prompt.text : prompt.text.substring(prompt.text.indexOf('\n') + 1);
    
    questionContainer.innerHTML = `
        <div class="prompt-item">
            <div class="prompt-title">${title}</div>
            <div class="prompt-text">${text}</div>
        </div>
        <div class="progress-indicator">Step ${progress}</div>
    `;

    // Scroll to top of question container when showing new step
    if (questionContainer) {
        questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Also scroll the widget-content to top
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            widgetContent.scrollTop = 0;
        }
    }

    // Update next button text
    if (nextBtn) {
        if (currentPromptIndex === prompts.length - 1) {
            nextBtn.textContent = 'Complete Confirmation';
    } else {
            nextBtn.textContent = 'Next Step →';
        }
    }
}


// Removed validateCurrentQuestion - no longer needed

function completeConfirmation() {
    // Save final prompt completion
    const scriptPrompts = getScriptPrompts();
    const prompts = scriptPrompts[currentType];
    const prompt = prompts[currentPromptIndex];
    
    // Automatically mark final prompt as completed
    completedPrompts[prompt.id] = true;
    
    // Automatically reset and start over for next person
    // Reset appointment data but keep confirmer name
    appointmentData = {
        date: '',
        time: '',
        hasSpouse: null
    };
    
    // Reset flow state
    currentStep = 1;
    currentPromptIndex = 0;
    completedPrompts = {};
    
    // Hide current step and show data entry for next person
    step2.classList.add('hidden');
    step1_5.classList.remove('hidden');
    
    // Show data entry form for next appointment
    displayDataEntryForm();
}

function getProductName() {
    if (currentType === 'roof') {
        return 'roof';
    } else if (currentType === 'bath') {
        return 'bath';
    } else {
        return 'product';
    }
}

function generateScript() {
    const confirmerName = getSavedConfirmerName() || '[Your Name]';
    const product = getProductName();
    const date = formatDateForScript(appointmentData.date);
    const time = formatTimeForScript(appointmentData.time);
    
    const greeting = getFullGreeting();
    const address = '[Address from Salesforce]';
    const clientName = '[Name from Salesforce]';
    
    const script = `📞 CONFIRMATION SCRIPT

☎️ Final Polished Confirmation Call Script

"${greeting}, this is ${confirmerName} with Long Home on a recorded line. I'm calling to confirm your appt on ${date} at ${time} for the free estimate on replacing your ${product}.

Our Product Specialist will be making a special trip out to your home at ${address} for the free wellness check and quote on a total replacement of your ${product}. Please make sure your schedule is clear with no time constraints.

The appointment takes about 60 to 90 minutes, which allows us time to show samples, answer your questions, and provide personalized recommendations.

We truly value your time — and we ask that you prioritize this visit as well. It is complimentary and specifically reserved for you. Our specialist is dedicating their time to your project, so it's very important that spouse, all homeowners, and decision-makers are home and ready to discuss your wants and needs. Does that work for both you and ${clientName}?

Can I count on you, and everyone involved, to be available at ${time} for the full 60 to 90 minutes?

If anything changes or you need to reach us, please call 1-800-518-7218 as soon as possible."

Now that you are all confirmed the next point of contact will be the product specialist at your door (${date} at ${time}) to assist you with your ${product} needs. Thanks for considering Long and have a great day 😊

---

Use Vacation Promo as needed to save/retain all set appointments please.

We have even more Great news for you! When you move forward with your project, you'll also receive a vacation package — just our way of saying thank you! Be sure to ask your Product Specialist for all the details when they visit your home on ${date}.

---

ADDITIONAL CONFIRMATION OPTIONS:

Option 1: Professional & Clear
To make the most of your complimentary estimate, all homeowners and decision-makers must be present for the appointment. Our specialist will be dedicating 60–90 minutes exclusively to your project, and pricing, options, and next steps can only be reviewed when everyone involved is available.
Can you confirm that you and [Name from Salesforce] will both be present and available at ${time} for the full appointment?

Option 2: Direct but Polite (Customer-Friendly, Still Strong)
We truly value your time, and we ask that you do the same for this visit. This complimentary estimate is reserved specifically for you, and our specialist will need all homeowners and decision-makers present to properly review your wants, needs, and pricing.
Can I confirm that you and [Name from Salesforce] will both be home and available at ${time} for the full 60–90 minutes?

Option 3: Very Forward / Sales-Driven (Best for Confirmation Calls)
Before we finalize the appointment, I need to confirm that all homeowners and decision-makers will be present. Our specialist cannot proceed without everyone involved, as decisions, options, and pricing are reviewed during the visit.
Can I count on you and [Name from Salesforce] being available at ${time} for the full 60–90 minutes?`;

    return script;
}

function showScript() {
    step3.classList.add('hidden');
    step4.classList.remove('hidden');
    
    const script = generateScript();
    scriptText.textContent = script;
    
    // Add copy button functionality
    const copyBtn = document.getElementById('copyScriptBtn');
    if (copyBtn) {
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(script).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        };
    }
}

function resetWidget() {
    currentStep = 1;
    currentType = null;
    currentPromptIndex = 0;
    completedPrompts = {};
    appointmentData = {
        date: '',
        time: '',
        hasSpouse: null
    };
    step1.classList.remove('hidden');
    step1_5.classList.add('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    step4.classList.add('hidden');
}

// Initialize
resetWidget();

