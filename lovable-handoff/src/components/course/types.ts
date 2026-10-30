import type { LucideIcon } from "lucide-react";

/** A course as the library lists it. `href` is the route to its course page (e.g. `/library/${slug}`). */
export interface LibraryCourse {
  slug: string;
  href: string;
  title: string;
  description: string;
  lessons: number;
  level: string;
  image?: string | null;
  /** Topic tag used by the library filters. Optional until courses carry tags. */
  tag?: string;
}

export interface LibraryTag {
  id: string;
  label: string;
  Icon?: LucideIcon;
}

/** One of the signed-in user's own courses, for the "Continue learning" strip. */
export interface MyCourse {
  href: string;
  title: string;
  done: number;
  total: number;
  image?: string | null;
  /** Title of the next lesson, shown as "next: …". */
  next?: string;
}

export interface LessonInfo {
  title: string;
  description: string;
}

export interface CourseModule {
  title: string;
  description: string;
  lessons: LessonInfo[];
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  level: string;
  lessonCount: number;
  /** e.g. "about 4 sittings of 20 min" (the live course page already computes this). */
  sittingsText?: string;
  /** e.g. "Oct 27, 2026" */
  updatedText?: string;
  /** Library section the course belongs to, for the breadcrumb. */
  category?: string;
  prerequisites: string[];
  modules: CourseModule[];
}

export type ResourceKind = "book" | "youtube" | "article" | "course" | "tool";

export interface Resource {
  kind: ResourceKind;
  title: string;
  provider: string;
  url: string;
}

/** Lesson ids are `${moduleIndex}-${lessonIndex}`, as in the existing progress store. */
export interface ProgressState {
  done: ReadonlySet<string>;
  /** The lesson to continue with, or null when nothing has been started. */
  now: string | null;
}

/** What a visitor may do with a lesson on the public course page. */
export type LessonAccess = "open" | "signin" | "pro";
