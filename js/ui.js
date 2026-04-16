// All view rendering + event wiring. Reads the shared `state` object from
// main.js and the exercises registry from exercises.js / weeks/*.js.

function render() {
  if (!state.week) return renderWeekPicker();
  if (!state.day)  return renderDayPicker();
  if (state.idx >= state.exercises.length) return renderFinish();
  renderExercise();
}

function renderWeekPicker() {
  progressEl.hidden = true;
  dayPill.hidden = true;

  const items = listWeeks().map((w) => {
    const disabled = w.comingSoon ? "disabled" : "";
    const badge = w.comingSoon ? `<div class="badge">Скоро</div>` : "";
    return `
      <button class="pick-btn ${disabled}" data-week="${w.id}" ${disabled ? "disabled" : ""}>
        <span>${w.label}<small>${w.description}</small>${badge}</span>
        <span class="arrow">${w.comingSoon ? "" : "→"}</span>
      </button>
    `;
  }).join("");

  app.innerHTML = `
    <div class="card picker">
      <h2>Виберіть тиждень</h2>
      <p class="sub">Програми ускладнюються поступово.</p>
      ${items}
    </div>
  `;

  app.querySelectorAll(".pick-btn:not(.disabled)").forEach((btn) => {
    btn.addEventListener("click", () => selectWeek(btn.dataset.week));
  });
}

function renderDayPicker() {
  progressEl.hidden = true;
  dayPill.hidden = false;
  dayPill.textContent = state.week.label;

  const items = state.week.dayOrder.map((dayId) => {
    const d = state.week.dayProfiles[dayId];
    return `
      <button class="pick-btn" data-day="${dayId}">
        <span>${d.label}<small>${d.sub || ""}</small></span>
        <span class="arrow">→</span>
      </button>
    `;
  }).join("");

  app.innerHTML = `
    <div class="card picker">
      <h2>Який сьогодні день?</h2>
      <p class="sub">Від цього залежать утримання й повтори.</p>
      ${items}
      <div class="nav">
        <button class="btn btn-ghost btn-big" id="back-to-weeks">← До тижнів</button>
      </div>
    </div>
  `;

  app.querySelectorAll(".pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => selectDay(btn.dataset.day));
  });
  document.getElementById("back-to-weeks").addEventListener("click", () => {
    state.week = null;
    render();
  });
}

function renderExercise() {
  const ex = state.exercises[state.idx];
  const total = state.exercises.length;
  progressEl.hidden = false;
  progressBar.style.width = `${(state.idx / total) * 100}%`;
  dayPill.hidden = false;
  dayPill.textContent = `${state.week.label} · ${state.day.label}`;

  const prevEx = state.idx > 0 ? state.exercises[state.idx - 1] : null;
  const positionChanged = ex.position && (!prevEx || prevEx.position !== ex.position);
  const pos = getPosition(ex.position);

  const transitionBanner = positionChanged && pos ? `
    <div class="transition">
      <div class="transition-emoji">${pos.emoji}</div>
      <div>
        <strong>${pos.transitionTitle}</strong>
        <p>${pos.transitionDesc}</p>
      </div>
    </div>
  ` : "";

  const blockLabel = pos
    ? `${pos.emoji} ${pos.label} · ${ex.block} · ${state.idx + 1}/${total}`
    : `${ex.emoji} ${ex.block} · ${state.idx + 1}/${total}`;

  const sideControls = ex.sides ? renderSideControls(ex) : "";
  let body = "";
  if (ex.kind === "timer")    body = renderTimerBody(ex);
  if (ex.kind === "reps")     body = renderRepsBody(ex);
  if (ex.kind === "holdReps") body = renderHoldRepsBody(ex);

  const hint = ex.hint ? `<div class="hint">💡 ${ex.hint}</div>` : "";

  app.innerHTML = `
    <div class="card">
      <div class="block-label">${blockLabel}</div>
      ${transitionBanner}
      <h2 class="exercise-title">${ex.title}</h2>
      <p class="exercise-desc">${ex.desc}</p>
      ${sideControls}
      ${body}
      ${hint}
      <div class="nav">
        <button class="btn btn-secondary btn-big" id="prev-btn">← Назад</button>
        <button class="btn btn-primary btn-big" id="next-btn">Далі →</button>
      </div>
    </div>
  `;

  document.getElementById("prev-btn").addEventListener("click", prev);
  document.getElementById("next-btn").addEventListener("click", next);
  wireBody(ex);
}

