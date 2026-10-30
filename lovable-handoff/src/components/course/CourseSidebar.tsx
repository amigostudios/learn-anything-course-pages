import { BookOpen, CircleCheck, Compass, ExternalLink, FileText, GraduationCap, Info, Video } from "lucide-react";
import type { Course, Resource, ResourceKind } from "./types";

const KIND_ICON: Record<ResourceKind, typeof Compass> = {
  book: BookOpen,
  youtube: Video,
  article: FileText,
  course: GraduationCap,
  tool: Compass,
};

/**
 * The three cards beside the outline: what to have ready, the facts, and "Go deeper".
 * On desktop the first card floats up over the sky band; below 1024px they stack under the outline.
 */
export function CourseSidebar({ course, resources = [] }: { course: Course; resources?: Resource[] }) {
  return (
    <aside className="la-side" aria-label="Course details">
      {course.prerequisites.length > 0 && (
        <div className="la-panel is-float">
          <h3>Before you start</h3>
          <p className="la-sub">You’ll need</p>
          <ul className="la-check">
            {course.prerequisites.map((p, i) => (
              <li key={i}>
                <CircleCheck aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="la-panel is-soft">
        <h3>About this course</h3>
        <ul className="la-facts-sm">
          <li>
            <span>Level</span>
            <span>{course.level}, nothing assumed</span>
          </li>
          <li>
            <span>Length</span>
            <span>
              {course.lessonCount} lessons{course.sittingsText ? ` · ${course.sittingsText.replace(/ of .*$/, "")}` : ""}
            </span>
          </li>
          <li>
            <span>Format</span>
            <span>Narrated, key ideas on screen</span>
          </li>
          <li>
            <span>Quizzes</span>
            <span>After every lesson</span>
          </li>
          {course.updatedText && (
            <li>
              <span>Updated</span>
              <span>{course.updatedText}</span>
            </li>
          )}
        </ul>
        <p className="la-note">
          <Info aria-hidden="true" />
          <span>AI-generated course. Check anything you’d act on with a qualified source.</span>
        </p>
      </div>
      {resources.length > 0 && (
        <div className="la-panel is-soft">
          <h3>Go deeper</h3>
          <p className="la-sub">Books, videos and articles on the topic. Not used as sources for the lessons.</p>
          <ul className="la-res">
            {resources.map((r, i) => {
              const Icon = KIND_ICON[r.kind] ?? Compass;
              return (
                <li key={i}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    <span className="la-res-ico">
                      <Icon aria-hidden="true" />
                    </span>
                    <span>
                      <span className="la-res-t">{r.title}</span>
                      <br />
                      <span className="la-res-p">{r.provider}</span>
                    </span>
                    <ExternalLink className="la-res-ext" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
