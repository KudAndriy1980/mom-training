import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { randomUUID } from "node:crypto";
import { networkInterfaces } from "node:os";
import { z } from "zod";
import type { Session } from "@mom/shared";
import { db } from "./db.js";

function getLanIp(): string {
  const nets = networkInterfaces();
  for (const ifaces of Object.values(nets)) {
    for (const iface of ifaces ?? []) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "127.0.0.1";
}

const app = new Hono();
app.use("/api/*", cors());

app.get("/api/health", (c) => c.json({ ok: true }));
app.get("/api/ip", (c) => c.json({ ip: getLanIp() }));

const SessionInput = z.object({
  weekId: z.string().min(1),
  dayId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().nullish(),
});

app.get("/api/sessions", (c) => {
  const rows = db
    .prepare(
      `SELECT id, week_id as weekId, day_id as dayId, date, note, created_at as createdAt
       FROM sessions ORDER BY date DESC, created_at DESC`
    )
    .all() as Session[];
  return c.json(rows);
});

app.post("/api/sessions", async (c) => {
  const parsed = SessionInput.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const id = randomUUID();
  const { weekId, dayId, date, note } = parsed.data;
  db.prepare(
    `INSERT INTO sessions (id, week_id, day_id, date, note) VALUES (?, ?, ?, ?, ?)`
  ).run(id, weekId, dayId, date, note ?? null);
  const row = db
    .prepare(
      `SELECT id, week_id as weekId, day_id as dayId, date, note, created_at as createdAt
       FROM sessions WHERE id = ?`
    )
    .get(id) as Session;
  return c.json(row, 201);
});

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || "0.0.0.0";
serve({ fetch: app.fetch, port, hostname: host }, (info) => {
  console.log(`api  http://${info.address === "::" ? "0.0.0.0" : info.address}:${info.port}`);
});
