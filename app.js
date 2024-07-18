const label = document.getElementById("label");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const restartButton = document.getElementById("restart");

let currentPhase = 0;
let isPaused = false;
let endTimer = null;
let scheduledEvent = null;
let lastPlayedNumber = null;
let remainingTime = 0;

const phases = [
  6.0, 5.538, 5.143, 4.8, 4.5, 4.235, 4.0, 3.789, 3.6, 3.429, 3.273, 3.13, 3.0,
  2.88, 2.769, 2.667, 2.571, 2.483, 2.4, 2.323, 2.25,
];

function playSound() {
  if (new Date().getTime() >= endTimer) {
    clearInterval(scheduledEvent);
    currentPhase++;
    if (currentPhase < phases.length) {
      const transitionSound = new Audio("sounds/Beep.mp3"); // Load the transition sound
      transitionSound.play(); // Play the transition sound
      transitionSound.onended = function () {
        // Wait for the transition sound to end
        label.innerText = `Transition: ${currentPhase + 1}`;
        startPhase(); // Start the next phase
      };
    } else {
      label.innerText = "Done!";
    }
    return;
  }
  lastPlayedNumber = Math.floor(Math.random() * 4) + 1;
  const audio = new Audio(`sounds/${lastPlayedNumber}.mp3`);
  audio.play();
  label.innerText = `Playing\nTransition: ${
    currentPhase + 1
  }\nNumber: ${lastPlayedNumber}`;
}
function startPhase() {
  if (currentPhase < phases.length && !isPaused) {
    endTimer = new Date().getTime() + 10000;
    scheduledEvent = setInterval(playSound, phases[currentPhase] * 1000);
    playSound(); // Play immediately
  }
}

playButton.onclick = () => {
  if (isPaused) {
    endTimer = new Date().getTime() + remainingTime;
    scheduledEvent = setInterval(playSound, phases[currentPhase] * 1000);
    playSound();
  } else {
    currentPhase = 0;
    startPhase();
  }
  isPaused = false;
};

pauseButton.onclick = () => {
  if (scheduledEvent) {
    clearInterval(scheduledEvent);
    remainingTime = endTimer - new Date().getTime();
    isPaused = true;
    label.innerText = `Paused\nTransition: ${
      currentPhase + 1
    }\nNumber: ${lastPlayedNumber}`;
  }
};

restartButton.onclick = () => {
  if (scheduledEvent) {
    clearInterval(scheduledEvent);
  }
  currentPhase = 0;
  isPaused = false;
  endTimer = null;
  lastPlayedNumber = null;
  remainingTime = 0;
  label.innerText = "Press play to start the process";
};
