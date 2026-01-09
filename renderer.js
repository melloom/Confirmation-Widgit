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
                text: `"${getFullGreeting()}, this is ${confirmerName} with Long Home on a recorded line. I'm calling to confirm your appt for your free estimate on replacing your roof."`
            },
            { 
                id: 'confirmDateTime', 
                title: 'STEP 2: CONFIRM DATE & TIME',
                text: `"Your appointment is scheduled for ${date} at ${time} for your free estimate on replacing your roof. Does that work for you?"`
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
                text: `"${getFullGreeting()}, this is ${confirmerName} with Long Home on a recorded line. I'm calling to confirm your appt for your free estimate on replacing your bath."`
            },
            { 
                id: 'confirmDateTime', 
                title: 'STEP 2: CONFIRM DATE & TIME',
                text: `"Your appointment is scheduled for ${date} at ${time} for your free estimate on replacing your bath. Does that work for you?"`
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
        ],
        cancellation: [
            { 
                id: 'cancellationGreeting', 
                title: 'STEP 1: EMPATHETIC OPENING',
                text: `"${getFullGreeting()}, this is ${confirmerName} with Long Home on a recorded line. I understand you're considering canceling your appointment scheduled for ${date} at ${time}. I completely understand that life can get busy, and I want to make sure we're working with your schedule."`
            },
            { 
                id: 'cancellationReason', 
                title: 'STEP 2: IDENTIFY CANCELLATION REASON',
                text: "Can you help me understand what's come up? What's the main reason you're considering canceling?"
            }
        ]
    };
}

// Rotating discount system - best discounts for each situation
function getBestDiscount(reason) {
    const discounts = {
        sick: [
            { type: '50% Off', description: '50% off your entire project - our way of helping during a difficult time', priority: 1 },
            { type: 'Free Installation', description: "Free installation when you're ready - no extra cost", priority: 2 },
            { type: 'Extended Warranty', description: 'Extended warranty coverage at no additional charge', priority: 3 },
            { type: 'Flexible Payment', description: 'Flexible payment plans with 0% interest for 12 months', priority: 4 }
        ],
        badTime: [
            { type: '50% Off', description: '50% off your entire project for keeping your appointment', priority: 1 },
            { type: 'Free Upgrade', description: 'Free upgrade to premium materials - no extra cost', priority: 2 },
            { type: 'Priority Scheduling', description: 'Priority scheduling - we work around your time', priority: 3 },
            { type: 'Bonus Discount', description: 'Additional 10% off on top of any current promotions', priority: 4 }
        ],
        notInterested: [
            { type: '50% Off', description: '50% off your entire project - limited time offer', priority: 1 },
            { type: 'Free Consultation Bonus', description: 'Free consultation plus $500 credit toward your project', priority: 2 },
            { type: 'No-Risk Guarantee', description: '100% satisfaction guarantee - if not happy, full refund', priority: 3 },
            { type: 'Exclusive Deal', description: 'Exclusive deal: 50% off plus free premium features', priority: 4 }
        ]
    };
    
    // Get discounts for this reason and rotate them
    const availableDiscounts = discounts[reason] || discounts.notInterested;
    
    // Prioritize 50% off (highest priority) more often - use it 60% of the time
    const useBestDiscount = Math.random() < 0.6;
    if (useBestDiscount && availableDiscounts.length > 0) {
        // Find the 50% off discount (priority 1)
        const bestDiscount = availableDiscounts.find(d => d.priority === 1);
        if (bestDiscount) {
            return bestDiscount;
        }
    }
    
    // Otherwise rotate based on current date/time to vary offers
    const rotationIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % availableDiscounts.length;
    const selectedDiscount = availableDiscounts[rotationIndex];
    
    return selectedDiscount;
}

