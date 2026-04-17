import { useEffect, useMemo, useReducer, useRef } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import type { Exercise } from "@mom/shared";
import { getWeek } from "../data/weeks";
import { POSITIONS } from "../data/positions";
import { SESSIONS, WEEKDAYS } from "../data/week-01-02";
import {
  WEEKDAY_SLUGS,
  type SessionId,
  type WeekdaySlug,
} from "../data/types";
import { currentDay, getStartDate } from "../lib/settings";
import { Icon, type IconName } from "../lib/icons";

interface RunnerState {
  idx: number;
  side: 0 | 1;
  reps: number;
  timerSec: number;
  timerRunning: boolean;
  finished: boolean;
}

type Action =
  | { type: "next"; total: number; nextInit: number }
  | { type: "prev"; prevInit: number }
  | { type: "setSide"; side: 0 | 1; init: number }
  | { type: "restart"; init: number }
  | { type: "reps+"; max?: number }
  | { type: "reps-" }
  | { type: "timer-tick" }
  | { type: "timer-toggle"; init: number }
  | { type: "timer-reset"; init: number };

function reducer(s: RunnerState, a: Action): RunnerState {
  switch (a.type) {
    case "next": {
      const nextIdx = s.idx + 1;
      if (nextIdx >= a.total) return { ...s, finished: true, timerRunning: false };
      return { idx: nextIdx, side: 0, reps: 0, timerSec: a.nextInit, timerRunning: false, finished: false };
    }
    case "prev": {
      if (s.idx === 0) return s;
      return { idx: s.idx - 1, side: 0, reps: 0, timerSec: a.prevInit, timerRunning: false, finished: false };
    }
    case "setSide":
      return { ...s, side: a.side, reps: 0, timerSec: a.init, timerRunning: false };
    case "restart":
      return { idx: 0, side: 0, reps: 0, timerSec: a.init, timerRunning: false, finished: false };
    case "reps+":
      return { ...s, reps: a.max != null ? Math.min(s.reps + 1, a.max * 2) : s.reps + 1 };
    case "reps-":
      return { ...s, reps: Math.max(0, s.reps - 1) };
    case "timer-tick":
      if (s.timerSec <= 1) return { ...s, timerSec: 0, timerRunning: false };
      return { ...s, timerSec: s.timerSec - 1 };
    case "timer-toggle":
      // Старт на 0 → автоматично перезаряджаємо.
      if (!s.timerRunning && s.timerSec === 0) {
        return { ...s, timerSec: a.init, timerRunning: true };
      }
      return { ...s, timerRunning: !s.timerRunning };
    case "timer-reset":
      return { ...s, timerSec: a.init, timerRunning: false };
  }
}

