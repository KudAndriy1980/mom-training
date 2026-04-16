// Application state, DOM refs, navigation, and entry point.

const state = {
  week: null,        // week program object
  day: null,         // day profile object
  exercises: [],     // current week+day exercise list
  idx: 0,            // current exercise index
  side: 0,           // 0 = first side (left), 1 = second side (right)
  reps: 0,           // current rep counter
  timerSec: 0,
  timerRunning: false,
  timerInterval: null,
};

// DOM refs (script runs with defer — DOM is ready).
const app         = document.getElementById("app");
const dayPill     = document.getElementById("day-pill");
const progressEl  = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");

// Header pill: go back to week picker.
dayPill.addEventListener("click", () => {
  stopTimer();
  state.week = null;
  state.day = null;
  state.idx = 0;
  resetExerciseState();
  render();
});

function selectWeek(weekId) {
  const week = getWeek(weekId);
  if (!week || week.comingSoon) return;
  state.week = week;
  state.day = null;
  state.idx = 0;
  resetExerciseState();
  render();
}

function selectDay(dayId) {
  if (!state.week) return;
  const profile = state.week.dayProfiles[dayId];
  if (!profile) return;
  state.day = profile;
  state.exercises = state.week.buildExercises(profile);
  state.idx = 0;
  resetExerciseState();
  render();
}

function resetExerciseState() {
  state.side = 0;
  state.reps = 0;
  stopTimer();
  const ex = state.exercises[state.idx];
  if (!ex) return;
  if (ex.kind === "timer")    state.timerSec = ex.duration;
  if (ex.kind === "holdReps") state.timerSec = ex.hold;
}

function next() {
  stopTimer();
  state.idx += 1;
  resetExerciseState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function prev() {
  stopTimer();
  if (state.idx === 0) {
    state.day = null;
    render();
    return;
  }
  state.idx -= 1;
  resetExerciseState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

render();
