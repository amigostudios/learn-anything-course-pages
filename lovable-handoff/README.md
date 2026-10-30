# Learn Anything — course pages redesign, Lovable handoff

Approved design: the prototype pages in this package's parent folder (library, course page, lesson player, quiz, lesson complete, generating screen) and the stills in `reference/`.
Everything here is plain React + one CSS file, written for the existing stack (TanStack Start, React 19, Tailwind v4, shadcn, lucide-react). No new dependencies, and recharts leaves the lesson route.
It is a re-style: data loading, caching, progress, the audio pipeline and the ElevenLabs teacher stay exactly as they are.

## Prompt to paste into Lovable

> Re-style the library, course and lesson pages with the attached files. The home page already uses this design (home.css / HomePage); these pages complete it. Do not change any loader, server function, caching, progress or audio logic — only what is rendered.
>
> 1. Add `src/styles/courses.css` and every component under `src/components/site/`, `src/components/library/`, `src/components/course/` and `src/components/lesson/` as provided. The CSS is scoped under `.la-app` with `la-` prefixed classes, so it does not touch Tailwind or shadcn. Keep the sky-band gradient values as they are.
> 2. Fonts: the root head already links Inter + Inter Tight for the home page. Keep that link; these pages use the same two faces.
> 3. **Library** (`/library`): render `LibraryPage` as in `src/routes/library.example.tsx`. Map the existing course rows to `LibraryCourse` (`href` = the public course page route). Pass the signed-in user's courses as `mine` (the same data as the home page's "Your courses"); the strip hides itself when the list is empty. Pass `tags` only if courses carry a topic tag; otherwise omit it and the filter chips do not render. Keep the route's head/meta.
> 4. **Course page**: render `CoursePage` for both the public route (`/library/$slug`) and the enrolled route (`/learn/$topicId`) as in `src/routes/library.$slug.example.tsx`. Progress comes from the existing store with ids `${moduleIndex}-${lessonIndex}`; `now` is the first incomplete lesson. For visitors pass `access` to show the "Free · no sign-up" / "Free · sign in" tags that the public page shows today; for enrolled learners omit it so the Done / Up next states show instead. Keep the existing Share behaviour behind `shareUrl`, the "Go deeper" resources as `resources`, the related courses as `related`, and the end-of-course review as `review`.
> 5. **Lesson** (`/learn/$topicId/$lessonId`): follow `src/routes/learn.$topicId.$lessonId.example.tsx`. Replace the old `LessonPlayer.tsx`, `SegmentVisual.tsx`, `Quiz.tsx` and `GenerationLoader.tsx` with the versions in `src/components/lesson/`, and add `visuals.types.ts`. `SegmentVisual` renders the **v2 visual JSON** (`visual.type`: icon, compare, steps, stat, timeline, dodont, diagram, definition, rule, photo; contract in `visuals/lesson-visual.v2.schema.json`, fixtures in `visuals/sample-visuals.json`) and still renders cached v1 visuals (`visual.kind`) through a compact fallback, so nothing breaks before the backfill. Segments may carry `kind`, `key_idea` and `body` (v2) or `type` and `narration` (v1); the player shows `key_idea` under the heading when present. If the visual-system renderer PR from the code route has already landed, keep its card components and only take the stage markup and CSS from here. `LessonPlayer` keeps the current playback logic line for line (audio element, word timings, auto-advance, keyboard shortcuts, tap-to-play fallback, persisted speed); if logic was added to the live player since the August export, merge it into the new file rather than the other way round. Wrap the page in `LessonShell`, which renders the top bar (back, lesson n of N, Lessons drawer, Ask the teacher) and needs the course outline and progress that the course page already has.
> 6. **After the quiz**, do not redirect to the course after 1.8 s any more. Call `markLessonComplete` as today, then render `LessonComplete` (score, course progress, next lesson, key ideas). `Quiz`'s `onComplete` now receives the score.
> 7. **Ask the teacher**: keep `AskTeacher` mounted as today, but pass `showMiniOrb={false}` and open it from `LessonShell`'s `onAskTeacher` and the quiz's "Stuck? Ask the teacher" link. The floating pill is replaced by the button in the top bar, whose icon is the planet mark (`PlanetMark`, tone "dark") with a soft halo, not the orb.
> 8. **Header**: these pages render `SiteHeader` (tone "sky") inside their sky band, so do not render the global site header on `/library`, `/library/$slug`, `/learn/$topicId` or `/learn/$topicId/$lessonId`. Use `SiteHeader` with tone "paper" on the remaining white pages (pricing, about, account, legal) so the whole site has one nav. Keep `SiteFooter` on every page except the lesson.
> 9. Icons are lucide-react; keep them, do not swap in emoji or other icon sets. Charts stay on recharts with the blue palette in `SegmentVisual.tsx`.
> 10. Do not add any other animation, imagery or gradients. The starfield, the light in the band and the orb are the only ambient motion; all of it already respects `prefers-reduced-motion`.
> 11. When done, compare each page with the stills in `reference/` at 1440 px and 390 px. Check: no horizontal scroll at 375 px; the library search and chips filter the grid; the course page's phone continue bar appears after the hero button scrolls away; the lesson's six ticks fill with the narration; Space / ← / → still work; the Lessons drawer opens and closes with Escape; the quiz marks correct and incorrect answers and shows the explanation; the completion screen links to the next lesson.