function initTimer(ex: Exercise | undefined): number {
  if (!ex) return 0;
  if (ex.kind === "timer") return ex.duration ?? 0;
  if (ex.kind === "holdReps") return ex.hold ?? 0;
  return 0;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExerciseRunnerPage() {
  const { weekId = "", dayId = "", sessionId = "" } = useParams();
  const navigate = useNavigate();
  const week = getWeek(weekId);
  const startDate = getStartDate();

  const slug = dayId as WeekdaySlug;
  const weekday = WEEKDAY_SLUGS[slug];
  const weekdayInfo = weekday !== undefined ? WEEKDAYS[weekday] : null;
  const session = sessionId as SessionId;
  const sessionInfo = SESSIONS[session] ?? null;

  const day = useMemo(() => (startDate ? currentDay(startDate) : null), [startDate]);

  const exercises = useMemo(() => {
    if (!week || week.kind !== "playable" || day == null || weekday === undefined || !sessionInfo) {
      return [];
    }
    return week.build(weekday, session, day);
  }, [week, weekday, session, sessionInfo, day]);

  const [state, dispatch] = useReducer(reducer, {
    idx: 0,
    side: 0,
    reps: 0,
    timerSec: initTimer(exercises[0]),
    timerRunning: false,
    finished: false,
  });

  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (!state.timerRunning) return;
    intervalRef.current = window.setInterval(() => dispatch({ type: "timer-tick" }), 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [state.timerRunning]);

  if (!week || week.kind !== "playable" || !weekdayInfo || !sessionInfo) {
    return <Navigate to="/" replace />;
  }
  if (!startDate || day == null) return <Navigate to={`/w/${weekId}`} replace />;
  if (exercises.length === 0) return <Navigate to={`/w/${weekId}`} replace />;

  if (state.finished) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-5">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Icon name="party" size={36} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Сесію завершено!</h2>
          <p className="mt-2 text-slate-500">Молодці. Відпочинок, вода, білок.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
            onClick={() => dispatch({ type: "restart", init: initTimer(exercises[0]) })}
          >
            <Icon name="rotate-ccw" size={16} />
            Спочатку
          </button>
          <button
            className="rounded-full bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-900"
            onClick={() => navigate(`/w/${weekId}`)}
          >
            Новий день
          </button>
        </div>
      </div>
    );
  }

  const ex = exercises[state.idx];
  const total = exercises.length;
  const prevEx = state.idx > 0 ? exercises[state.idx - 1] : null;
  const positionChanged = !prevEx || prevEx.position !== ex.position;
  const pos = POSITIONS[ex.position];

  const progress = (state.idx / total) * 100;
  const clampedDay = Math.min(Math.max(day, 1), week.totalDays);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Icon name={sessionInfo.icon} size={14} />
          {sessionInfo.label} · {weekdayInfo.long}
        </span>
        <span>
          День {clampedDay} / {week.totalDays}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-800 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <Icon name={pos.icon} size={14} />
          {pos.label} · {ex.block} · {state.idx + 1}/{total}
        </div>

        {positionChanged && (
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700">
              <Icon name={pos.icon} size={24} />
            </div>
            <div>
              <strong className="text-slate-800 uppercase tracking-wide">{pos.transitionTitle}</strong>
              <p className="mt-1 text-sm text-slate-600">{pos.transitionDesc}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Icon name={ex.icon as IconName} size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-slate-900">{ex.title}</h2>
            <p className="mt-2 text-slate-600 leading-relaxed whitespace-pre-line">{ex.desc}</p>
          </div>
        </div>

        {ex.sides && <SideControls ex={ex} state={state} dispatch={dispatch} />}

        {ex.kind === "timer" && <TimerBody state={state} dispatch={dispatch} init={ex.duration ?? 0} />}
        {ex.kind === "reps" && <RepsBody ex={ex} state={state} dispatch={dispatch} />}
        {ex.kind === "holdReps" && <HoldRepsBody ex={ex} state={state} dispatch={dispatch} />}

        {ex.hint && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
            <Icon name="lightbulb" size={16} className="mt-0.5 shrink-0" />
            <span>{ex.hint}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            onClick={() => {
              if (state.idx === 0) navigate(`/w/${weekId}`);
              else dispatch({ type: "prev", prevInit: initTimer(exercises[state.idx - 1]) });
            }}
          >
            <Icon name="arrow-left" size={16} />
            Назад
          </button>
          <button
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-900"
            onClick={() => dispatch({ type: "next", total, nextInit: initTimer(exercises[state.idx + 1]) })}
          >
            Далі
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SideControls({
  ex,
  state,
  dispatch,
}: {
  ex: Exercise;
  state: RunnerState;
  dispatch: React.Dispatch<Action>;
}) {
  const labels = ex.sideLabels ?? ["Ліва рука", "Права рука"];
  return (
    <div className="grid grid-cols-2 gap-2">
      {labels.map((label, i) => (
        <button
          key={i}
          onClick={() => dispatch({ type: "setSide", side: i as 0 | 1, init: initTimer(ex) })}
          className={[
            "rounded-xl px-4 py-2.5 text-sm font-medium transition",
            state.side === i
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200",
          ].join(" ")}
        >
          {i + 1}. {label}
        </button>
      ))}
    </div>
  );
}

function TimerBody({
  state,
  dispatch,
  init,
}: {
  state: RunnerState;
  dispatch: React.Dispatch<Action>;
  init: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-center space-y-3">
      <div className="text-5xl font-semibold tabular-nums text-slate-900">{fmt(state.timerSec)}</div>
      <div className="flex gap-2 justify-center">
        <button
          className="rounded-full bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-900"
          onClick={() => dispatch({ type: "timer-toggle", init })}
        >
          {state.timerRunning ? "Пауза" : "Старт"}
        </button>
        <button
          className="rounded-full bg-white border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          onClick={() => dispatch({ type: "timer-reset", init })}
        >
          Скинути
        </button>
      </div>
    </div>
  );
}

function RepsBody({
  ex,
  state,
  dispatch,
}: {
  ex: Exercise;
  state: RunnerState;
  dispatch: React.Dispatch<Action>;
}) {
  const target = ex.repsTarget ?? 0;
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">Виконано</div>
        <div className="text-3xl font-semibold tabular-nums text-slate-900">
          {state.reps} / {target}
        </div>
        <div className="mt-1 text-xs text-slate-500">
          Ціль: {target} {ex.repsLabel ?? ""}
        </div>
      </div>
      <RepsButtons dispatch={dispatch} />
    </div>
  );
}

function HoldRepsBody({
  ex,
  state,
  dispatch,
}: {
  ex: Exercise;
  state: RunnerState;
  dispatch: React.Dispatch<Action>;
}) {
  const target = ex.repsTarget ?? 0;
  const done = state.reps >= target;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5">
          <div className="text-xs text-slate-500">Утримання</div>
          <div className="font-semibold text-slate-900">{ex.hold} сек</div>
        </div>
        <div
          className={[
            "rounded-xl border px-4 py-2.5",
            done
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-slate-50 border-slate-200 text-slate-700",
          ].join(" ")}
        >
          <div className="text-xs opacity-70">Повтори</div>
          <div className="font-semibold">
            {state.reps} / {target}
          </div>
        </div>
      </div>
      <TimerBody state={state} dispatch={dispatch} init={ex.hold ?? 0} />
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
        <div className="text-sm text-slate-500">Зараховано повторів</div>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex size-10 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
            onClick={() => dispatch({ type: "reps-" })}
            aria-label="мінус"
          >
            <Icon name="minus" size={18} />
          </button>
          <div className="min-w-[2ch] text-2xl font-semibold tabular-nums text-slate-900 text-center">
            {state.reps}
          </div>
          <button
            className="inline-flex size-10 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-900"
            onClick={() => dispatch({ type: "reps+" })}
            aria-label="плюс"
          >
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RepsButtons({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="inline-flex size-11 items-center justify-center rounded-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
        onClick={() => dispatch({ type: "reps-" })}
        aria-label="мінус"
      >
        <Icon name="minus" size={20} />
      </button>
      <button
        className="inline-flex size-11 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-900"
        onClick={() => dispatch({ type: "reps+" })}
        aria-label="плюс"
      >
        <Icon name="plus" size={20} />
      </button>
    </div>
  );
}