// Get cancellation prompts based on reason
function getCancellationPrompts() {
    const date = formatDateForScript(appointmentData.date);
    const time = formatTimeForScript(appointmentData.time);
    const confirmerName = getSavedConfirmerName() || '[Your Name]';
    const reason = appointmentData.cancellationReason;
    const discount = getBestDiscount(reason);
    
    const basePrompts = {
        sick: [
            { 
                id: 'sickEmpathy', 
                title: 'STEP 3: SHOW EMPATHY & BUILD RAPPORT',
                text: `"I'm so sorry to hear that you or someone in your household isn't feeling well. Your health and well-being are absolutely the most important thing, and I completely understand why you'd want to reschedule. We genuinely care about you and want to make this work."`
            },
            { 
                id: 'sickDiscount', 
                title: 'STEP 4: PRESENT EXCLUSIVE OFFER IMMEDIATELY',
                text: `"Before we reschedule, I have something important to share. Because we understand what you're going through, we're offering you ${discount.type} - ${discount.description}. This is an exclusive, one-time offer that's only available right now if we keep your appointment. Once we reschedule, this offer expires. This could save you thousands of dollars, and it's our way of helping during a difficult time."`
            },
            { 
                id: 'sickReschedule', 
                title: 'STEP 5: OFFER FLEXIBLE RESCHEDULE WITH INCENTIVE',
                text: `"Here's what I can do - we can absolutely reschedule for when you're feeling better, and I'll lock in your ${discount.type} right now so it's guaranteed when you're ready. Our specialist is very flexible - we can do it a week, two weeks, or even a month from now. The discount stays locked in. When would work best for you?"`
            },
            { 
                id: 'sickUrgency', 
                title: 'STEP 6: CREATE URGENCY & SCARCITY',
                text: `"I need to be honest with you - this ${discount.type} is only available today. If we don't lock it in now, I can't guarantee it will be available when you reschedule. Our specialist has already prepared everything for your visit, and we've reserved this special offer just for you. It would be a shame to lose out on this incredible savings."`
            },
            { 
                id: 'sickValue', 
                title: 'STEP 7: REINFORCE MASSIVE VALUE',
                text: `"Let me put this in perspective - with ${discount.type}, you're looking at saving potentially thousands of dollars. This complimentary estimate is specifically reserved for you, and our specialist has already invested time preparing for your visit. This is a no-obligation consultation, so there's zero risk - just information and an amazing deal that could save you a significant amount of money."`
            },
            { 
                id: 'sickCommitment', 
                title: 'STEP 8: FINAL COMMITMENT PUSH',
                text: `"We're 100% committed to making this work for you. If you're feeling better by ${date}, we can keep the appointment and you'll get ${discount.type} locked in. If not, we'll reschedule to whenever you're ready, and the discount stays with you. Either way, you win. Can we lock this in for you right now?"`
            },
            { 
                id: 'sickClosing', 
                title: 'STEP 9: STRONG CLOSING',
                text: `"Perfect! I've locked in your ${discount.type} and we're all set. If you're feeling better by ${date}, we'll see you then. If not, just call us at 1-800-518-7218 and we'll reschedule - your discount stays locked in. I hope you feel better soon, and I'm really glad we could make this work for you!"`
            }
        ],
        badTime: [
            { 
                id: 'timeAcknowledge', 
                title: 'STEP 3: ACKNOWLEDGE & IMMEDIATELY OFFER SOLUTION',
                text: `"I completely understand - scheduling can be tricky, and I really appreciate you letting me know that ${time} on ${date} doesn't work for you. That's exactly why we're flexible, and I have some great options for you."`
            },
            { 
                id: 'timeDiscount', 
                title: 'STEP 4: LEAD WITH EXCLUSIVE DISCOUNT',
                text: `"Before we find a new time, I have something exciting to share. If we can find a time that works for you and keep your appointment, we're offering you ${discount.type} - ${discount.description}. This is an exclusive offer that's only available today. This could save you thousands of dollars, and it's worth making time for!"`
            },
            { 
                id: 'timeReschedule', 
                title: 'STEP 5: OFFER MULTIPLE FLEXIBLE OPTIONS',
                text: `"Let's find a time that works perfectly for you. Our specialist has availability throughout the week - morning, afternoon, and evening slots. We can do the same day at a different time, or we can move it to any day that works better. What time would work best for you? And remember, you'll get ${discount.type} when we lock this in."`
            },
            { 
                id: 'timeSameDay', 
                title: 'STEP 6: PUSH SAME DAY WITH URGENCY',
                text: `"If ${date} still works for you, we could move the appointment to a different time that same day - maybe earlier in the morning or later in the evening? You'd still get ${discount.type}, and we can make it happen today. Would that work? This way you don't lose the discount and we can get this done."`
            },
            { 
                id: 'timeUrgency', 
                title: 'STEP 7: CREATE URGENCY',
                text: `"I need to be upfront with you - this ${discount.type} is a limited-time offer that expires today. If we don't lock in a time right now, I can't guarantee this discount will be available later. Our specialist has already prepared for your visit, and we've set aside this special offer just for you. It would be a huge loss to miss out on this savings."`
            },
            { 
                id: 'timeValue', 
                title: 'STEP 8: REINFORCE MASSIVE VALUE',
                text: `"Let me be clear about what you're getting - it's a complimentary, no-obligation consultation where our specialist comes to your home, shows you samples, answers all your questions, and provides personalized recommendations. Plus, with ${discount.type}, you're getting incredible value that could save you thousands. It's absolutely worth making time for, and we'll work around your schedule completely."`
            },
            { 
                id: 'timeClosing', 
                title: 'STEP 9: STRONG CLOSING',
                text: `"Perfect! I've got you scheduled for [new date/time] and locked in your ${discount.type}. Our specialist will see you then, and you're all set with this amazing deal. If anything changes, just call us at 1-800-518-7218. Thanks for working with us - you made a great decision, and have a great ${getTimeBasedGreeting()}!"`
            }
        ],
        notInterested: [
            { 
                id: 'interestAcknowledge', 
                title: 'STEP 3: ACKNOWLEDGE & PROBE GENTLY',
                text: `"I understand, and I really appreciate your honesty. Can I ask - is there a specific concern or reason you're no longer interested? Sometimes there's a misunderstanding we can clear up, or maybe the timing just isn't right. I'd love to understand what's on your mind."`
            },
            { 
                id: 'interestDiscount', 
                title: 'STEP 4: PRESENT EXCLUSIVE DEAL IMMEDIATELY',
                text: `"Before you make a final decision, I have something that might completely change your perspective. We're offering you ${discount.type} - ${discount.description}. This is an exclusive, one-time offer that's only available right now if you keep your appointment. This could save you thousands of dollars, and it's an opportunity you won't want to miss."`
            },
            { 
                id: 'interestUrgency', 
                title: 'STEP 5: CREATE STRONG URGENCY',
                text: `"I need to be completely transparent with you - this ${discount.type} expires today. If we don't lock this in right now, I cannot guarantee this offer will be available later. Our specialist has already prepared everything for your visit, and we've reserved this special deal just for you. Missing out on this would be a significant financial loss."`
            },
            { 
                id: 'interestAddress', 
                title: 'STEP 6: ADDRESS CONCERNS WITH POWERFUL INCENTIVE',
                text: `"I want to make sure you have all the information. This is a completely complimentary, no-obligation consultation - zero risk, zero pressure. Just an opportunity to see samples, ask questions, and understand your options. And with ${discount.type}, you're getting an incredible deal that could save you thousands. Our specialist is there to help and inform, not to pressure you."`
            },
            { 
                id: 'interestValue', 
                title: 'STEP 7: REINFORCE MASSIVE VALUE & OPPORTUNITY',
                text: `"Let me put this in perspective - even if you're not sure right now, this appointment gives you the chance to see what's available, understand the process, and make an informed decision - all at no cost to you. Plus, with ${discount.type}, you're getting incredible value that could save you thousands of dollars. You have absolutely nothing to lose, and potentially everything to gain. This could be the best decision you make this year."`
            },
            { 
                id: 'interestLowPressure', 
                title: 'STEP 8: LOW-PRESSURE BUT COMPELLING APPROACH',
                text: `"I'm not going to pressure you, but I genuinely believe it's worth keeping the appointment just to see what's available. With ${discount.type}, you're getting an exclusive deal that won't be available after today. If after the consultation you're still not interested, that's completely fine - no hard feelings, no pressure. But you might discover something that completely changes your mind, and you'll have locked in an amazing discount that could save you thousands. Can we keep the appointment on ${date} at ${time} and lock in this deal?"`
            },
            { 
                id: 'interestClosing', 
                title: 'STEP 9: STRONG CLOSING',
                text: `"Excellent! I'm so glad we could work this out. Our specialist will see you on ${date} at ${time}, and you have ${discount.type} locked in. Remember, there's no obligation - just come with an open mind and see what's available. You've made a smart decision, and I think you'll be glad you did. If anything changes, call us at 1-800-518-7218. Thanks, and have a great ${getTimeBasedGreeting()}!"`
            }
        ]
    };
    
    return basePrompts[reason] || [];
}

