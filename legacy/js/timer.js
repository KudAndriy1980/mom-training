// Countdown timer and audio beep. Operates on the shared `state` object
// defined in main.js and calls render functions from ui.js.

function fmt(sec) {
  sec = Math.max(0, sec | 0);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function toggleTimer(ex) {
  if (state.timerRunning) {
    stopTimer();
  } else {
    startTimer(ex);
  }
  const btn = document.getElementById("timer-start");
  if (btn) {
    btn.textContent = state.timerRunning
      ? "Пауза"
      : (ex.kind === "holdReps" ? "Старт утримання" : "Старт");
  }
}

function startTimer(ex) {
  if (state.timerSec <= 0) {
    state.timerSec = ex.kind === "timer" ? ex.duration : ex.hold;
    updateTimerDisplay();
  }
  state.timerRunning = true;
  state.timerInterval = setInterval(() => {
    state.timerSec -= 1;
    updateTimerDisplay();
    if (state.timerSec <= 0) finishTimer(ex);
  }, 1000);
}

function stopTimer() {
  state.timerRunning = false;
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function resetTimer(ex) {
  stopTimer();
  state.timerSec = ex.kind === "timer" ? ex.duration : ex.hold;
  updateTimerDisplay();
  const btn = document.getElementById("timer-start");
  if (btn) btn.textContent = ex.kind === "holdReps" ? "Старт утримання" : "Старт";
}

function finishTimer(ex) {
  stopTimer();
  beep();
  if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
  if (ex.kind === "holdReps") {
    state.reps += 1;
    state.timerSec = ex.hold;
    renderExercise();
  } else {
    state.timerSec = 0;
    updateTimerDisplay();
    const btn = document.getElementById("timer-start");
    if (btn) btn.textContent = "Готово ✓";
  }
}

function updateTimerDisplay() {
  const el = document.getElementById("timer-display");
  if (el) el.textContent = fmt(state.timerSec);
}

// Lazy-constructed to avoid autoplay-policy errors before user interaction.
let audioCtx = null;

function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.001;
    o.connect(g).connect(audioCtx.destination);
    const t = audioCtx.currentTime;
    g.gain.linearRampToValueAtTime(0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.start(t);
    o.stop(t + 0.65);
  } catch (_) {}
}
