# L.B. English Co.

An exam-choice learning studio with original mini-lessons, personal study tools and distinct IELTS, TOEFL iBT, SAT, YDT, YDS and YÖKDİL routes.

## Run locally

Requires Node.js 22+.

```powershell
npm ci
npm run build
npm start
```

Open http://127.0.0.1:8765. Serve over HTTP; browser modules are not intended to run by double-clicking an HTML file.

The build compiles Tailwind CSS locally, copies local fonts and generates 26 localized HTML pages, including two comparison hubs and six dedicated exam routes. On Windows, a temporary drive alias works around Tailwind's handling of the `#1` directory. The alias is removed when the CSS build finishes. No server framework or styling CDN runs in the browser.

## Edit the site

- `src/pages/*.mjs`: page content and layouts. Root HTML files are generated; edit their source templates.
- `src/ui.js`: shared static navigation, footer and dialog markup.
- `src/components.js`: reusable Tailwind utility groups, icons and timer markup.
- `src/app.js`: shared navigation and page-specific module loading.
- `src/study.js`: lessons, progress, study planner, language check and coaching brief.
- `src/library.js`: resource filters, notes, saved items, downloads and printing.
- `src/course-tools.js`: countdowns, band calculation, cue cards, vocabulary and net calculator.
- `src/essay.js`: IELTS essay structures, separate saved outlines and downloads.
- `src/lessons.js`, `src/content.js`: original mini-lessons and carried-forward resource content.
- `src/lib/`: storage, dialog, download and calculation helpers.

Run `npm run build` after changing source. Generated pages have actual links and course content before JavaScript loads.

## Validate

```powershell
npm test
npm run test:browser
```

The browser test expects a local server and installed Google Chrome. Set `BASE_URL` to test another address. It checks all seven pages at 1440, 390 and 320 pixels, runs automated WCAG A/AA checks, and exercises the main learner workflows. Screenshots, a PDF sample and the JSON report are written to `artifacts/`.

## Static delivery

`dist/` is the deployable output: seven pages, compiled CSS, local fonts, the existing hero image and logo, and the JavaScript modules the browser uses. It excludes build tools, source page templates, dependencies and test reports. The package step flags unexpected leftover files rather than silently publishing them. `dist/build-manifest.json` lists the expected files.

To preview exactly that output:

```powershell
$env:STATIC_ROOT='dist'
$env:PORT='8766'
npm start
```

Upload the contents of `dist/` to a static host when publication is wanted. No publication was performed as part of this change.

## Data and service boundaries

All learning persistence is local to the browser. Existing `lbFreeSaved` and `lbFreeNote-*` data is retained. New progress uses `lbLessons:v2`, `lbLessonNote-*`, `lbPlan:v2` and `lbEssay-*`. Corrupted or inaccessible storage falls back to usable practice with an honest save-status message.

There is no enquiry endpoint, recipient address, scheduling provider, payment processor or authenticated learning backend in this workspace. The coaching action therefore downloads a brief and explicitly says that nothing was sent or booked. Verified operator details, a contact channel and booking terms are needed to connect live enquiries or sales. The site does not invent those details.

See `docs/workspace-review.md` for the audit, changes and verification record.
