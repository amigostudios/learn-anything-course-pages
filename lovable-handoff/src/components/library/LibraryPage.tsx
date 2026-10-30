import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Grid2x2, Search, X } from "lucide-react";
import { PlanetMark } from "../site/PlanetMark";
import { SkyBand } from "../site/SkyBand";
import { CourseCard } from "./CourseCard";
import { ContinueStrip } from "./ContinueStrip";
import type { LibraryCourse, LibraryTag, MyCourse } from "../course/types";

type Props = {
  /** The SiteHeader, rendered inside the sky band. */
  header: ReactNode;
  courses: LibraryCourse[];
  /** Topic filters. Omit (or pass []) until courses carry tags; the chips then do not render. */
  tags?: LibraryTag[];
  /** The signed-in user's courses for the "Continue learning" strip. */
  mine?: MyCourse[];
  /** Heading over the grid. The live library has one section, "Everyday essentials". */
  sectionTitle?: string;
  /** Where "Start a course" goes (the home page topic field). */
  startHref?: string;
  /** Where "All your courses" goes. */
  myCoursesHref?: string;
};

/**
 * The library: sky band with title, search and topic chips; continue strip; course grid; "start a course" promo.
 * Search and the chips filter client-side; the empty state points people to the home page field.
 */
export function LibraryPage({
  header,
  courses,
  tags = [],
  mine = [],
  sectionTitle = "Everyday essentials",
  startHref = "/#learn",
  myCoursesHref = "/",
}: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const q = query.trim().toLowerCase();

  const shown = useMemo(
    () => courses.filter((c) => (tag === "all" || c.tag === tag) && (!q || c.title.toLowerCase().includes(q))),
    [courses, tag, q],
  );
  const countFor = (id: string) => (id === "all" ? courses.length : courses.filter((c) => c.tag === id).length);
  const chips: LibraryTag[] = tags.length ? [{ id: "all", label: "All courses", Icon: Grid2x2 }, ...tags] : [];

  return (
    <>
      <SkyBand>
        {header}
        <div className="la-ph la-wrap">
          <p className="la-eyebrow">Free library</p>
          <h1 className="la-display">Ready-made courses, free to start.</h1>
          <p className="la-lede">
            Short, plain-language courses you can read and listen to right now. The first lesson of every course is
            open, no account needed.
          </p>
          <form className={"la-search" + (q ? " has-value" : "")} role="search" onSubmit={(e) => e.preventDefault()}>
            <Search aria-hidden="true" />
            <label className="la-sr-only" htmlFor="la-q">
              Search the library
            </label>
            <input
              id="la-q"
              type="text"
              inputMode="search"
              placeholder="Search the library"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="la-search-count">{shown.length} courses</span>
            <button className="la-search-clear" type="button" aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={16} aria-hidden="true" />
            </button>
          </form>
          {chips.length > 0 && (
            <div className="la-filters" role="group" aria-label="Filter by topic">
              {chips.map((t) => (
                <button key={t.id} type="button" aria-pressed={tag === t.id} onClick={() => setTag(t.id)}>
                  {t.Icon && <t.Icon aria-hidden="true" />}
                  {t.label} <i>{countFor(t.id)}</i>
                </button>
              ))}
            </div>
          )}
        </div>
      </SkyBand>

      <main className="la-wrap">
        <ContinueStrip courses={mine} allHref={myCoursesHref} />

        <section style={{ marginTop: mine.length ? 52 : 44 }}>
          <div className="la-sec-head">
            <h2>{sectionTitle}</h2>
            <p>{shown.length === courses.length ? `${courses.length} courses` : `${shown.length} of ${courses.length} courses`}</p>
          </div>
          <div className="la-grid-cards">
            {shown.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
          <p className={"la-empty" + (shown.length === 0 ? " on" : "")}>
            Nothing in the library matches that yet. Try another word, or{" "}
            <a href={startHref} style={{ color: "var(--la-blue)", fontWeight: 600 }}>
              start a course on it
            </a>
            .
          </p>
        </section>

        <section className="la-promo">
          <span className="la-ico">
            <PlanetMark size={30} tone="dark" />
          </span>
          <div>
            <h3>Don’t see your topic?</h3>
            <p>Type anything on the home page and a course on it is ready in about 20 seconds.</p>
          </div>
          <a className="la-btn la-btn-ink la-btn-lg" href={startHref}>
            Start a course <ArrowRight aria-hidden="true" strokeWidth={2.2} />
          </a>
        </section>
      </main>
    </>
  );
}