## What's in the package

```
src/styles/courses.css                       all styles for the three pages, scoped under .la-app
src/components/site/SiteHeader.tsx           the home nav for every other page (tone "sky" | "paper"), Menu panel below 860px
src/components/site/SiteFooter.tsx           footer with links and the AI disclaimer
src/components/site/SkyBand.tsx              the night-sky band at the top of library and course pages
src/components/site/Starfield.tsx            canvas starfield (variants hero | band | page); same file as the home package plus "page"
src/components/site/PlanetMark.tsx           the ring-planet mark (light / dark)
src/components/library/LibraryPage.tsx       hero + search + topic chips, continue strip, grid, promo
src/components/library/CourseCard.tsx        course card (row layout on phones), `sittings()` helper
src/components/library/ContinueStrip.tsx     "Continue learning" strip for the signed-in user's courses
src/components/course/types.ts               LibraryCourse, Course, ProgressState, Resource, LessonAccess…
src/components/course/CoursePage.tsx         hero, outline, sidebar, related, sticky phone bar, share
src/components/course/CourseOutline.tsx      modules + lesson path with done / up next / access states; review card
src/components/course/CourseSidebar.tsx      Before you start · About this course · Go deeper
src/components/lesson/LessonShell.tsx        full-height frame: top bar + content + drawer
src/components/lesson/LessonTopBar.tsx       back, course · module, lesson n of N, Lessons, Ask the teacher
src/components/lesson/SegmentProgress.tsx    one tick per segment, current tick fills with the audio
src/components/lesson/PlayerBar.tsx          prev / play / next / speed; floating pill, docked bar on phones
src/components/lesson/LessonPlayer.tsx       the player: existing logic, new markup (uses the three above)
src/components/lesson/SegmentVisual.tsx      the ten v2 cards (by `type`) + the v1 fallback (by `kind`); diagram template library
src/components/lesson/visuals.types.ts       VisualV2 / VisualV1 / SegmentV2 types and the isV2 / isV1 guards
src/components/lesson/Quiz.tsx               question card with lettered options and states
src/components/lesson/LessonComplete.tsx     sky card with score, progress, next lesson; key ideas
src/components/lesson/LessonsDrawer.tsx      the outline as a side panel / bottom sheet
src/components/lesson/TeacherButton.tsx      the planet-mark button and the quiz's text link
src/components/lesson/GenerationLoader.tsx   the wait screen (same props as before, plus subtitle)
src/routes/*.example.tsx                     how the three routes wire the components
reference/                                   stills of the approved design at 1440 and 390 px
visuals/                                     lesson-visual.v2.schema.json + sample-visuals.json (from the visual-system package)
```

## Behaviour that must survive the port

- Library: typing filters by title; chips filter by tag; the count updates; the empty state links to the home page field.
- Course page: "Start the course" becomes "Continue · {next lesson}" once anything is done; the hero shows a progress bar; below 1024 px the sidebar cards stack under the outline and a sticky bar with the same CTA slides in when the hero button leaves the viewport.
- Lesson: autoplay when allowed, tap-to-play overlay when the browser blocks it; word reveal from word timings or evenly from duration; auto-advance 600 ms after a segment ends; Space / ← / →; speed persisted in localStorage; the stage is a 16:9 card (`.la-slot` container query handles phones): photos edge to edge, every other v2 card laid out left-aligned inside it; v1 visuals centre on a soft glow as before.
- Visuals v2: `photo.src` is used when the app has resolved the image; otherwise the renderer searches Pexels by `query` as the v1 image did. `stat` always shows its source link. The diagram template library holds `us-nutrition-facts`; the model only picks anchors.
- Quiz: options lock after the first choice; correct is green, a wrong pick is red and the correct one is revealed; "Next question" / "Finish lesson"; "Stuck? Ask the teacher" passes the same context note as before.
- Everything respects `prefers-reduced-motion`; focus is visible; the drawer traps Escape and returns focus.

## Notes for the dev

- `courses.css` is self-contained (it repeats the few nav rules from `home.css` so either file can load alone). If both are present, the duplicated rules are identical.
- The sky band is a measured colour field (navy corners, royal core, azure lobes at the foot) plus `.la-sky-light` bleeding in from above. Do not replace it with one linear gradient.
- Links in the components take plain hrefs (`lessonHref(mi, li)`, `course.href`). If the typed router complains about `Link to={string}`, swap in `to` + `params` for that route; nothing else depends on it.
- Lesson "sittings" on cards = `ceil(lessons / 3)`, which matches the "about 4 sittings of 20 min" the live course page shows for 10 lessons. Replace with the real estimate if one exists.
- `SegmentVisual.tsx` imports `searchPexelsImage` from `@/lib/ai.functions` and `VisualErrorBoundary` from `@/components/VisualErrorBoundary`, as the old file did.
- Brand icons were dropped from lucide v1, so the "YouTube" resource kind uses `Video`.
- The components were type-checked (strict) against React 19.3, @tanstack/react-router 1.170 and lucide-react 1.64 in a scratch project with stubs for the two app modules above. The route examples were not type-checked on their own because `createFileRoute` needs the project's generated route tree.
