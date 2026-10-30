import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronRight, Clock, Headphones, Layers, Share2, Sprout } from "lucide-react";
import { SkyBand } from "../site/SkyBand";
import { CourseCard } from "../library/CourseCard";
import { CourseOutline } from "./CourseOutline";
import { CourseSidebar } from "./CourseSidebar";
import type { Course, LessonAccess, LibraryCourse, ProgressState, Resource } from "./types";

type Props = {
  /** The SiteHeader, rendered inside the sky band. */
  header: ReactNode;
  course: Course;
  progress: ProgressState;
  lessonHref: (moduleIndex: number, lessonIndex: number) => string;
  /** Public course page: per-lesson access tags. Omit for enrolled learners. */
  access?: (lessonId: string, lessonNumber: number) => LessonAccess | null;
  resources?: Resource[];
  related?: LibraryCourse[];
  /** Public URL to copy when "Share" is pressed. Omit to hide the button. */
  shareUrl?: string;
  /** Breadcrumb target for the course's library section. */
  categoryHref?: string;
  review?: { unlocked: boolean; href?: string; onStart?: () => void };
};

function findLesson(course: Course, id: string) {
  const [mi, li] = id.split("-").map(Number);
  return course.modules[mi]?.lessons[li] ?? null;
}

/**
 * One course page for visitors and enrolled learners.
 * Hero (breadcrumb, title, meta, Start / Continue, progress), the outline path beside the detail cards,
 * related courses, and on phones a sticky continue bar once the hero button has scrolled away.
 */
export function CoursePage({
  header,
  course,
  progress,
  lessonHref,
  access,
  resources = [],
  related = [],
  shareUrl,
  categoryHref = "/library",
  review,
}: Props) {
  const doneCount = progress.done.size;
  const pct = course.lessonCount ? Math.round((doneCount / course.lessonCount) * 100) : 0;
  const started = doneCount > 0 || !!progress.now;
  const nowId = progress.now ?? "0-0";
  const [nm, nl] = nowId.split("-").map(Number);
  const nowLesson = findLesson(course, nowId);
  const ctaHref = lessonHref(nm, nl);
  const ctaText = started && nowLesson ? `Continue · ${nowLesson.title}` : "Start the course";

  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [stickyOn, setStickyOn] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setStickyOn(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [copied, setCopied] = useState(false);
  const share = async () => {
    if (!shareUrl) return;
    try {
      if (navigator.share) await navigator.share({ title: course.title, url: shareUrl });
      else await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* dismissed */
    }
  };

  return (
    <>
      <SkyBand>
        {header}
        <div className="la-ph la-ch la-wrap">
          <nav className="la-crumbs" aria-label="Breadcrumb">
            <Link to="/library">Library</Link>
            {course.category && (
              <>
                <ChevronRight aria-hidden="true" />
                <Link to={categoryHref}>{course.category}</Link>
              </>
            )}
            <ChevronRight aria-hidden="true" />
            <span aria-current="page">{course.title}</span>
          </nav>
          <h1 className="la-display">{course.title}</h1>
          <p className="la-lede">{course.description}</p>
          <div className="la-ch-meta">
            <span>
              <Layers aria-hidden="true" />
              {course.lessonCount} lessons
            </span>
            {course.sittingsText && (
              <span>
                <Clock aria-hidden="true" />
                {course.sittingsText.charAt(0).toUpperCase() + course.sittingsText.slice(1)}
              </span>
            )}
            <span>
              <Sprout aria-hidden="true" />
              {course.level}
            </span>
            <span>
              <Headphones aria-hidden="true" />
              Narrated
            </span>
            {course.updatedText && <span>Updated {course.updatedText}</span>}
          </div>
          <div className="la-cta-row">
            <Link ref={ctaRef} className="la-btn la-btn-white la-btn-lg" to={ctaHref}>
              {ctaText}
              <ArrowRight aria-hidden="true" />
            </Link>
            {shareUrl && (
              <button className="la-btn la-btn-ghost la-btn-lg" type="button" onClick={share}>
                {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
                {copied ? "Link copied" : "Share"}
              </button>
            )}
          </div>
          {started && (
            <div className="la-ch-progress">
              <div className="la-bar">
                <i style={{ width: `${pct}%` }} />
              </div>
              <p>
                {doneCount} of {course.lessonCount} lessons done · {pct}%
              </p>
            </div>
          )}
        </div>
      </SkyBand>

      <main className="la-wrap la-course-grid">
        <div className="la-main">
          <div className="la-syll-head">
            <h2>Course outline</h2>
            <p>
              {course.modules.length} modules · {course.lessonCount} lessons · a short quiz after each
            </p>
          </div>
          <CourseOutline course={course} progress={progress} lessonHref={lessonHref} access={access} review={review} />
        </div>
        <CourseSidebar course={course} resources={resources} />
      </main>

      {related.length > 0 && (
        <section className="la-wrap la-related">
          <div className="la-sec-head">
            <h2>Related courses</h2>
            <Link to="/library">
              Browse the library <ArrowRight aria-hidden="true" strokeWidth={2.2} />
            </Link>
          </div>
          <div className="la-scroller">
            {related.map((c) => (
              <CourseCard key={c.slug} course={c} compact />
            ))}
          </div>
        </section>
      )}

      <div className={"la-stickybar" + (stickyOn ? " on" : "")} aria-hidden={!stickyOn}>
        <p>
          <b>{ctaText}</b>
          <span>{started ? `${doneCount} of ${course.lessonCount} lessons done` : `${course.lessonCount} lessons${course.sittingsText ? ` · ${course.sittingsText}` : ""}`}</span>
        </p>
        <Link className="la-btn la-btn-blue" to={ctaHref} tabIndex={stickyOn ? 0 : -1}>
          {started ? "Continue" : "Start"}
          <ArrowRight aria-hidden="true" strokeWidth={2.2} />
        </Link>
      </div>
    </>
  );
}
