import { Link } from "react-router-dom";
import { WEEKS } from "../data/weeks";
import { Icon } from "../lib/icons";

export function WeekPickerPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Виберіть програму</h2>
        <p className="mt-1 text-sm text-slate-500">Тижні ускладнюються поступово.</p>
      </div>
      <ul className="space-y-3">
        {WEEKS.map((w) => {
          const soon = w.kind === "comingSoon";
          const card = (
            <div
              className={[
                "flex items-center justify-between rounded-2xl border px-5 py-4 transition",
                soon
                  ? "border-slate-200 bg-slate-50 text-slate-400"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:shadow-sm",
              ].join(" ")}
            >
              <div>
                <div className="text-base font-semibold">{w.label}</div>
                <div className="text-sm text-slate-500">{w.description}</div>
                {soon && (
                  <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Скоро
                  </span>
                )}
              </div>
              {!soon && <Icon name="chevron-right" size={20} className="text-slate-400" />}
            </div>
          );
          return (
            <li key={w.id}>{soon ? card : <Link to={`/w/${w.id}`}>{card}</Link>}</li>
          );
        })}
      </ul>
    </div>
  );
}
