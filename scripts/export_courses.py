"""Export the courses table from the old SQLite database into src/data/courses.json.

The site reads this JSON at build time and from /api/courses, so no separate
backend server is needed.

Usage:
    python scripts/export_courses.py [path/to/onlinecoursecompare.db]
    python scripts/export_courses.py --clean-existing   # repair the current JSON only
"""
import json
import re
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


# Some titles were saved with their UTF-8 bytes read as Windows-1252, so
# "Diseñando" shows up as "DiseÃ±ando" and "–" as "â€“". fix_text first tries
# the whole string; otherwise it repairs only the garbled runs (a UTF-8 lead
# byte followed by the right number of continuation bytes, as Windows-1252
# shows them), so correct accents are left alone.
_BYTE_OF = {}
for _b in range(0x80, 0xA0):
    try:
        _BYTE_OF[bytes([_b]).decode("cp1252")] = _b
    except UnicodeDecodeError:
        _BYTE_OF[chr(_b)] = _b  # bytes cp1252 leaves undefined show up as-is
_CONT = "[-¿ŒœŠšŸŽžƒˆ˜–—‘-„†-•…‰‹›€™]"
_GARBLED = re.compile(f"[Â-ß]{_CONT}|[à-ï]{_CONT}{{2}}|[ð-ô]{_CONT}{{3}}")


def _byte(ch):
    # Characters below 256 are their own byte (some text was garbled as
    # Latin-1, which keeps 0x80-0x9F as invisible control characters); the
    # Windows-1252 symbols (€, ", ™, ...) map back to their byte.
    code = ord(ch)
    if code < 0x100:
        return code
    return _BYTE_OF.get(ch)


def fix_text(text):
    if not text:
        return text

    # Best case: the whole string turns back into clean UTF-8 (this also
    # restores Japanese, Korean and Chinese text).
    whole = [_byte(ch) for ch in text]
    if None not in whole:
        try:
            return bytes(whole).decode("utf-8")
        except UnicodeDecodeError:
            pass

    def repair(match):
        raw = [_byte(ch) for ch in match.group(0)]
        if None in raw:
            return match.group(0)
        try:
            return bytes(raw).decode("utf-8")
        except UnicodeDecodeError:
            return match.group(0)

    return _GARBLED.sub(repair, text)


# Text that is still unreadable after fix_text (some language editions lost
# bytes when they were saved).
_LEFTOVER = re.compile("[Â-ô][-¿]")


def is_garbled(text):
    return bool(text) and len(_LEFTOVER.findall(text)) >= 2


def pricing(platform, price):
    # Coursera lists most courses at $0, but that means "free to audit":
    # the certificate (and some graded work) still costs money.
    if price is None:
        return "unknown"
    if price == 0:
        return "audit" if platform == "Coursera" else "free"
    return "paid"


def rescue_title(title):
    """A mostly-English title with a broken invisible character in it is
    cleaned up; anything else is returned unchanged."""
    if not is_garbled(title):
        return title
    stripped = re.sub(r"\s+", " ", re.sub("[Â-ô][-¿ -⁯]{1,3}", "", title)).strip()
    letters = [ch for ch in stripped if ch.isalpha()]
    if letters and not is_garbled(stripped) and sum(ch.isascii() for ch in letters) / len(letters) > 0.9:
        return stripped
    return title


def clean_course(course):
    """Repairs garbled text. Returns None for a course whose title can't be
    read, so it is never shown with a broken name."""
    # Zero-width characters are invisible but break search; drop them.
    title = re.sub("[​-‍﻿]", "", rescue_title(fix_text(course["title"])))
    if is_garbled(title):
        return None
    course["title"] = title
    for field in ("headline", "instructor_names"):
        value = fix_text(course.get(field))
        course[field] = None if is_garbled(value) else value
    return course


def clean_existing():
    """Re-clean src/data/courses.json in place, without the database."""
    courses = json.loads(OUT.read_text(encoding="utf-8"))
    kept = [c for c in (clean_course(dict(c)) for c in courses) if c]
    OUT.write_text(json.dumps(kept, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Kept {len(kept)} of {len(courses)} courses; dropped {len(courses) - len(kept)} with unreadable titles")


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

    before = len(courses)
    courses = [c for c in (clean_course(c) for c in courses) if c]
    print(f"Dropped {before - len(courses)} courses with unreadable titles")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(courses, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(courses)} courses to {OUT} ({OUT.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    if "--clean-existing" in sys.argv:
        clean_existing()
    else:
        main()
