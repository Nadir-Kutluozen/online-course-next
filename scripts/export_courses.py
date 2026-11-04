"""Export the courses table from the old SQLite database into src/data/courses.json.

The site reads this JSON at build time and from /api/courses, so no separate
backend server is needed.

Usage:
    python scripts/export_courses.py [path/to/onlinecoursecompare.db]
"""
import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DB = ROOT.parent / "online-course-compare" / "backend" / "onlinecoursecompare.db"
OUT = ROOT / "src" / "data" / "courses.json"


def full_url(url):
    if not url:
        return None
    if url.startswith("http://") or url.startswith("https://"):
        return url
    # Udemy rows store only the path, e.g. /course/some-slug/
    return f"https://www.udemy.com{url}"


def pricing(platform, price):
    # Coursera lists most courses at $0, but that means "free to audit":
    # the certificate (and some graded work) still costs money.
    if price is None:
        return "unknown"
    if price == 0:
        return "audit" if platform == "Coursera" else "free"
    return "paid"


def main():
    db_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DB
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM courses ORDER BY rowid").fetchall()

    courses = []
    for r in rows:
        courses.append({
            "id": r["course_id"],
            "title": (r["title"] or "").strip(),
            "headline": r["headline"],
            "url": full_url(r["url"]),
            "image": r["image"],
            "platform": r["platform"],
            "price": r["price"],
            "currency": r["currency"],
            "pricing": pricing(r["platform"], r["price"]),
            "rating": round(r["rating"], 2) if r["rating"] is not None else None,
            "num_reviews": r["num_reviews"],
            "num_subscribers": r["num_subscribers"],
            "num_lectures": r["num_lectures"],
            "course_length": r["course_length"],
            "level": r["level"],
            "locale": r["locale"],
            "instructor_names": r["instructor_names"],
            "category": r["category"],
            "badge": r["badge"],
            "updated": r["updated"],
        })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(courses, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(courses)} courses to {OUT} ({OUT.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
