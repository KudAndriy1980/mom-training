// Registry of weekly programs. Individual weeks register themselves by pushing
// into WEEKS from their own files (js/weeks/weekN.js). The UI reads from here
// to build the week picker and look up the active program.

const WEEKS = {};
const WEEK_ORDER = [];

function registerWeek(week) {
  if (WEEKS[week.id]) return;
  WEEKS[week.id] = week;
  WEEK_ORDER.push(week.id);
}

function getWeek(id) {
  return WEEKS[id] || null;
}

function listWeeks() {
  return WEEK_ORDER.map((id) => WEEKS[id]);
}

// Body positions shared across all weeks. Exercises are grouped by position
// so the user doesn't have to change posture more than necessary.
const POSITIONS = {
  lying: {
    emoji: "🛌",
    label: "Лежачи",
    transitionTitle: "Тепер лежачи",
    transitionDesc: "Ляжте на спину. Руки вздовж тіла, долонями догори. Під голову — невелика подушка.",
  },
  sitting: {
    emoji: "🪑",
    label: "Сидячи",
    transitionTitle: "Тепер сидячи",
    transitionDesc: "Сядьте зручно на стілець біля столу. Спина пряма, стопи на підлозі.",
  },
  standing: {
    emoji: "🧍",
    label: "Стоячи",
    transitionTitle: "Тепер стоячи",
    transitionDesc: "Встаньте біля опори (стіл / спинка стільця). Тримайтеся, якщо потрібно.",
  },
};

function getPosition(id) {
  return POSITIONS[id] || null;
}
