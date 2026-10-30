# Learn Anything — course pages redesign

Review prototype for the library, course page and lesson pages of learn-anything-public.site, built on the home page system (night-sky band, Inter Tight headlines, one nav) and laid out for phones first. Oct 30, 2026.

**Open the review page: https://amigostudios.github.io/learn-anything-course-pages/**

It is plain HTML, so it works the same on a phone and a laptop. Please look at both; the mobile layout is most of the point.

## What to open

| Screen | Link |
| --- | --- |
| Library | [library.html](https://amigostudios.github.io/learn-anything-course-pages/library.html) |
| Course page, new learner | [course.html](https://amigostudios.github.io/learn-anything-course-pages/course.html) |
| Course page, in progress (3 of 10 done) | [course.html?state=progress](https://amigostudios.github.io/learn-anything-course-pages/course.html?state=progress) |
| Lesson player | [lesson.html](https://amigostudios.github.io/learn-anything-course-pages/lesson.html) · [playing](https://amigostudios.github.io/learn-anything-course-pages/lesson.html?state=playing) · [Lessons drawer](https://amigostudios.github.io/learn-anything-course-pages/lesson.html?drawer=1) · [all ten visual kinds](https://amigostudios.github.io/learn-anything-course-pages/lesson.html?state=kinds) |
| Quiz | [lesson.html?state=quiz](https://amigostudios.github.io/learn-anything-course-pages/lesson.html?state=quiz) |
| Lesson complete | [lesson.html?state=done](https://amigostudios.github.io/learn-anything-course-pages/lesson.html?state=done) |
| Generating a lesson | [loading.html](https://amigostudios.github.io/learn-anything-course-pages/loading.html) |

The lesson player, quiz, Lessons drawer, library search and topic filters all work. Narration is simulated: the prototype has no audio, so the word reveal runs on a timer at the chosen speed.

## What is real and what is sample

- Course content is the live site's own: the 11 library courses and their images, the Basic Knife Skills course (4 modules, 10 lessons, prerequisites, resources, related courses) and its first lesson (6 segments, 3 quiz questions with the real answers).
- Progress, the "Continue learning" strip, the topic chips and the key ideas on the completion screen are sample data so each state can be seen. Nothing else is invented.

## What changed

- **One nav everywhere.** The home page nav sits in a short sky band on the library and course pages. The lesson gets a compact white bar with the same geometry. The public course page had no header at all before.
- **Library.** Search, topic chips, a "continue learning" strip for signed-in learners, and cards that become dense rows on phones (six courses per screen instead of one and a half).
- **Course page.** One layout for visitors and enrolled learners. Lessons form a numbered path with done and up-next states, a "before you start" card floats over the band, and phones get a sticky continue bar once the hero button scrolls away.
- **Lesson.** "Lesson 1 of 10", six segment ticks, a stage that frames every visual kind, a floating player bar that docks full width on phones with safe-area padding, and a Lessons drawer for jumping around.
- **Quiz and completion.** Lettered options with clear correct and incorrect states, and a completion card (score, course progress, next lesson, key ideas) instead of the silent 1.8-second redirect.
- **Motion stays light.** The starfield and the band light are the only ambient motion; reduced motion is respected throughout.

The review page has before/after sheets of the live site next to the redesign, full-length phone captures and the palette.

## Lovable handoff

`lovable-handoff/` holds plain React components and one scoped stylesheet written for the existing stack (TanStack Start, React 19, Tailwind v4, shadcn, lucide-react, recharts). No new dependencies. It is a re-style: data loading, caching, progress, the audio pipeline and the ElevenLabs teacher stay as they are, and the lesson player keeps its playback logic line for line. `lovable-handoff/README.md` carries the paste-ready prompt and a QC checklist; the same files are zipped as `lovable-handoff-courses.zip`.

Status: type-checked and server-rendered, not yet applied in Lovable. It goes in after this review.

## Leaving feedback

Reply wherever you got this link, or open an issue here if you use GitHub. Page name plus the width you were looking at (phone or laptop) is enough context; a screenshot helps.

## Folder map

```
index.html                    the review page
library.html, course.html,
lesson.html, loading.html     the prototype pages (states via ?state=… as in the table above)
assets/                       courses.css + courses.js (all styles are la- prefixed and scoped under .la-app)
img/                          the site's own course images, local copies
previews/                     1:1 captures at 1440 / 820 / 390 px and the before/after sheets
audit/                        stills of the live site before the redesign (Oct 30, 2026)
lovable-handoff/              components, styles, route examples, reference stills, README with the prompt
lovable-handoff-courses.zip   the same handoff as one download
```

This is a review copy, marked `noindex`.