let currentStep = 1;
let currentType = null; // 'roof', 'bath', or 'cancellation'
let currentPromptIndex = 0;
let completedPrompts = {};
let isCancellationFlow = false;
let appointmentData = {
    date: '',
    time: '',
    hasSpouse: null, // null = not asked yet, true = yes, false = no
    cancellationReason: null // 'sick', 'badTime', 'notInterested', or null
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
const cancelBtn = document.getElementById('cancelBtn');
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
            if (isCancellationFlow) {
                startCancellationFlow();
            } else {
                // Hide intro card and status row before showing step 2
                const introCard = document.querySelector('.intro-card');
                const statusRow = document.querySelector('.status-row');
                if (introCard) {
                    introCard.classList.add('hidden');
                    introCard.style.display = 'none';
                }
                if (statusRow) {
                    statusRow.classList.add('hidden');
                    statusRow.style.display = 'none';
                }
                
                step1_5.classList.add('hidden');
                step2.classList.remove('hidden');
                currentPromptIndex = 0;
                completedPrompts = {};
                showPrompt();
            }
        }
    });
}

// Next button
nextBtn.addEventListener('click', () => {
    // Get the correct prompts array based on flow type
    let prompts;
    if (isCancellationFlow && appointmentData.cancellationReason) {
        prompts = getCancellationPrompts();
    } else {
        const scriptPrompts = getScriptPrompts();
        if (!currentType || !scriptPrompts[currentType]) {
            console.error('Invalid currentType:', currentType);
            return;
        }
        prompts = scriptPrompts[currentType];
    }
    
    if (!prompts || currentPromptIndex >= prompts.length) {
        console.error('Invalid prompt index');
        return;
    }
    
    const prompt = prompts[currentPromptIndex];
    
    // Automatically mark as completed when moving to next step
    if (prompt) {
        completedPrompts[prompt.id] = true;
    }
    
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
            <div class="spouse-options" style="margin-top: 20px; display: flex; flex-direction: column; gap: 12px;">
                <button class="action-btn" id="spouseYes" style="padding: 14px 18px; font-size: 15px; white-space: normal; word-wrap: break-word; line-height: 1.4;">Yes, there is a spouse/companion</button>
                <button class="action-btn" style="padding: 14px 18px; font-size: 15px; background: #666; white-space: normal; word-wrap: break-word; line-height: 1.4;" id="spouseNo">No, just me</button>
            </div>
        </div>
        <div class="progress-indicator">Step ${currentPromptIndex + 1} / ${prompts.length}</div>
    `;
    
    // Auto-scroll to the prompt text
    setTimeout(() => {
        const promptText = questionContainer.querySelector('.prompt-text');
        if (promptText) {
            promptText.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            widgetContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 100);
    
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

function showCancellationReasonOptions() {
    const scriptPrompts = getScriptPrompts();
    const prompts = scriptPrompts[currentType];
    const prompt = prompts[currentPromptIndex];
    
    questionContainer.innerHTML = `
        <div class="prompt-item">
            <div class="prompt-title">${prompt.title}</div>
            <div class="prompt-text">${prompt.text}</div>
            <div class="spouse-options" style="margin-top: 20px; display: flex; flex-direction: column; gap: 12px;">
                <button class="action-btn" id="reasonSick" style="padding: 14px 18px; font-size: 15px; white-space: normal; word-wrap: break-word; line-height: 1.4;">Sick / Health Issue</button>
                <button class="action-btn" id="reasonBadTime" style="padding: 14px 18px; font-size: 15px; background: #666; white-space: normal; word-wrap: break-word; line-height: 1.4;">Bad Time / Scheduling Conflict</button>
                <button class="action-btn" id="reasonNotInterested" style="padding: 14px 18px; font-size: 15px; background: #666; white-space: normal; word-wrap: break-word; line-height: 1.4;">Not Interested</button>
            </div>
        </div>
        <div class="progress-indicator">Step ${currentPromptIndex + 1}</div>
    `;
    
    // Auto-scroll to the prompt text
    setTimeout(() => {
        const promptText = questionContainer.querySelector('.prompt-text');
        if (promptText) {
            promptText.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            widgetContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 100);
    
    // Handle sick button
    document.getElementById('reasonSick').addEventListener('click', () => {
        appointmentData.cancellationReason = 'sick';
        completedPrompts[prompt.id] = true;
        currentPromptIndex++;
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            widgetContent.scrollTop = 0;
        }
        showPrompt();
    });
    
    // Handle bad time button
    document.getElementById('reasonBadTime').addEventListener('click', () => {
        appointmentData.cancellationReason = 'badTime';
        completedPrompts[prompt.id] = true;
        currentPromptIndex++;
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            widgetContent.scrollTop = 0;
        }
        showPrompt();
    });
    
    // Handle not interested button
    document.getElementById('reasonNotInterested').addEventListener('click', () => {
        appointmentData.cancellationReason = 'notInterested';
        completedPrompts[prompt.id] = true;
        currentPromptIndex++;
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            widgetContent.scrollTop = 0;
        }
        showPrompt();
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

// Cancellation button - starts cancellation retention flow
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        // Check if we have appointment data, if not, show data entry first
        if (!appointmentData.date || !appointmentData.time) {
            // Show data entry for cancellation flow
            isCancellationFlow = true;
            currentType = 'cancellation';
            showDataEntry();
        } else {
            // Start cancellation flow directly
            isCancellationFlow = true;
            currentType = 'cancellation';
            startCancellationFlow();
        }
    });
}

function startCancellationFlow() {
    // Hide intro card and status row
    const introCard = document.querySelector('.intro-card');
    const statusRow = document.querySelector('.status-row');
    if (introCard) {
        introCard.classList.add('hidden');
        introCard.style.display = 'none';
    }
    if (statusRow) {
        statusRow.classList.add('hidden');
        statusRow.style.display = 'none';
    }
    
    // Hide all other steps including completion screen
    step1.classList.add('hidden');
    step1_5.classList.add('hidden');
    step2.classList.remove('hidden');
    step3.classList.add('hidden');
    step4.classList.add('hidden');
    
    // Clear completion text
    if (completionText) {
        completionText.textContent = '';
    }
    
    // Clear question container
    if (questionContainer) {
        questionContainer.innerHTML = '';
    }
    
    // Update step header for cancellation
    const questionTitle = document.getElementById('questionTitle');
    if (questionTitle) {
        questionTitle.textContent = 'Retention Script';
    }
    
    currentPromptIndex = 0;
    completedPrompts = {};
    showPrompt();
}

function showNameInputDialog() {
    return new Promise((resolve) => {
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'dialog-backdrop';
        
        // Create modal dialog content
        const dialog = document.createElement('div');
        dialog.className = 'name-input-dialog';
        dialog.innerHTML = `
            <h3>Enter Your Name</h3>
            <p>This will be saved for future use</p>
            <input type="text" id="nameInput" placeholder="Your name" autofocus>
            <div class="dialog-buttons">
                <button id="nameSubmitBtn" class="action-btn">Save</button>
            </div>
        `;
        
        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);
        
        const input = dialog.querySelector('#nameInput');
        const submitBtn = dialog.querySelector('#nameSubmitBtn');
        
        const cleanup = () => {
            document.body.removeChild(backdrop);
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
    
    const options = {
        today: formatDate(today),
        tomorrow: formatDate(tomorrow),
        dayAfter: formatDate(dayAfter)
    };
    
    // For cancellation flows, add 3-4 days out
    if (isCancellationFlow) {
        const day3 = new Date(today);
        day3.setDate(day3.getDate() + 3);
        const day4 = new Date(today);
        day4.setDate(day4.getDate() + 4);
        options.day3 = formatDate(day3);
        options.day4 = formatDate(day4);
    }
    
    return options;
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
    
    // Hide intro card and status row when showing data entry (step 1.5)
    const introCard = document.querySelector('.intro-card');
    const statusRow = document.querySelector('.status-row');
    if (introCard) {
        introCard.classList.add('hidden');
        introCard.style.display = 'none';
    }
    if (statusRow) {
        statusRow.classList.add('hidden');
        statusRow.style.display = 'none';
    }
    
    step1.classList.add('hidden');
    step1_5.classList.remove('hidden');
    
    // Build date buttons HTML
    let dateButtonsHTML = `
        <button class="date-btn" data-date="${dates.today.dateString}">Today - ${dates.today.dayName}, ${dates.today.month} ${dates.today.day}</button>
        <button class="date-btn" data-date="${dates.tomorrow.dateString}">Tomorrow - ${dates.tomorrow.dayName}, ${dates.tomorrow.month} ${dates.tomorrow.day}</button>
        <button class="date-btn" data-date="${dates.dayAfter.dateString}">Day After - ${dates.dayAfter.dayName}, ${dates.dayAfter.month} ${dates.dayAfter.day}</button>
    `;
    
    // Add 3-4 days out for cancellation flows
    if (isCancellationFlow && dates.day3 && dates.day4) {
        dateButtonsHTML += `
            <button class="date-btn" data-date="${dates.day3.dateString}">3 Days Out - ${dates.day3.dayName}, ${dates.day3.month} ${dates.day3.day}</button>
            <button class="date-btn" data-date="${dates.day4.dateString}">4 Days Out - ${dates.day4.dayName}, ${dates.day4.month} ${dates.day4.day}</button>
        `;
    }
    
    dataEntryContainer.innerHTML = `
        <div class="data-entry-item">
            <label>Appointment Date *</label>
            <div class="date-buttons">
                ${dateButtonsHTML}
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
    
    // Ensure status row and intro card are hidden when showing prompts (step 2)
    const introCard = document.querySelector('.intro-card');
    const statusRow = document.querySelector('.status-row');
    if (introCard) {
        introCard.classList.add('hidden');
        introCard.style.display = 'none';
    }
    if (statusRow) {
        statusRow.classList.add('hidden');
        statusRow.style.display = 'none';
    }
    
    // For cancellation flow, get prompts based on reason
    let prompts;
    if (isCancellationFlow && appointmentData.cancellationReason) {
        prompts = getCancellationPrompts();
    } else {
        const scriptPrompts = getScriptPrompts();
        if (!currentType || !scriptPrompts[currentType]) {
            console.error('Invalid currentType:', currentType);
            return;
        }
        prompts = scriptPrompts[currentType];
    }
    
    if (!prompts || currentPromptIndex >= prompts.length) {
        console.error('Invalid prompt index or prompts array');
        return;
    }
    
    const prompt = prompts[currentPromptIndex];
    
    // Special handling for cancellation reason step - show options directly
    if (prompt.id === 'cancellationReason') {
        // Hide next button for cancellation reason question - user must select an option
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        showCancellationReasonOptions();
        return;
    }
    
    // Special handling for spouse check step - show options directly
    if (prompt.id === 'spouseCheck') {
        // Hide next button for spouse question - user must select an option
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        showSpouseOptions();
        return;
    }
    
    // Show next button for all other prompts
    if (nextBtn) {
        nextBtn.style.display = '';
    }
    
    // Calculate total steps for progress indicator
    let totalSteps = prompts.length;
    if (isCancellationFlow && appointmentData.cancellationReason) {
        // For cancellation, add base prompts (2) + reason-specific prompts
        const basePrompts = 2; // greeting + reason selection
        totalSteps = basePrompts + prompts.length;
    }
    const progress = `${currentPromptIndex + 1} / ${totalSteps}`;
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

    // Auto-scroll to the prompt text when showing new step
    setTimeout(() => {
        const widgetContent = document.getElementById('widgetContent');
        if (widgetContent) {
            // Scroll to top to show the new prompt, accounting for sticky button
            widgetContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Also scroll the question container to top if it has scroll
        const promptText = questionContainer.querySelector('.prompt-text');
        if (promptText && questionContainer.scrollHeight > questionContainer.clientHeight) {
            questionContainer.scrollTop = 0;
        }
    }, 100);

    // Update next button text and title
    if (nextBtn) {
        if (currentPromptIndex === prompts.length - 1) {
            if (isCancellationFlow) {
                nextBtn.textContent = 'Complete Retention';
            } else {
                nextBtn.textContent = 'Complete Confirmation';
            }
        } else {
            nextBtn.textContent = 'Next Step →';
        }
    }
    
    // Update step title based on flow type
    const questionTitle = document.getElementById('questionTitle');
    if (questionTitle) {
        if (isCancellationFlow) {
            questionTitle.textContent = 'Retention Script';
        } else {
            questionTitle.textContent = 'Follow the script';
        }
    }
}


// Removed validateCurrentQuestion - no longer needed

function completeConfirmation() {
    // Get the correct prompts array to mark final prompt as completed
    let prompts;
    if (isCancellationFlow && appointmentData.cancellationReason) {
        prompts = getCancellationPrompts();
    } else {
        const scriptPrompts = getScriptPrompts();
        if (currentType && scriptPrompts[currentType]) {
            prompts = scriptPrompts[currentType];
        }
    }
    
    // Mark the last prompt as completed (currentPromptIndex is already past the last one)
    if (prompts && prompts.length > 0) {
        const lastPromptIndex = prompts.length - 1;
        if (lastPromptIndex >= 0) {
            const lastPrompt = prompts[lastPromptIndex];
            if (lastPrompt) {
                completedPrompts[lastPrompt.id] = true;
            }
        }
    }
    
    // Hide step2 (script prompts)
    step2.classList.add('hidden');
    
    // Show step3 (completion screen)
    step3.classList.remove('hidden');
    
    // Generate and display completion message
    const confirmerName = getSavedConfirmerName() || '[Your Name]';
    const date = formatDateForScript(appointmentData.date);
    const time = formatTimeForScript(appointmentData.time);
    
    if (completionText) {
        if (isCancellationFlow) {
            const reasonText = appointmentData.cancellationReason === 'sick' ? 'retention (health issue)' :
                              appointmentData.cancellationReason === 'badTime' ? 'retention (scheduling)' :
                              appointmentData.cancellationReason === 'notInterested' ? 'retention (interest)' :
                              'retention';
            completionText.textContent = `Your cancellation ${reasonText} call for ${date} at ${time} is complete!`;
        } else {
            const product = getProductName();
            completionText.textContent = `Your ${product} confirmation for ${date} at ${time} is complete!`;
        }
    }
    
    // Scroll to top
    const widgetContent = document.getElementById('widgetContent');
    if (widgetContent) {
        widgetContent.scrollTop = 0;
    }
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
    isCancellationFlow = false;
    appointmentData = {
        date: '',
        time: '',
        hasSpouse: null,
        cancellationReason: null
    };
    
    // Hide all steps
    step1_5.classList.add('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    step4.classList.add('hidden');
    
    // Show intro card and status row again
    const introCard = document.querySelector('.intro-card');
    const statusRow = document.querySelector('.status-row');
    if (introCard) {
        introCard.classList.remove('hidden');
        introCard.style.display = '';
    }
    if (statusRow) {
        statusRow.classList.remove('hidden');
        statusRow.style.display = '';
    }
    
    // Clear question containers
    if (questionContainer) {
        questionContainer.innerHTML = '';
    }
    if (dataEntryContainer) {
        dataEntryContainer.innerHTML = '';
    }
    
    // Show step 1 (roof/bath selection)
    step1.classList.remove('hidden');
    
    // Scroll to top
    const widgetContent = document.getElementById('widgetContent');
    if (widgetContent) {
        widgetContent.scrollTop = 0;
    }
}

// Initialize
resetWidget();

