CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,
  week_id     TEXT NOT NULL,
  day_id      TEXT NOT NULL,
  date        TEXT NOT NULL,
  note        TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);

CREATE TABLE IF NOT EXISTS entries (
  id           TEXT PRIMARY KEY,
  session_id   TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  exercise_id  TEXT NOT NULL,
  side         INTEGER,
  reps_done    INTEGER,
  hold_sec     INTEGER,
  note         TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_entries_session ON entries(session_id);

CREATE TABLE IF NOT EXISTS set_notes (
  id          TEXT PRIMARY KEY,
  entry_id    TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  set_number  INTEGER NOT NULL,
  note        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_set_notes_entry ON set_notes(entry_id);
