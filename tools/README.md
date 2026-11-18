# tools/

Local scripts only (`.vercelignore` keeps this folder off the site; nothing here runs on Vercel). `npm install` in this folder, then run from the repository root.

- Assets: `gen-art.mjs` (the drawings), `gen-mark.mjs` (favicon.svg, favicon.ico, touch icon), `capture.mjs` and `fetch-gosayhi.mjs` then `optimise.mjs` (pictures of the owner's live public products), `share.mjs` (the 1200 x 630 share image from `share.html`). **After any of them run `node tools/hash-assets.mjs`**, which gives fonts, pictures and drawings a content hash in their names and rewrites the references (the one-year `immutable` cache depends on it).
- Policy: `csp.mjs` writes `vercel.json` (clean addresses, caching, Content-Security-Policy with the hash of the one inline script, the security headers); `verify.mjs` fails if the policy, the references or the hashes disagree (run before every push).
- Local server: `serve.mjs` on :4210 (the same headers as `vercel.json`, clean addresses, the 404 page). The contact function does not run locally.
- Checks: `console-check.mjs` (no console message of any kind, three engines), `audit.mjs` (axe, overflow, requests), `contrast-pixels.mjs` (every text box on rendered pixels), `layout-checks.mjs` (widows, targets, anchors, plate rows), `font-shift.mjs` (layout shift as the faces arrive), `states.mjs` (the contact form's states with the request intercepted), `checks.mjs` (no-JS, no flash, keyboard walk, print), `weights.mjs` (requests and transfer), `copy-diff.mjs` (words against `origin/main`), `contrast.mjs` (token pairs).
