import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Icon } from "../lib/icons";

export function Layout() {
  const { pathname } = useLocation();
  const atRoot = pathname === "/";
  return (
    <div className="mx-auto max-w-2xl min-h-full px-4 pt-6 pb-24">
      <header className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight text-slate-800 hover:text-slate-600"
        >
          Вправи
        </Link>
        {!atRoot && (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            <Icon name="arrow-left" size={14} />
            До тижнів
          </Link>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <QrFooter />
    </div>
  );
}

function QrFooter() {
  const [open, setOpen] = useState(false);
  const [lanUrl, setLanUrl] = useState<string | null>(null);

  if (!lanUrl) {
    const { protocol, hostname, port } = window.location;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    if (!isLocal) {
      setLanUrl(`${protocol}//${hostname}${port ? `:${port}` : ""}`);
    } else {
      fetch("/api/ip")
        .then((r) => r.json())
        .then((d: { ip: string }) => {
          setLanUrl(`${protocol}//${d.ip}${port ? `:${port}` : ""}`);
        })
        .catch(() => {
          setLanUrl(`${protocol}//${hostname}${port ? `:${port}` : ""}`);
        });
    }
  }

  if (!lanUrl) return null;

  return (
    <footer className="mt-12 border-t border-slate-200 pt-4 flex flex-col items-center gap-3">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition"
      >
        <Icon name="target" size={12} />
        {open ? "Сховати QR" : "Відкрити на телефоні"}
      </button>
      {open && (
        <div className="flex flex-col items-center gap-2 pb-2">
          <QRCodeSVG value={lanUrl} size={140} level="M" />
          <p className="text-xs text-slate-400 text-center select-all break-all">{lanUrl}</p>
        </div>
      )}
    </footer>
  );
}
