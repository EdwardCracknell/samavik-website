# Copy changes: samavik.com redesign (branch `redesign/atelier`)

Every word of the three pages (and the new 404 page) that is not word for word as on today's site, old and new, so each can be accepted or refused. `tools/copy-diff.mjs` compares the redesign's rendered words with `origin/main` and regenerates the raw list (it is advisory: it reports clauses, so a change of punctuation alone shows only in the tables below); this file was reconciled against its output on the final commit. Tick the ones you refuse and they go back exactly as they were. No fact, number, price, claim or promise has been added to any page; the one sentence that came close is listed at the end under "Proposed additions, not shown" and is not on the page.

Not changes of wording, so not listed one by one: tracked capitals for labels (the text is as written), curly quotes and apostrophes instead of straight ones, the dash that joined two clauses becoming a comma or colon (each listed below where it is in a sentence), and the section numbers "No. 01" to "No. 06" and "01" to "05".

## Home (`index.html`)

| # | Where | Old | New |
|---|---|---|---|
| 1 | Head, the lede | Samavik is a founder-led product studio. AI-leveraged engineering across web, mobile and desktop — everything on this page is real, and most of it you can click. Proof over promises. | Samavik is a founder-led product studio: AI-leveraged engineering across web, mobile and desktop. Everything on this page is real, and most of it you can click. Proof over promises. |
| 2 | Head, the link | See what we've shipped | See what we have shipped |
| 3 | Head, three statements | Founder-led — you work with the engineer | **Founder-led** / You work with the engineer. |
| 4 | | UAE-licensed entity — invoice-ready, no EoR needed | **UAE-licensed entity** / Invoice-ready, no EoR needed. |
| 5 | | AI-leveraged — senior output at startup speed | **AI-leveraged** / Senior output at startup speed. |
| 6 | Services 01 | …deployed, and handed over clean — or retained and iterated. | …deployed, and handed over clean, or retained and iterated. |
| 7 | Work, title | Don't take our word for it — click the products | Don't take our word for it. Click the products. |
| 8 | Work, introduction | Real products across web, iOS, Android and Windows. Live ones link to the live thing. This is what "we know what we're doing" looks like when it's checkable. | Real products across web, iOS, Android and Windows. The live ones link to the live thing: this is what “we know what we’re doing” looks like when it can be checked. |
| 9 | Cutaway | …Licensing, billing and support — a full product business, not a demo. | …Licensing, billing and support: a full product business, not a demo. |
| 10 | GoSayHi | …latency, cost control, safety and payments — solved and shipped. | …latency, cost control, safety and payments, solved and shipped. |
| 11 | Coaching CRM Engine | …Stripe checkout and a client media portal — running a real business every day. | …Stripe checkout and a client media portal, running a real business every day. |
| 12 | PPGDrone | Drone-assisted paramotor for wingsuit BASE logistics — hardware, flight systems and software. | Drone-assisted paramotor for wingsuit BASE logistics: hardware, flight systems and software. |
| 13 | Work, the small labels | The platforms and the second line of chips had no labels | "Platforms", and "Covers" (Course booking, Progress tracking, Client work; LLM + voice, Pay-per-use; Flight control, EASA Open A3) or "Stack" (the technologies). The words in them are unchanged. |
| 14 | Work, captions (new, true) | none | "learntobasejump.com", "teamcutaway.com", "GoSayHi on the App Store", "The business it runs · edcracknell.com", each with "Captured 18 Nov 2026" (the date I captured the picture). The order of the plates also changed: Coaching CRM Engine now follows GoSayHi, then DogSpot, then PPGDrone. |
| 15 | Process 3 | Deployed, documented, handed over clean — or retained and iterated. | Deployed, documented, handed over clean, or retained and iterated. |
| 16 | Founder | Samavik is led by Ed Cracknell — a full-stack product engineer who has shipped every product on this page. | Samavik is led by Ed Cracknell, a full-stack product engineer who has shipped every product on this page. |
| 17 | | Six-plus years across web, mobile, desktop and hardware — and, unusually, a professional skydiving and wind-tunnel coach. | Six-plus years across web, mobile, desktop and hardware and, unusually, a professional skydiving and wind-tunnel coach. |
| 18 | Founder, the book plate (new, assembled from the two sentences above) | the "EC" monogram | Ed Cracknell / Full-stack product engineer; professional skydiving and wind-tunnel coach. / SAMAVIK L.L.C-FZ · MEYDAN FREE ZONE · DUBAI |
| 19 | Founder, the entity | …run entity-to-entity — no visa sponsorship, EoR or freelance-permit friction for UAE clients… | …run entity-to-entity: no visa sponsorship, EoR or freelance-permit friction for UAE clients… |
| 20 | Contact | You'll get a straight answer — including "you don't need us for that" when that's the truth. | You’ll get a straight answer, including “you don’t need us for that” when that’s the truth. |
| 21 | Contact, the CV line | Hiring or staffing a build? Download my CV — contract or fixed-scope, invoiced B2B from a UAE entity. | **Hiring or staffing a build?** Download the CV. Contract or fixed-scope, invoiced B2B from a UAE entity. |
| 22 | Contact card (new words around the form) | none | "Enquiry", "Write to us", and under the key: "Your details are used only to answer you (privacy)." (the privacy page's own words: "used solely to reply to your enquiry") |
| 23 | Form, sent | Got it — you'll hear back within one working day. | **Thank you.** Got it: you’ll hear back within one working day. If it can’t wait, write to edward@samavik.com. Key: "Write another message". |
| 24 | Form, a field left empty | All fields are required. | Please tell us your name. / Please give an email address we can reply to. / Two sentences is enough: what it is, and when you need it live. (each beside its own field) |
| 25 | Form, a bad address (new) | none | That does not look like an email address. It should read name@company.com. |
| 26 | Form, too long (new) | none | That is over the 5,000 characters we can take in one message. Please shorten it, or email us instead. (the limits are the function's own: name 200, email 320, message 5,000) |
| 27 | Form, the function refuses | Something went wrong — email edward@samavik.com instead. | Four notices, each keeping what was typed: "The form needs a name, an email address and a message."; "The email address was not accepted."; "One of the fields is longer than we can take (name 200, email 320, message 5,000 characters)."; "The form could not be submitted from here." and, for a failure at our end, "Something went wrong on our side, and your message was not sent. It is still here: try again in a moment. You can write to us directly at edward@samavik.com." |
| 28 | Form, the network fails (new) | (the same single sentence as above) | We could not reach the server, so nothing was sent. Your message is still here: check your connection and try again. You can write to us directly at edward@samavik.com. |
| 29 | Footer | © 2026 Samavik L.L.C-FZ · Meydan Free Zone, Dubai, UAE (kept) | Added the colophon: "Founder-led. Proof over promises." and "Samavik L.L.C-FZ, a licensed company in the Meydan Free Zone, Dubai, UAE. Set in Cormorant Garamond and Manrope, both under the SIL Open Font Licence. This site sets no cookies and loads nothing from anywhere else." The last sentence is true and is checked in REPORT.md. |
| 30 | Menu and small interface words (new) | none | "Menu" and "Close" (the phone menu's button), "Evening or day" with "Switch to day" / "Switch to evening" (inside the menu), "Skip to content" (kept), "Back to the top ↑" (footer), the mode switch's spoken names "Switch to day mode" and "Switch to evening mode". |
| 31 | Contact, labels | Name, Email, What are you building? | the same words as tracked capitals; the page heading above the form is "Write to us" with the label "Enquiry" (no. 22). |
| 32 | Contact, without JavaScript (new) | the form was shown and sent a GET to the home page with the message in the address | The form needs JavaScript. Please write to edward@samavik.com. |
| 33 | Work, the numbers | none | "No. 01" to "No. 06" on the plates; the compact plates carry the standing (e.g. "Live in production") in tracked capitals beside the number, as the wide plates do, and the product's descriptor in the italic under the name. The words are the ones you had. |

Titles, descriptions, canonical and the structured data are unchanged except: the Open Graph and Twitter cards now carry the share image (`assets/share.png`), the card is "summary_large_image", and the structured data gained a `logo` address (the icon).

## Privacy (`privacy.html`)

| # | Old | New |
|---|---|---|
| 1 | Last updated: 8 July 2026 | Last updated: 18 November 2026 |
| 2 | (a new bullet under "What we collect") | **Evening or day:** if you use the switch in the top bar, your choice is kept in your browser’s local storage on your own device, so that the site opens the way you left it. It is never sent to us, and it is not a cookie. Clear your browser’s site data and it is forgotten. |
| 3 | (a new section) | **What this site loads.** Everything on this site comes from samavik.com itself: its pages, its pictures, and the two typefaces (Cormorant Garamond and Manrope), which we host ourselves. Nothing is requested from Google Fonts or from any other third party, and the site sets no cookies. The only request your browser makes beyond fetching the pages is the one the contact form sends to us when you press Send. |

**Not word for word:** the old page's other sentences are unchanged, but the page around them is new, and these words are new on it:

| # | New | Where |
|---|---|---|
| 4 | The top bar and menu: "Services", "Work", "Process", "Founder", "Start a project", "Menu", "Close", "Evening or day", "Switch to day", "Skip to content" | every page |
| 5 | "Privacy" (the small heading above the title), and the title set as "Privacy Policy" (the same two words as before) | head |
| 6 | The colophon: "Founder-led. Proof over promises.", "Colophon", "Samavik L.L.C-FZ, a licensed company in the Meydan Free Zone, Dubai, UAE. Set in Cormorant Garamond and Manrope, both under the SIL Open Font Licence. This site sets no cookies and loads nothing from anywhere else.", "Pages" with the links Services, Work, Contact, Privacy, "© 2026 Samavik L.L.C-FZ · Meydan Free Zone, Dubai, UAE", "Back to the top ↑" | foot |
| 7 | The canonical address `https://samavik.com/privacy` (the old page had none) and the `noindex` kept | head of the page's source |

(Today's page said nothing about fonts, because it loaded Google Fonts; that is gone, and items 2 and 3 say what the site now does. The earlier sentence in this file that everything else was word for word was wrong; this table replaces it.)

## WordPress migration (`wordpress-migration.html`)

Every price, percentage, duration, case-study figure and claim is kept exactly, including the ones you may wish to look at again (see the end).

| # | Where | Old | New |
|---|---|---|---|
| 1 | Head | SERVICE  WordPress to Next.js Migration | Service · WordPress to Next.js Migration |
| 2 | Head, the headline | Migrate WordPress to / Next.js — faster, cheaper, / zero maintenance (set on three lines) | the same words in running lines, "Next.js" in the italic |
| 3 | Case study | Completed Migration (a badge) | Case study · Completed Migration |
| 4 | Footer | Projects (link to `/#projects`, which is not on the page) | Work (link to `/#work`) |
| 5 | The top bar and menu: "The Problem", "Pricing", "Results", "FAQ", "Free Audit" (the same words as before), plus "Menu", "Close", "Evening or day", "Switch to day", "Skip to content" | every page |
| 6 | New small words: the label "Free audit" above "Start with a free audit"; the cost table's name for assistive technology, "Monthly cost, WordPress against Next.js" (not shown on screen); "Before:" and "After:" spoken before each case-study figure (not shown on screen); on a phone the table reads as stacked rows with the column names "WordPress" and "Next.js (New)" repeated beside each figure | page |
| 7 | The colophon, as on the privacy page (no. 6 there), and the footer line "© 2026 Samavik L.L.C-FZ. Meydan Free Zone, Dubai, UAE." now reads "© 2026 Samavik L.L.C-FZ · Meydan Free Zone, Dubai, UAE" | foot |
| 8 | The share-card tags: `og:image`, `og:site_name`, `twitter:card` "summary_large_image" and `twitter:image` added (the title and description words are unchanged) | head of the page's source |
| 9 | The six emoji icons beside the problems, the stack and the ownership cards | present | removed (they are pictures, not words; the numbers 01 to 06 stand in their place) |

Claims on this page that I kept as they are but that are the owner's to stand behind: "used by Netflix, Nike, TikTok, and thousands of others"; "WordPress is the #1 target for hackers"; "The #1 cause of WordPress downtime isn't hacking"; the case study's figures (£300/mo to £20/mo, Lighthouse ~55 to 95+, TTFB ~1,200ms to <100ms, 12+ plugins to 0); "90%", "<1s", "95+", "50-80%" in the hero and cards. I have not checked any of them.

## 404 page (`404.html`, new)

Title "Not here — Samavik"; "404"; "Not here."; "The page you asked for is not here, or it has moved."; the key "Back to samavik.com". Not on today's site (which shows Vercel's plain default).

## Files with words in them (new)

`robots.txt` (allow all; the sitemap's address) and `sitemap.xml` (the three clean addresses: `/`, `/wordpress-migration`, `/privacy`). No page words.

## Worded to the company's licence (18 Nov 2026, branch `copy/ppgdrone-aviation`)

Asked for by the owner: the company is licensed for software development and consultancy (and sport coaching), so nothing on the site should say it builds, sells or operates an aircraft.

| # | Where | Old | New |
|---|---|---|---|
| 1 | PPGDrone, the standing | R&D · Patent filed | R&D · In research |
| 2 | PPGDrone, the italic | World-first dual-mode aircraft | Flight software for a drone-assisted paramotor |
| 3 | PPGDrone, the description | Drone-assisted paramotor for wingsuit BASE logistics: hardware, flight systems and software. The lab project that shows range beyond the browser. | Research into flight-control and autonomy software for a drone-assisted paramotor frame, for wingsuit BASE logistics. The airframe is the founder’s own patent-pending project; Samavik’s part is the software. The lab project that shows range beyond the browser. |
| 4 | PPGDrone, the small rows | Platforms: Hardware · Covers: Flight control, EASA Open A3 | Scope: Software · Covers: Flight control, Autonomy |
| 5 | PPGDrone, the number | No. 06 | No. 07 (DogSpot is now No. 06) |
| 6 | Work, a new plate (No. 05) | none | **Samavik Aviation** · Own product · In development · "Software for pilots, clubs and owner groups" · "A pilot’s logbook, licences and training in one record, with workspaces for flying clubs, drop zones and groups that own an aircraft together. Samavik’s part is the software." · Platforms: Web, iOS · Stack: Next.js, Rails, Postgres, React Native. Picture: a logbook page from the product's demonstration (fictional data), captioned "A pilot’s logbook · demonstration data · Captured 18 Nov 2026". No link (the product is not open to the public). |
| 7 | Contact, the CV line | Hiring or staffing a build? | Need a senior engineer on a build? (the company delivers the work under contract; it does not supply staff) |

Removed claims: "World-first", "aircraft", "hardware", "EASA Open A3", and "Patent filed" as the company's standing (the patent applications are the founder's own, which the description now says).

## The product's name (19 Nov 2026, branch `fix/product-name`)

The owner decided on 7 Nov 2026 that the product is called "Samavik", not "Samavik Aviation". The app and the phone app have said "Samavik" since then; plate No. 05 did not, which was an error when the plate was added. "Samavik Aviation" also reads as an aviation company, and the company's part is the software.

| # | Where | Old | New |
|---|---|---|---|
| 1 | Plate No. 05, the title | Samavik Aviation | Samavik |
| 2 | Plate No. 05, the picture's description for screen readers | A pilot’s logbook page in Samavik Aviation: … | A pilot’s logbook page in the Samavik app: … |

| 3 | Plate No. 05, a link under the facts (20 Nov 2026, at the owner's request: "make sure that the website clicks through to the app login page") | none | Sign in at app.samavik.com → (opens `https://app.samavik.com/login` in a new tab, as the other plates' links do) |

Nothing else on the plate changed. The link is to the sign-in page for people who already have an account; the plate still says "In development" and offers no sign-up.

## Plate No. 06 is TheDogSpot, shown with its screens and its two stores (21 Nov 2026)

At the owner's request: "dogspot is called thedogspot for both ios and android.. please fix the website to show it off and display it". The app's name on the App Store is TheDogSpot. The plate moves from the small row to a wide plate with two of the app's own public App Store screenshots (stored in the repository, never hot-linked) and a link to each store. A stray `-->` that showed under the small plates, left from an old comment, is removed with its orphan closing tag.

| # | Where | Old | New |
|---|---|---|---|
| 4 | Plate No. 06, the title | DogSpot | TheDogSpot |
| 5 | Plate No. 06, the standing | Live in production | Live on App Store and Google Play |
| 6 | Plate No. 06, the line under the title | Social competition app | A dog-spotting game to play with friends |
| 7 | Plate No. 06, the description | Mobile social game with real users: accounts, feeds, scoring, moderation and releases. Concept to production, built and operated end-to-end. | Spot a dog, take its picture, score the points. Friends play in private games and on a live leaderboard. A mobile social game with real users: accounts, feeds, scoring, moderation and releases, built and operated end-to-end. |
| 8 | Plate No. 06, the picture | none | Two screens of the app (starting a new game; five points on the board), captioned "TheDogSpot on the App Store · Captured 21 Nov 2026", each with a description for screen readers |
| 9 | Plate No. 06, links under the facts | none | Download on the App Store → and Get it on Google Play → (each opens the app's store page in a new tab) |

The first two sentences of the description say what the app's own store page says (spotting dogs, photographs, points, games with friends, a leaderboard). Nothing else on the page changed in wording. With one plate left in the small row, No. 07 now spans it.

## Proposed additions, not shown

These are not on any page. Say yes to any and I add it.

1. **A promise before sending:** "Replies within one working day." as the note beside the Send key. Today's site says this only after a message is sent ("you'll hear back within one working day", kept as no. 23).
2. **A line about hosting on the privacy page:** "The site is hosted by Vercel. Like any web host, it keeps routine server logs (for example, the address of the device that asked for a page) for the security and running of the service." True of any such host, but today's page does not say it and I cannot confirm Vercel's settings for you; the lawyer may want it.
3. ~~The aviation platform's plate~~: now shown as No. 05 (see "Worded to the company's licence" above).
4. **A link from the home page to the WordPress migration page** (today none exists; the page is reached by its address only).
