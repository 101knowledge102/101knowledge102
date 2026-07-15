# Activity Tracker

A lightweight daily log of activities, time, and energy, managed through the
`activity-tracker` Claude Code skill (`.claude/skills/activity-tracker/`).

## How to use

Just talk to Claude in this repo:

- **Log as you go:** "log: 9:00-11:30 wrote the report, energy 3" — or in
  Chinese: "记录：下午两点到三点散步，精神很好". One line per activity.
- **Daily summary:** "how was my day?" at the end of the day.
- **Weekly review:** "weekly review" — where your time went, when your energy
  peaks and dips, what energizes or drains you.

## Layout

```
tracker/
  config.md            categories and preferences (edit freely)
  logs/
    2026/
      2026-07-15.md    one file per day
```

Each daily file is a plain markdown table, so it stays readable and editable
without any tools:

```markdown
# 2026-07-15 (Wednesday)

| Time | Activity | Category | Energy | Notes |
|------|----------|----------|--------|-------|
| 07:30-08:00 | Morning walk | health | 4 | sunny |
| 09:00-11:30 | Project proposal draft | work | 3 | hard to focus after 11 |
```

Energy is 1–5: 1 = drained, 3 = neutral, 5 = energized.

## Reports without Claude

The aggregation script works standalone:

```bash
python3 .claude/skills/activity-tracker/scripts/report.py --last 7
```
