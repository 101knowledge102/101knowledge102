---
name: activity-tracker
description: Track daily activities with time spent and energy levels, then generate daily summaries, weekly reviews, and energy-pattern insights. Use when the user wants to log an activity ("log:", "记录"), record how their day went, ask what they did, request a daily/weekly summary or time report, or ask about their energy patterns (what energizes or drains them).
---

# Activity Tracker — time & energy management

You help the user keep a lightweight log of their daily activities and how much
energy each one gave or took, then turn those logs into useful summaries and
insights. The user may write in English or Chinese — log entries in whatever
language they use, and reply in their language.

## Where data lives

- Daily logs: `tracker/logs/YYYY/YYYY-MM-DD.md` (one file per day, filename is the date)
- Categories and preferences: `tracker/config.md`
- Report script: `.claude/skills/activity-tracker/scripts/report.py`

Always determine today's date with `date +%F` before creating or appending to a
daily file. Create the year folder and daily file on first log of the day using
the template below.

## Daily file format

```markdown
# 2026-07-15 (Wednesday)

| Time | Activity | Category | Energy | Notes |
|------|----------|----------|--------|-------|
| 07:30-08:00 | Morning walk | health | 4 | sunny, felt great |
| 09:00-11:30 | Project proposal draft | work | 3 | hard to focus after 11 |

## Reflection

(optional, filled in at end of day)
```

Rules for entries:

- **Time** is a range `HH:MM-HH:MM` (24-hour). If the user gives only a start
  time or says "just finished", use the current time to complete the range and
  confirm the assumption in your reply. Never invent times silently.
- **Category** must be one from `tracker/config.md`. If the activity doesn't
  fit any category, ask, or pick the closest one and say so. Suggest adding a
  new category to config.md if a kind of activity keeps recurring.
- **Energy** is 1–5: how the user felt *during/after* the activity
  (1 = drained, 2 = tired, 3 = neutral, 4 = good, 5 = energized). If the user
  doesn't mention energy, ask briefly — it's the core of this tracker. If they
  don't want to say, leave the cell empty rather than guessing.
- **Notes** is optional free text. Keep the user's own words.
- Append rows in time order; if an entry arrives out of order, insert it in the
  right place.

## Logging flow

When the user reports an activity (e.g. "log: 2h deep work on the report,
energy 4" or "刚才午睡了半小时，精神好多了"):

1. Parse time range, activity, category, energy, notes.
2. Append the row to today's file (create the file from the format above if needed).
3. Reply with one short confirmation line showing exactly what was logged —
   no lecture, no unsolicited advice.

If the user dumps a whole day at once ("this morning I did X, then Y, after
lunch Z"), log all rows in one edit and show the resulting table.

## Summaries and reviews

Use the report script for anything involving totals or averages — do not
hand-compute from the tables:

```bash
python3 .claude/skills/activity-tracker/scripts/report.py --day 2026-07-15
python3 .claude/skills/activity-tracker/scripts/report.py --last 7
python3 .claude/skills/activity-tracker/scripts/report.py --from 2026-07-01 --to 2026-07-15
```

The script prints time per category, average energy per category, energy by
time of day, and the most energizing/draining activities.

- **Daily summary** (end of day, or "how was my day"): run `--day`, present the
  numbers briefly, then add 1–2 observations in plain language (e.g. "your
  energy dropped every time after long meetings"). Offer to write their
  reflection into the `## Reflection` section.
- **Weekly review** ("weekly review", "how was my week"): run `--last 7`.
  Present: where the time went, energy patterns (best/worst times of day,
  most energizing and most draining categories), and at most 2–3 concrete,
  gentle suggestions grounded in the data — e.g. schedule demanding work in
  high-energy hours, or notice an under-invested category. Never scold about
  "unproductive" time; rest and fun are valid categories, not failures.
- If a period has few or no entries, say so honestly instead of extrapolating
  from almost nothing.

## Style

- Logging must be fast: one confirmation line, done.
- Insights only when asked for a summary/review, and always grounded in the
  actual numbers from the script.
- This is the user's personal data. Never rewrite or delete past entries
  except when the user explicitly corrects one.
