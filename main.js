const timeDisplay = document.getElementById('time-display');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeDisplay = document.getElementById('mode-display');

// Settings
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const setBtn = document.getElementById('set-btn');

// Audio elements
const workBGM = new Audio('SagyouBGM.mp3');
workBGM.loop = true;
const relaxBGM = new Audio('RelaxBGM.mp3');
relaxBGM.loop = true;
const bellSound = new Audio('bell.mp3'); // Assuming bell.mp3 exists

let timer;
let isRunning = false;
let currentMode = 'work'; // 'work' or 'break'

let workTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = workTime;

// Function to fade out audio
function fadeOutAudio(audio) {
    if (!audio.paused) {
        let fadeVolume = audio.volume;
        const fadeOutInterval = setInterval(() => {
            if (fadeVolume > 0.1) {
                fadeVolume -= 0.1;
                audio.volume = fadeVolume;
            } else {
                clearInterval(fadeOutInterval);
                audio.pause();
                audio.volume = 1; // Reset volume for next play
            }
        }, 100); // Fade out over 1 second
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function switchMode() {
    const previousBGM = (currentMode === 'work') ? workBGM : relaxBGM;
    fadeOutAudio(previousBGM);
    bellSound.play();

    if (currentMode === 'work') {
        currentMode = 'break';
        timeLeft = breakTime;
        modeDisplay.textContent = 'Break';
    } else {
        currentMode = 'work';
        timeLeft = workTime;
        modeDisplay.textContent = 'Work';
    }
    updateDisplay();

    // Automatically start the next timer session
    if(isRunning) {
        const nextBGM = (currentMode === 'work') ? workBGM : relaxBGM;
        nextBGM.currentTime = 0;
        nextBGM.play();
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft < 0) {
                clearInterval(timer);
                switchMode();
            }
        }, 1000);
    } else {
        // If paused when switching, just get ready but don't auto-play
        startPauseBtn.textContent = 'Start';
    }
}

function startPause() {
    if (isRunning) {
        clearInterval(timer);
        startPauseBtn.textContent = 'Start';
        const currentBGM = currentMode === 'work' ? workBGM : relaxBGM;
        fadeOutAudio(currentBGM);
        isRunning = false;
    } else {
        const currentBGM = currentMode === 'work' ? workBGM : relaxBGM;
        if (currentBGM.paused) {
            currentBGM.currentTime = 0;
            currentBGM.play();
        }
        isRunning = true;
        startPauseBtn.textContent = 'Pause';
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft < 0) {
                clearInterval(timer);
                switchMode();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    fadeOutAudio(workBGM);
    fadeOutAudio(relaxBGM);
    workBGM.currentTime = 0;
    relaxBGM.currentTime = 0;

    currentMode = 'work';
    timeLeft = workTime;
    updateDisplay();
    modeDisplay.textContent = 'Work';
    startPauseBtn.textContent = 'Start';
}

function setDurations() {
    workTime = workDurationInput.value * 60;
    breakTime = breakDurationInput.value * 60;
    alert('Settings updated!');
    resetTimer();
}

startPauseBtn.addEventListener('click', startPause);
resetBtn.addEventListener('click', resetTimer);
setBtn.addEventListener('click', setDurations);

updateDisplay(); // Initial display
