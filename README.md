# Zamanuddin Khan | Portfolio Website

A modern, animated, responsive personal portfolio built with **HTML, CSS, and vanilla JavaScript**. No frameworks, build tools, or package installation required.

## Live Portfolio

[Visit my portfolio](https://portfolio-bay-pi-94.vercel.app/)

## Open locally

1. Download and unzip the portfolio folder.
2. Keep `index.html`, `style.css`, and `script.js` together in the same folder.
3. Keep the `assets/` folder alongside these files; it contains the portrait and favicon.
4. Double-click `index.html` to open it in a browser.

Alternatively, open the project in VS Code using the Live Server extension, or run `python -m http.server 8000` in the project folder and visit `http://localhost:8000`.

## Features

- Animated hero, cycling job titles, circular profile portrait, particles, ticker, and scroll-in reveals
- Responsive navigation with accessible mobile menu
- Dark/light theme toggle that remembers the visitor's choice in local storage
- Eight grouped technology cards with branded icons and clearly marked learning areas
- Pointer-following ring for mouse and trackpad users; disabled on touch screens and for reduced motion
- About, learning, approach, GitHub contribution snake, and contact sections
- Validated contact form that opens the visitor's email application with a drafted message
- Reduced-motion support, keyboard-friendly controls, and a skip link
- All personal information and links taken from the supplied profile

## Important contact-form note

This is a **static** site. The form does **not** send an email itself or save messages. Clicking **Compose message** opens a pre-filled email draft in the visitor's default mail application, where they must click Send. For direct submissions, connect a form service or backend before deployment.

## Notes

- Google Fonts, Devicon technology icons, and the GitHub contribution snake require an internet connection. System font fallbacks and visible technology labels are included.
- The GitHub contribution snake appears only if its GitHub-hosted SVG exists and is accessible; otherwise, a GitHub profile link is shown.
- Resume, LinkedIn, email, and GitHub links are the ones provided in the profile. No sample or fictional projects were added.

## Customize

- **Profile photo:** replace `assets/images/zaman.jpg`; adjust `.profile-image` in `style.css` to change the crop.
- **Text and links:** `index.html`
- **Colors, typography, layouts, effects:** `style.css` (`:root` theme variables)
- **Typing words, cursor effect, form behavior, animations:** `script.js`

## GitHub preparation

The `.gitignore` excludes local package caches, dependencies, secrets, logs, generated output, and machine-specific editor files. Commit the HTML, CSS, JavaScript, README, formatting configuration, and `assets/` directory, including your profile photo.

Ignore rules do not remove files that Git already tracks. Review staged changes before pushing.

## Deploy free

Upload the folder to a GitHub repository and enable GitHub Pages in the repository's **Settings → Pages**. Choose **Deploy from a branch**, select the main branch and `/ (root)` folder. No build step is needed.
