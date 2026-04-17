import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getWeek } from "../data/weeks";
import { SESSIONS, WEEKDAYS } from "../data/week-01-02";
import {
  WEEKDAY_BY_ID,
  type SessionId,
  type Weekday,
} from "../data/types";
import {
  currentDay,
  getStartDate,
  setStartDate,
  todayISO,
  weekOfDay,
} from "../lib/settings";
import { Icon } from "../lib/icons";

const WEEKDAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
const SESSION_ORDER: SessionId[] = ["morning", "day", "evening"];

export function SessionPickerPage() {
  const { weekId = "" } = useParams();
  const week = getWeek(weekId);

  const [start, setStart] = useState<string | null>(() => getStartDate());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(() => getStartDate() ?? todayISO());

  const todayWeekday = new Date().getDay() as Weekday;
  const [selectedWeekday, setSelectedWeekday] = useState<Weekday>(todayWeekday);

  if (!week || week.kind === "comingSoon") return <Navigate to="/" replace />;

  if (!start || editing) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            {start ? "Змінити дату старту" : "Коли ми починаємо?"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            За цією датою рахується день програми (1–14).
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Дата початку занять
            <input
              type="date"
              value={draft}
              max={todayISO()}
              onChange={(e) => setDraft(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-base text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          </label>
          <div className="flex gap-3">
            {editing && (
              <button
                className="flex-1 rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
                onClick={() => {
                  setEditing(false);
                  setDraft(start ?? todayISO());
                }}
              >
                Скасувати
              </button>
            )}
            <button
              className="flex-1 rounded-full bg-slate-800 px-5 py-3 text-sm font-medium text-white hover:bg-slate-900"
              onClick={() => {
                setStartDate(draft);
                setStart(draft);
                setEditing(false);
              }}
            >
              Зберегти
            </button>
          </div>
        </div>
      </div>
    );
  }

  const day = currentDay(start);
  const clampedDay = Math.min(Math.max(day, 1), week.totalDays);
  const pastProgram = day > week.totalDays;
  const wk = weekOfDay(day);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Сьогодні
        </div>
        <div className="mt-1 flex items-baseline gap-3 flex-wrap">
          <div className="text-2xl font-semibold text-slate-900">
            День {clampedDay} <span className="text-slate-400">/ {week.totalDays}</span>
          </div>
          <div className="text-slate-500">·</div>
          <div className="text-base font-medium text-slate-700">
            {pastProgram ? "Програму завершено" : wk === 1 ? "Тиждень 1" : "Тиждень 2"}
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Стартували: {start}
          {" · "}
          <button
            className="underline underline-offset-2 hover:text-slate-700"
            onClick={() => setEditing(true)}
          >
            змінити
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800">День тижня</h2>
        <p className="mt-1 text-sm text-slate-500">
          Впливає лише на ротацію кистей у денній сесії.
        </p>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_ORDER.map((id) => {
          const w = WEEKDAYS[id];
          const isToday = id === todayWeekday;
          const isSelected = id === selectedWeekday;
          return (
            <button
              key={id}
              onClick={() => setSelectedWeekday(id)}
              className={[
                "rounded-xl py-2.5 text-sm font-medium transition relative",
                isSelected
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              {w.short}
              {isToday && (
                <span
                  className={[
                    "absolute left-1/2 -translate-x-1/2 bottom-1 size-1 rounded-full",
                    isSelected ? "bg-white" : "bg-slate-900",
                  ].join(" ")}
                />
              )}
            </button>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-800 mt-2">Яка сесія?</h2>
      </div>
      <ul className="space-y-3">
        {SESSION_ORDER.map((sid) => {
          const s = SESSIONS[sid];
          return (
            <li key={sid}>
              <Link
                to={`/w/${week.id}/d/${WEEKDAY_BY_ID[selectedWeekday]}/s/${sid}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-800 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon name={s.icon} size={22} />
                  </div>
                  <div>
                    <div className="text-base font-semibold leading-tight">
                      {s.label}
                      <span className="ml-2 text-xs font-medium text-slate-400">
                        {s.duration}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 leading-tight">
                      {s.sub} · {s.goal}
                    </div>
                  </div>
                </div>
                <Icon name="chevron-right" size={20} className="text-slate-400" />
              </Link>
            </li>
          );
        })}
      </ul>

      <NutritionCard />
    </div>
  );
}

const WEEKLY_MENU: Array<{
  day: string;
  meals: Array<[string, string, string]>;
  total: string;
}> = [
  {
    day: "Понеділок",
    meals: [
      ["Ранок", "Омлет з 2 яєць + 50 г м'якого сиру + каша вівсяна на молоці", "~33 г"],
      ["Перекус", "ГЙ 150 г + МГ + мед", "~16 г"],
      ["Вечір", "150 г творогу з кефіром (паста) + 2 парові котлети з курки", "~40 г"],
    ],
    total: "~89 г",
  },
  {
    day: "Вівторок",
    meals: [
      ["Ранок", "Манна каша на молоці + 2 яйця всмятку + кефір з МГ", "~28 г"],
      ["Перекус", "Творог 100 г перетертий зі сметаною і бананом", "~18 г"],
      ["Вечір", "Суп-пюре з курки з овочами (зблендерити) + хліб м'який", "~30 г"],
    ],
    total: "~76 г",
  },
  {
    day: "Середа",
    meals: [
      ["Ранок", "Омлет з 2 яєць на молоці + ГЙ з МГ", "~28 г"],
      ["Перекус", "Кефір з бананом і МГ (збити блендером)", "~12 г"],
      ["Вечір", "Риба варена (тріска/хек) 150 г + картопляне пюре на молоці", "~32 г"],
    ],
    total: "~72 г",
  },
  {
    day: "Четвер",
    meals: [
      ["Ранок", "Каша вівсяна на молоці з МГ + 2 яйця всмятку + сир м'який 50 г", "~33 г"],
      ["Перекус", "ГЙ 150 г + мед", "~14 г"],
      ["Вечір", "Тефтелі з індички 2–3 шт в соусі + каша гречана (розварена)", "~35 г"],
    ],
    total: "~82 г",
  },
  {
    day: "П'ятниця",
    meals: [
      ["Ранок", "Сирники (з творогу, м'які) 3 шт зі сметаною + кефір з МГ", "~30 г"],
      ["Перекус", "Банан розім'ятий + ГЙ 150 г + МГ", "~16 г"],
      ["Вечір", "Суп-пюре з риби (лосось/хек + картопля + морква) + хліб", "~30 г"],
    ],
    total: "~76 г",
  },
  {
    day: "Субота",
    meals: [
      ["Ранок", "Омлет з 2 яєць + каша рисова на молоці + кефір", "~28 г"],
      ["Перекус", "Творог 100 г зі сметаною і МГ", "~20 г"],
      ["Вечір", "2 парові котлети зі свинини/яловичини + пюре на молоці + кефір", "~40 г"],
    ],
    total: "~88 г",
  },
  {
    day: "Неділя",
    meals: [
      ["Ранок", "Манна каша на молоці + 2 яйця всмятку + сир м'який 50 г", "~30 г"],
      ["Перекус", "Кефір з МГ і медом", "~10 г"],
      ["Вечір", "Фрикадельки курячі в бульйоні + вермішель розварена + ГЙ", "~35 г"],
    ],
    total: "~75 г",
  },
];

function NutritionCard() {
  const todayIdx = (new Date().getDay() + 6) % 7;
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(todayIdx);

  const menu = WEEKLY_MENU[selectedDay];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-slate-800 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <Icon name="utensils" size={18} className="text-slate-500" />
          <span className="text-base font-semibold">Харчування</span>
          <span className="text-xs text-slate-400">ціль ~84 г білка/день</span>
        </div>
        <Icon
          name="chevron-right"
          size={18}
          className={[
            "text-slate-400 transition-transform",
            open ? "rotate-90" : "",
          ].join(" ")}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 py-4 space-y-4 text-sm text-slate-700">
          <p className="text-xs text-slate-500">
            ГЙ = грецький йогурт, МГ = мелені горіхи (1 ст. л.). Усе м'яке, не потребує жування.
          </p>

          <div className="grid grid-cols-7 gap-1">
            {WEEKLY_MENU.map((m, i) => (
              <button
                key={m.day}
                onClick={() => setSelectedDay(i)}
                className={[
                  "rounded-lg py-1.5 text-xs font-medium transition",
                  i === selectedDay
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                ].join(" ")}
              >
                {m.day.slice(0, 2)}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900">{menu.day}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                {menu.total} білка
              </span>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100">
                {menu.meals.map(([time, desc, protein]) => (
                  <tr key={time}>
                    <td className="py-2 pr-3 font-medium text-slate-800 whitespace-nowrap align-top w-[70px]">
                      {time}
                    </td>
                    <td className="py-2 pr-2 text-slate-600">{desc}</td>
                    <td className="py-2 text-right text-slate-500 whitespace-nowrap align-top">
                      {protein}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="group">
            <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-700">
              Базові правила та що тримати в холодильнику
            </summary>
            <div className="mt-2 space-y-3 text-xs text-slate-600">
              <ul className="list-disc pl-4 space-y-1">
                <li>Вода — 1,5 л/день (включаючи кефір, бульйони, чай)</li>
                <li>М'ясо тільки фаршем — котлети, тефтелі, фрикадельки, суп-пюре</li>
                <li>Рибу — варену, перевіряти на кістки</li>
                <li>Каші — розварювати добре, на молоці</li>
                <li>Горіхи — тільки мелені, 2–3 ложки на день</li>
                <li>Овочі — варені або тушковані, м'які</li>
                <li>Хліб — м'який, білий, без скоринки</li>
              </ul>
              <p className="font-medium text-slate-700">Тримати готовим:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Котлети парові (наготувати, заморозити)</li>
                <li>Творог перетертий зі сметаною</li>
                <li>Мелені горіхи (змолоти склянку в банку)</li>
                <li>Кефір / ряжанка</li>
                <li>Грецький йогурт</li>
              </ul>
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-700">
              Аналізи (якщо ще не зроблені)
            </summary>
            <p className="mt-2 text-xs text-slate-600">
              ТТГ, Т4, B12, вітамін D, гемоглобін, загальний білок, глюкоза
            </p>
          </details>
        </div>
      )}
    </div>
  );
}
