#!/usr/bin/env python3
"""Aggregate activity-tracker daily logs into a time & energy report.

Reads tracker/logs/YYYY/YYYY-MM-DD.md files (markdown tables with columns
Time | Activity | Category | Energy | Notes) and prints, as markdown:

  - total time per category
  - average energy per category
  - average energy by time of day
  - most energizing / most draining activities

Usage:
  report.py --day 2026-07-15
  report.py --last 7                 # last 7 days including today
  report.py --from 2026-07-01 --to 2026-07-15
"""

import argparse
import datetime as dt
import re
import sys
from pathlib import Path

ROW_RE = re.compile(
    r"^\|\s*(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})\s*"
    r"\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|"
)

DAYPARTS = [
    ("early morning (05-08)", 5, 8),
    ("morning (08-12)", 8, 12),
    ("afternoon (12-17)", 12, 17),
    ("evening (17-21)", 17, 21),
    ("night (21-05)", 21, 29),  # wraps past midnight
]


def find_logs_root(start: Path) -> Path:
    """Walk up from start looking for tracker/logs."""
    for base in [start, *start.parents]:
        candidate = base / "tracker" / "logs"
        if candidate.is_dir():
            return candidate
    sys.exit("error: tracker/logs directory not found (run from inside the repo)")


def parse_file(path: Path, day: dt.date):
    entries = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = ROW_RE.match(line.strip())
        if not m:
            continue
        h1, m1, h2, m2 = (int(g) for g in m.groups()[:4])
        activity, category, energy_raw, notes = (g.strip() for g in m.groups()[4:])
        if activity.lower() == "activity" or set(activity) <= {"-", " ", ":"}:
            continue  # header or separator row
        start = h1 * 60 + m1
        end = h2 * 60 + m2
        if end <= start:
            end += 24 * 60  # crosses midnight
        energy = None
        em = re.search(r"[1-5]", energy_raw)
        if em:
            energy = int(em.group())
        entries.append(
            {
                "date": day,
                "start_min": start,
                "minutes": end - start,
                "activity": activity,
                "category": category.lower() or "(uncategorized)",
                "energy": energy,
                "notes": notes,
            }
        )
    return entries


def hm(minutes: int) -> str:
    h, m = divmod(int(minutes), 60)
    return f"{h}h {m:02d}m" if h else f"{m}m"


def mean(xs):
    xs = [x for x in xs if x is not None]
    return sum(xs) / len(xs) if xs else None


def fmt_energy(v) -> str:
    return f"{v:.1f}" if v is not None else "–"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--day")
    ap.add_argument("--last", type=int, metavar="N")
    ap.add_argument("--from", dest="date_from")
    ap.add_argument("--to", dest="date_to")
    args = ap.parse_args()

    today = dt.date.today()
    if args.day:
        d0 = d1 = dt.date.fromisoformat(args.day)
    elif args.last:
        d1 = today
        d0 = today - dt.timedelta(days=args.last - 1)
    elif args.date_from:
        d0 = dt.date.fromisoformat(args.date_from)
        d1 = dt.date.fromisoformat(args.date_to) if args.date_to else today
    else:
        d1 = today
        d0 = today - dt.timedelta(days=6)

    logs_root = find_logs_root(Path.cwd())
    entries = []
    days_with_data = set()
    d = d0
    while d <= d1:
        path = logs_root / str(d.year) / f"{d.isoformat()}.md"
        if path.is_file():
            found = parse_file(path, d)
            if found:
                days_with_data.add(d)
                entries.extend(found)
        d += dt.timedelta(days=1)

    span = f"{d0.isoformat()} to {d1.isoformat()}" if d0 != d1 else d0.isoformat()
    print(f"# Activity report: {span}\n")
    if not entries:
        print("No logged entries in this period.")
        return
    print(
        f"{len(entries)} entries over {len(days_with_data)} day(s), "
        f"total logged time {hm(sum(e['minutes'] for e in entries))}.\n"
    )

    # Time and energy per category
    cats = {}
    for e in entries:
        cats.setdefault(e["category"], []).append(e)
    print("## Time & energy by category\n")
    print("| Category | Time | Share | Avg energy |")
    print("|----------|------|-------|------------|")
    total = sum(e["minutes"] for e in entries)
    for cat, es in sorted(cats.items(), key=lambda kv: -sum(e["minutes"] for e in kv[1])):
        t = sum(e["minutes"] for e in es)
        avg = mean([e["energy"] for e in es])
        print(f"| {cat} | {hm(t)} | {t / total:.0%} | {fmt_energy(avg)} |")

    # Energy by time of day (weighted by minutes overlapped)
    print("\n## Energy by time of day\n")
    print("| Part of day | Logged time | Avg energy |")
    print("|-------------|-------------|------------|")
    for label, h_start, h_end in DAYPARTS:
        lo, hi = h_start * 60, h_end * 60
        t = 0
        weighted = 0.0
        weighted_t = 0
        for e in entries:
            overlap = min(e["start_min"] + e["minutes"], hi) - max(e["start_min"], lo)
            if overlap <= 0:
                continue
            t += overlap
            if e["energy"] is not None:
                weighted += e["energy"] * overlap
                weighted_t += overlap
        avg = weighted / weighted_t if weighted_t else None
        print(f"| {label} | {hm(t)} | {fmt_energy(avg)} |")

    # Extremes
    rated = [e for e in entries if e["energy"] is not None]
    if rated:
        print("\n## Highlights\n")
        best = sorted(rated, key=lambda e: (-e["energy"], -e["minutes"]))[:3]
        worst = sorted(rated, key=lambda e: (e["energy"], -e["minutes"]))[:3]
        print("Most energizing:")
        for e in best:
            print(f"- {e['activity']} ({e['category']}, {hm(e['minutes'])}) — energy {e['energy']}")
        print("\nMost draining:")
        for e in worst:
            print(f"- {e['activity']} ({e['category']}, {hm(e['minutes'])}) — energy {e['energy']}")


if __name__ == "__main__":
    main()