function renderSideControls(ex) {
  const labels = ex.sideLabels || ["Ліва рука", "Права рука"];
  return `
    <div class="side">
      <button class="side-btn ${state.side === 0 ? "active" : ""}" data-side="0">1. ${labels[0]}</button>
      <button class="side-btn ${state.side === 1 ? "active" : ""}" data-side="1">2. ${labels[1]}</button>
    </div>
  `;
}

function renderTimerBody() {
  return `
    <div class="timer">
      <div class="timer-display" id="timer-display">${fmt(state.timerSec)}</div>
      <div class="timer-actions">
        <button class="btn btn-primary" id="timer-start">${state.timerRunning ? "Пауза" : "Старт"}</button>
        <button class="btn btn-secondary" id="timer-reset">Скинути</button>
      </div>
    </div>
  `;
}

function renderRepsBody(ex) {
  return `
    <div class="reps">
      <div>
        <div class="reps-label">Виконано</div>
        <div class="reps-count" id="reps-count">${state.reps} / ${ex.repsTarget}</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="reps-btn minus" id="reps-minus" aria-label="мінус">−</button>
        <button class="reps-btn" id="reps-plus" aria-label="плюс">+</button>
      </div>
    </div>
    <div class="targets">
      <div class="target">Ціль: ${ex.repsTarget} ${ex.repsLabel || ""}</div>
    </div>
  `;
}

function renderHoldRepsBody(ex) {
  const done = state.reps >= ex.repsTarget;
  return `
    <div class="targets">
      <div class="target">Утримання: ${ex.hold} сек</div>
      <div class="target ${done ? "ok" : ""}">Повтори: ${state.reps} / ${ex.repsTarget}</div>
    </div>
    <div class="timer">
      <div class="timer-display" id="timer-display">${fmt(state.timerSec)}</div>
      <div class="timer-actions">
        <button class="btn btn-primary" id="timer-start">${state.timerRunning ? "Пауза" : "Старт утримання"}</button>
        <button class="btn btn-secondary" id="timer-reset">Скинути</button>
      </div>
    </div>
    <div class="reps" style="margin-top:4px;">
      <div class="reps-label">Зараховано повторів</div>
      <div style="display:flex; gap:10px; align-items:center;">
        <button class="reps-btn minus" id="reps-minus">−</button>
        <div class="reps-count" id="reps-count">${state.reps}</div>
        <button class="reps-btn" id="reps-plus">+</button>
      </div>
    </div>
  `;
}

function wireBody(ex) {
  if (ex.sides) {
    app.querySelectorAll(".side-btn").forEach((b) => {
      b.addEventListener("click", () => {
        state.side = parseInt(b.dataset.side, 10);
        state.reps = 0;
        stopTimer();
        if (ex.kind === "timer")    state.timerSec = ex.duration;
        if (ex.kind === "holdReps") state.timerSec = ex.hold;
        renderExercise();
      });
    });
  }
  if (ex.kind === "timer") {
    document.getElementById("timer-start").addEventListener("click", () => toggleTimer(ex));
    document.getElementById("timer-reset").addEventListener("click", () => resetTimer(ex));
  }
  if (ex.kind === "reps") {
    document.getElementById("reps-plus").addEventListener("click", () => changeReps(+1, ex));
    document.getElementById("reps-minus").addEventListener("click", () => changeReps(-1, ex));
  }
  if (ex.kind === "holdReps") {
    document.getElementById("timer-start").addEventListener("click", () => toggleTimer(ex));
    document.getElementById("timer-reset").addEventListener("click", () => resetTimer(ex));
    document.getElementById("reps-plus").addEventListener("click", () => changeReps(+1, ex));
    document.getElementById("reps-minus").addEventListener("click", () => changeReps(-1, ex));
  }
}

function changeReps(delta, ex) {
  state.reps = Math.max(0, state.reps + delta);
  if (ex.kind === "reps") {
    const el = document.getElementById("reps-count");
    if (el) el.textContent = `${state.reps} / ${ex.repsTarget}`;
  } else {
    renderExercise();
  }
}

function renderFinish() {
  progressBar.style.width = "100%";
  app.innerHTML = `
    <div class="card finish">
      <div class="finish-emoji">🎉</div>
      <h2>Сесію завершено!</h2>
      <p>Молодці. Відпочинок, вода, білок.</p>
      <div class="nav" style="max-width:320px; margin:0 auto;">
        <button class="btn btn-secondary btn-big" id="restart">↺ Спочатку</button>
        <button class="btn btn-primary btn-big" id="new-day">Новий день</button>
      </div>
    </div>
  `;
  document.getElementById("restart").addEventListener("click", () => {
    state.idx = 0;
    resetExerciseState();
    render();
  });
  document.getElementById("new-day").addEventListener("click", () => {
    state.day = null;
    state.idx = 0;
    render();
  });
}
