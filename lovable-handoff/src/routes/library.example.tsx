// Example of how /library wires the new components. Keep the existing loader; map its rows into LibraryCourse.
import { createFileRoute } from "@tanstack/react-router";
import { ChefHat, House, Leaf, Wallet } from "lucide-react";
import "@/styles/courses.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LibraryPage } from "@/components/library/LibraryPage";
import type { LibraryCourse, LibraryTag, MyCourse } from "@/components/course/types";

export const Route = createFileRoute("/library")({
  component: LibraryRoute,
  // loader: unchanged — it already returns the public courses (title, description, slug, lessons, level, image)
});

// Optional topic chips. They only render when courses carry a `tag`; until then pass tags={[]} (or omit).
const TAGS: LibraryTag[] = [
  { id: "home", label: "Home & DIY", Icon: House },
  { id: "money", label: "Money", Icon: Wallet },
  { id: "kitchen", label: "Kitchen", Icon: ChefHat },
  { id: "outdoors", label: "Outdoors & animals", Icon: Leaf },
];

function LibraryRoute() {
  // const { courses, user, myCourses } = Route.useLoaderData();
  const user: { label: string } | null = null;

  // Map the loader rows into the card shape. `href` is the route to the public course page.
  const courses: LibraryCourse[] = [].map((c: any) => ({
    slug: c.slug,
    href: `/library/${c.slug}`,
    title: c.title,
    description: c.description,
    lessons: c.lessonCount,
    level: c.level.charAt(0).toUpperCase() + c.level.slice(1),
    image: c.imageUrl ?? null,
    tag: c.tag, // when tags exist
  }));

  // The signed-in user's own courses (the same data the home page's "Your courses" uses).
  const mine: MyCourse[] = [].map((c: any) => ({
    href: `/learn/${c.topicId}?topic=${encodeURIComponent(c.topic)}`,
    title: c.title,
    done: c.completedLessons,
    total: c.totalLessons,
    image: c.imageUrl ?? null,
    next: c.nextLessonTitle,
  }));

  return (
    <div className="la-app">
      <LibraryPage header={<SiteHeader tone="sky" current="library" user={user} />} courses={courses} tags={TAGS} mine={mine} sectionTitle="Everyday essentials" startHref="/#learn" myCoursesHref="/" />
      <SiteFooter />
    </div>
  );
}
