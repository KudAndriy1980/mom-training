import type { Session } from "@mom/shared";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => fetch("/api/health").then(json<{ ok: boolean }>),
  listSessions: () => fetch("/api/sessions").then(json<Session[]>),
  createSession: (input: { weekId: string; dayId: string; date: string; note?: string | null }) =>
    fetch("/api/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    }).then(json<Session>),
};
