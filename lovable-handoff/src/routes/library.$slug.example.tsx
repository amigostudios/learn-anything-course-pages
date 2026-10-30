// Example of how the course page wires the new components. The same page serves two routes:
//   /library/$slug           public course page (visitor or signed-in), access tags on lessons
//   /learn/$topicId          the enrolled view (the route can simply render CoursePage with the user's progress)
import { createFileRoute } from "@tanstack/react-router";
import "@/styles/courses.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CoursePage } from "@/components/course/CoursePage";
import type { Course, LessonAccess, LibraryCourse, ProgressState, Resource } from "@/components/course/types";

export const Route = createFileRoute("/library/$slug")({
  component: CourseRoute,
  // loader: unchanged — curriculum, resources, related courses, the user's progress, access rules
});

function CourseRoute() {
  const { slug } = Route.useParams();
  // const data = Route.useLoaderData();
  const user: { label: string } | null = null;

  // 1. The curriculum the loader already has, in the Course shape.
  const course: Course = {
    slug,
    title: "",
    description: "",
    level: "Beginner",
    lessonCount: 0,
    sittingsText: "about 4 sittings of 20 min", // the string the live page already computes
    updatedText: "Oct 27, 2026",
    category: "Everyday essentials",
    prerequisites: [],
    modules: [], // { title, description, lessons: [{ title, description }] }
  };

  // 2. Progress from the existing store: ids are `${moduleIndex}-${lessonIndex}`.
  //    `now` is the first incomplete lesson (null when nothing has been started).
  const progress: ProgressState = { done: new Set<string>(), now: null };

  // 3. Lesson links: the same route + search params the current page uses.
  const lessonHref = (mi: number, li: number) =>
    `/learn/${slug}/${mi}-${li}?topic=${encodeURIComponent(course.title)}&level=${course.level.toLowerCase()}`;

  // 4. Public access tags (only for visitors / not-yet-enrolled). Return null to show nothing.
  const access = (lessonId: string, lessonNumber: number): LessonAccess | null => (lessonNumber === 1 ? "open" : "signin");

  const resources: Resource[] = []; // { kind: "book" | "youtube" | "article" | "course" | "tool", title, provider, url }
  const related: LibraryCourse[] = []; // same shape as the library cards

  return (
    <div className="la-app">
      <CoursePage
        header={<SiteHeader tone="sky" user={user} />}
        course={course}
        progress={progress}
        lessonHref={lessonHref}
        access={user ? undefined : access}
        resources={resources}
        related={related}
        shareUrl={`https://learn-anything-public.site/library/${slug}`}
        categoryHref="/library"
        review={{ unlocked: progress.done.size >= course.lessonCount && course.lessonCount > 0, onStart: () => {} }}
      />
      <SiteFooter />
    </div>
  );
}
