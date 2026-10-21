# TorqLab Automotive

React frontend using Vite, Redux Toolkit, Tailwind CSS v4, and Three.js. No backend required.

## Run

npm install
npm run dev

## Production

npm run build
npm run preview

The local development URL is http://127.0.0.1:5173/.

## Structure

- src/styles.css: shared theme tokens in @theme, responsive component styles.
- src/store.js: Redux booking state and actions.
- src/data.js: service catalogue and starting prices from the original HTML.
- src/CarViewer.jsx: lazy-loaded interactive GLB viewer, material treatment and lighting.
- src/main.jsx: service selection, quote builder, navigation and content.
- public/models/bmw-m5.glb: supplied model, loaded locally without a CDN.

## Model finish

Paint materials are identified by name. Satin finish uses roughness 0.32, metalness 0.32, specular intensity 0.4 and lower environment intensity. Glass and textured wheel materials retain their original properties. Change these values in CarViewer.jsx to tune the finish. Orbit, pan, zoom, view presets, reset and optional auto rotation are supported. Loading and WebGL errors display a fallback message.

## Backend integration

The quote action copies a generated request; it does not send a message or book an appointment. Replace that action with the future API integration. No customer information is persisted or transmitted. Prices are starting estimates.

## Supplied asset license

The supplied GLB embeds Ddiaz Design attribution and a CC BY-NC-SA 4.0 license. See public/model-attribution.txt. Obtain appropriate commercial rights before using this model on a commercial production website.

## Glass theme and branding

The shared CSS theme includes translucent panels, backdrop blur and layered highlights. Navigation tracks Home, Services, Quote and FAQ while scrolling. The supplied transparent wordmark is public/torqlab-logo.png. The viewer frames the car to the available screen width on resize and uses richer green paint with restrained clearcoat.


The hero uses a full-width transparent canvas with a reserved desktop viewport for the car. Scissor clipping keeps rotation and zoom out of the copy area. Mobile stacks copy above the model. The synthetic ground shadow plane has been removed.


## Random paint palette

src/paints.js contains the 11 requested paint variants. Redux selects one uniformly with Math.random when the application module starts on each full page load, before the lazy 3D viewer mounts. No localStorage, cookies, user-agent checks, or device branches are involved. Ordinary React rerenders and camera interactions preserve the selected color. Independent random selections may repeat.

Paint names and codes reference BMW's F90 brochure (exterior colours, page 12):
https://www.bmw.bg/content/dam/bmw/marketBG/bmw_bg/topics/pricelists-brochures/brochures/New_NOV2020/F90_PSL28_EAL_web.pdf.asset.1607346032818.pdf

RGB values are manually authored screen approximations, not official BMW RGB specifications or a calibrated paint match. Metallic variants also vary roughness and metalness. Aventurin Red III retains the user's requested display name; references list Aventurin Red Metallic (C57). The palette affects paint materials only.

Layout polish: all main containers share --content-width, --page-max and --page-gutter. The header shell is transparent; the navigation pill retains glass styling. At widths up to 1024px navigation labels hide, while aria-label and title retain the link names. Banner copy and car remain in separate regions.


The car automatically rotates at a slow showcase speed on load. Viewer toolbars are removed. Orbit/zoom gestures pause rotation, which resumes two seconds after interaction ends. Timers and listeners are cleaned up on unmount.

