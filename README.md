# Diyorbek Ziyokhujaev — portfolio

Complete static portfolio in the dark metal and brass visual style of the supplied home reference. Includes the 360-degree WebGL sculpture, cable light animation, biography, career timeline, seven projects/publications, eight certificate previews, supporting documents and a contact form.

## Run locally

Node.js 20.11 or newer is sufficient. There are no npm dependencies to install.

```sh
npm run build
npm run check
npm start
```

Open **http://127.0.0.1:5173**. On Windows PowerShell with script execution disabled, use `npm.cmd` in place of `npm`. VS Code Live Server also works. Open through an HTTP server so ES modules and the GLB model can load.

`index.html` is already built and ready for static hosting alongside `assets/`, `models/` and `files/`. This task does not publish or change hosting.

## Source organization

```text
index.template.html      Page shell, metadata and stylesheet/module links
index.html               Generated, deployable page
components/
  home/                  Hero, profile, sculpture, statistics and cables
  sections/              About, experience, projects, credentials, contact
  shared/                Navigation, footer and native document dialog
assets/
  css/home/              Original home visual components
  css/site/              Shared materials and section-specific styles
  js/home/               Counters, pointer lighting and 3D renderer
  js/site/               Navigation, filters, documents, form and section scenes
  img/home/              Optimized WebP artwork and metal texture
  vendor/three/          Locally bundled Three.js and MIT license
models/                  Real GLB sculpture and source/license documentation
photos/                  Original photographs and favicon
files/                   Original certificates, diploma and resume
scripts/                 Build, validation and local preview server
```

Edit a component or `index.template.html`, then run `npm run build`. CSS and JavaScript files are served directly and do not need bundling. The build is deterministic; `npm run check` catches stale output, missing files/anchors, duplicate IDs, retired language controls and JavaScript syntax errors.

## Behavior

- Navigation works through section anchors, including a mobile menu and current-section indicator.
- The site is English-only. Copy lives directly in the section components; there is no language toggle or saved language preference.
- Project filters work locally and announce result counts.
- All five content sections share the home's machined metal frame, brass details and animated cable lights. Original Three.js geometry illustrates legal scales, banking architecture, connected glass cubes, a certificate and orbital communication.
- Section objects are borderless background compositions with shared animated wire artwork in `components/shared/scene-wires.html`. Text stays above the artwork; mobile layouts soften the models to preserve readability. The navigation connects directly to the same chassis rails.
- `assets/css/site/continuity.css` defines the shared instrument-panel layout: compact section headers, two-column career cards, illustrated case files, credential tiles and the contact terminal. The generated `interior-metal-v2.webp` is a 118 KB frame asset, applied as a nine-slice border so corners retain their proportions. Project illustrations live as six original SVGs in `assets/img/projects/`.
- `assets/js/site/section-models.js` defines the geometry; `section-scenes.js` shares one additional WebGL canvas between the five stages. Offscreen stages retain a rendered snapshot. Rendering is capped at 24 fps and stops offscreen, in hidden tabs and for reduced motion.
- `assets/css/site/machinery.css` defines the continuous chassis and dimensional surfaces; `depth.js` handles lazy scene loading, panel lighting and the illuminated career rail.
- Certificate buttons open a native accessible dialog with preview, open and download actions. All 11 original documents are linked.
- The 3D model automatically completes a turn every 36 seconds. There is no pause button or audio. Reduced-motion preferences are respected; rendering pauses when the sculpture is offscreen or the page is hidden. Three.js and the model load locally.
- The original reference image has no corresponding 3D mesh. The replacement is a different CC0 scanned sculpture, tinted bronze. See `models/justice-sculpture.LICENSE.md` for the source and license.

## Contact form

The existing EmailJS service/template/public key are preserved in `assets/js/site/contact.js`. The form validates required fields, prevents duplicate submission, handles timeouts and displays success only after a successful API response. Update these public integration identifiers if the EmailJS account or template changes. The receiving account's domain allowlist and service quota still apply.

Direct email, telephone and Telegram links remain available. Automated QA exercises form behavior with a local stub; it does not send a real email. Final delivery should be verified once from the deployed domain using the owner's EmailJS account.

## Cleanup and preserved material

Obsolete legacy pages, duplicate CSS/JavaScript, Tailwind configuration, empty model placeholder and temporary inspection files were removed after checking production references. A source snapshot taken before cleanup is saved outside the repository at `%TEMP%/resume-before-full-site.zip`.

The `files/` directory was not changed. Its 11 file hashes were checked against the pre-change snapshot. Original photographs remain in `photos/`.

The current biography records the completed LL.B., the Law and Justice role ending in August 2026 and the AGROBANK specialist role beginning in October 2026. Existing downloadable documents remain original.

The interior finish is separated into `assets/css/site/surfaces.css`: recessed panel borders, corner fasteners, pointer highlights and input wells. The lightweight original `section-surface.svg` supplies brushed metal, etched geometry and restrained warm illumination without extra rendering loops.
