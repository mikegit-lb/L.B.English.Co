# Workspace review and campaign rebuild

Reviewed and implemented on 9 September 2026.

## Findings and changes

| Finding in the original workspace | Implemented result |
| --- | --- |
| Six separate HTML pages duplicated navigation, embedded CSS and interaction code. There was no package or build configuration. | Shared page templates and components; page-specific browser modules; pinned dependencies, reproducible build, static release package and local server. |
| SAT had a homepage card but no dedicated lesson route. | Dedicated SAT Reading & Writing page, four original mini-lessons, pacing timer, filtered resources and a SAT study schedule. |
| IELTS and SAT competed with many equal-weight homepage sections. | Campaign-led homepage, clear course CTAs, paired course cards, consistent primary navigation and secondary access to other programmes. |
| The planner read weekly hours but never used them. | Six sessions allocate exactly 240, 480 or 840 minutes. Changing inputs invalidates the old displayed/downloadable plan. |
| Completed speaking countdowns could restart below zero. | Deadline-based timers with pause, reset, completion and restart; cue/prompt changes reset their timer. |
| JSON parsing and storage writes could stop page scripts. | Guarded reads, shape validation and honest failure messages; legacy resource notes and checklist keys retained. |
| Forms displayed “request received” without submitting anything; a WhatsApp URL had no recipient. | Downloadable coaching brief with accurate status. No invented endpoint, telephone number or recipient. |
| A short language quiz inferred CEFR and several exam scores; every correct answer was the first option. | Eight-question practice feedback with explanations and varied answer positions. Unsupported score predictions and equivalencies removed. |
| IELTS and YDT calculators attached university/visa/ranking implications to simple arithmetic. | Calculators display arithmetic only, with valid input handling and no admissions or rank predictions. |
| Essay guidance encouraged stock phrasing. | Four original prompts and editable planning guides; separate locally saved outlines and text download. |
| Unverified student-result, availability and premium-delivery claims were mixed into the campaign. | No fabricated testimonials, deadlines, discounts, live availability or paid delivery claims. Coaching options and free practice remain accessible. |
| Previous mobile verification had not established the actual viewport. | Browser checks explicitly verified 1440, 390 and 320 pixel widths and measured overflow on every page. |

## What learners can do

- Use eight original IELTS/SAT mini-lessons, check answers, reflect and save completion.
- Build and download an IELTS, SAT, YDT, YDS, speaking or general English study plan.
- Search eight resources, combine topic and type filters, save items and recover from empty results.
- Use the 12-point IELTS writing checklist, editable notes and text/PDF downloads.
- Plan an IELTS essay using one of four question types and retain separate outlines.
- Use four IELTS cue cards, three speaking discussion prompts and five Turkish-supported vocabulary cards.
- Calculate the rounded average of four IELTS component bands and a stated YDT practice-net formula.
- Use a programme finder, language practice check and downloadable coaching brief.

## Verification

- Production CSS and seven static pages build successfully in the existing Windows path.
- Unit checks cover band-rounding boundaries, exact study-time allocation, timer completion/restart, malformed/blocked storage and content integrity.
- Local validation checks generated-page links, fragments, IDs and ARIA references.
- Chrome browser checks cover all seven pages at 1440×1000, 390×844 and 320×740, with actual viewport and overflow assertions.
- Automated WCAG A/AA scans include the lesson dialog. These are automated findings, not a complete accessibility certification.
- Browser workflows cover mobile routing, native dialog focus, lesson persistence, filters, notes, checks, text downloads, printing, calculators, timers, vocabulary, coaching briefs and storage failure recovery.
- Final tests run against the packaged `dist/` output. Detailed evidence lives in `artifacts/browser-report.json`; it is not included in the public package.
- Final result: all five unit checks and eight browser workflow groups passed; 254 local links/assets validated; zero browser errors, horizontal-overflow failures or detected WCAG A/AA violations across 21 page/viewport combinations and the lesson dialog.
- An additional 120-line resource note printed across four pages with its final sentinel intact. Separate checks confirmed mobile-menu dialog focus return and independent essay-outline persistence.

## Structural discovery evidence

The requested codebase-memory graph was used first. Project `lb2` was indexed at generation `2026-09-09T15:45:21Z`. The full 14-node discovery result represented HTML modules/files; it did not expose the inline JavaScript functions. Coverage recorded partial parsing around HTML title lines and excluded assets. Relevant source, scripts and data were therefore inspected directly.

After restructuring, graph reindex and new-path coverage requests returned “Transport closed”. Final implementation verification used the actual source, generated output and browser tests; this report does not claim that the current graph was refreshed.

## Exam references

The band calculation follows the rounding described by [IELTS](https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail). The SAT timing and Reading & Writing scope were checked against [College Board's structure page](https://satsuite.collegeboard.org/sat/whats-on-the-test/structure) and [Reading & Writing overview](https://satsuite.collegeboard.org/sat/whats-on-the-test/reading-writing). The mini-lessons are original, independent practice.

## Remaining external work

The site is locally complete and statically deployable. Live enquiries, bookings, payments and account-based learning require actual provider choices, verified business/contact information and service terms. No external communication or publication was performed. The original HTML files were backed up outside the workspace to `C:\Users\micha\AppData\Local\Temp\lb2-before-campaign-20260909-184730`.
