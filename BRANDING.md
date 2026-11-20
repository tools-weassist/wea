# Wea branding

Wea uses Brandi's final concept C ("Breathe") pack, approved by Eric on 20 Nov 2026. Source files
live in `/workspace/wea-brand/` on the box (see its README for rules and rebuild scripts).
Tagline: **Breathe, the busywork is handled.**

| What                                             | Where in this repo                                                                                                                                                                                                                                    | Source in the brand pack                         |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Welcome screen lockup (light and dark)           | `public/brand/wea-lockup-light.svg`, `public/brand/wea-lockup-dark.svg`, used in `src/web/pages/onboarding/steps/welcome.tsx`                                                                                                                         | `logo/`                                          |
| Mark files                                       | `public/brand/wea-mark-light.svg`, `public/brand/wea-mark-dark.svg`                                                                                                                                                                                   | `logo/`                                          |
| In-app mark (sidebar, chat, onboarding, loaders) | `src/web/components/wea-mark.tsx` (paths copied unchanged; favicon geometry at 48 px and below)                                                                                                                                                       | `logo/wea-mark-*.svg`, `favicon/favicon.svg`     |
| Favicons and PWA icons                           | `public/favicon.svg`, `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png`, `android-chrome-192.png`, `android-chrome-512.png`                                                                        | `favicon/`                                       |
| Web app manifest                                 | `public/site.webmanifest` (theme `#0698B2`, background `#F1F5F9`), linked in `index.html`                                                                                                                                                             | `favicon/site.webmanifest`                       |
| Startup shell, connection pages, sign-in page    | Inline favicon mark in `index.html`, `public/connection-loading.html`, `public/connected.html`, `src/shared/sign-in-page.ts`                                                                                                                          | `favicon/favicon.svg`                            |
| Notification icon                                | `public/wea-logo.png`                                                                                                                                                                                                                                 | `icon/wea-app-icon-512.png`                      |
| Desktop app icon                                 | `desktop/assets/nod-macos.png`, `nod-macos.svg`, `nod.ico` (file names kept for the packaging scripts)                                                                                                                                                | `icon/wea-app-icon*.{svg,png}`                   |
| Colours                                          | `--wea-*` tokens in `src/web/theme.css`; the upstream `--pink-*` / `--brand-pink` names now hold Wea teal tints                                                                                                                                       | README tokens                                    |
| Fonts                                            | `public/fonts/Fraunces-Variable.woff2`, `public/fonts/LeagueSpartan-Variable.woff2` (OFL, `Fraunces-LeagueSpartan-OFL.txt`), `@font-face` in `src/web/styles.css`; League Spartan for body, Fraunces SemiBold (SOFT 100) for headings and the tagline | `/workspace/weassist-brand/source/assets/fonts/` |

Notes for Brandi:

- The clear-space and minimum-size rules are not enforced in code yet (not approved as hard rules).
- UI tokens follow Brandi's final spec. Light: accent Teal `#0698B2` for the logo, icons, focus rings
  and large accents only; buttons `#067A8F` with white text, hover `#05616F`. Dark: accent and
  buttons Glow Teal `#07C2E4` with Ink Navy `#142134` text (never white on Glow Teal), hover
  `#38D3EE`. Soft tints are the accent at 10–12% opacity, not new hex values.
- The macOS icon is a 1024px canvas with an 824px rounded square (radius about 185px, 100px
  transparent margin) and a soft shadow, built from `wea-app-icon-square.svg`.

Still upstream (needed before any client-facing release): WeAssist Terms of Use and Privacy links
(`legalLinks` in `src/shared/onboarding.ts` still point to n8n), the update-email consent text in the
same file, desktop installer and Flatpak names and IDs (`desktop/scripts/windows-installer.nsi`,
`desktop/flatpak/`, `desktop/main/login-item.mjs`), and the desktop auto-updater, which still checks
n8n's Nod releases.
