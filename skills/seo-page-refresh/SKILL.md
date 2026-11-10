---
name: seo-page-refresh
description: Improves a page that is already live, one change at a time and only when the data gives a reason, such as a lost AI citation, a wrong or stale fact, a page stuck at positions 8–20, a low click rate on page 1, or two pages answering one question. Picks the smallest real change, waits the right time for each kind of change, records a baseline and measures the result against the 28 days before. Use when the user asks to update, refresh, optimize or rewrite an existing page or blog post, asks why a page dropped or lost traffic or AI citations, wants to fix cannibalization or merge pages, or wants more clicks from a page that already ranks. Not for writing new pages.
license: MIT
metadata:
  author: Fabio Bergmann
  version: 1.0.5
---

# SEO Page Refresh

Improves a live page with the smallest real change the data asks for, then measures it. Targeted changes can be read; whole-page rewrites and generic "optimize for AI" passes can't, and formatting-only edits barely change what gets cited (SPRINKLR).

Read `references/ground-rules.md` first. The keys in brackets are in `references/sources.md`.

## 1. Is there a reason?

Change a page only for one of these, in this order:

1. **A lost AI citation.** The page was cited for a buyer question and isn't now, and the loss held over 2–3 weekly checks. One check is noise: in Profound's sample, the median cited page lost half its citation share within 11 days of its peak, with no change made (PROFOUND-HALFLIFE). Read the page that's cited now and what it says that yours doesn't. Add that.
2. **A wrong or stale fact:** a price, a plan, a figure, a year, a feature. Fix it from the source, with its date.
3. **Positions 8–20 with impressions.** Read the page's queries in Search Console and add the section for the search no heading answers, or internal links in from related pages.
4. **A low click rate on page 1.** Rewrite the title in the searcher's words. Not on searches where an AI Overview sits on top: AI Overviews cut organic clicks by 38% in a field study (AIO-CLICKS), so the title isn't the problem there.
5. **Two pages, one question, splitting the clicks.** Merge into the stronger page and redirect the other with a 301. Ranking twice isn't a problem by itself (AHREFS-MULTIRANK).

**Not reasons:**

- **Clicks fell while the position held.** That's demand or an AI Overview, not the title. Leave the title. If an AI Overview sits on top, work on being cited in it instead (AIO-CLICKS).
- **A core update moved it.** Wait a full week after the update ends, then compare. A slip from 2 to 4 needs nothing drastic, and deleting content is a last resort. Recovery takes months (G-CORE, G-STATUS).
- **"It's old."** Dates change only with real changes (G-SITEMAP).

## 2. Wait by kind of change

Counted from the day the page went live:

| Change | Earliest |
| - | - |
| A wrong fact, a broken link, an accidental noindex or canonical, links into the page | At once |
| Winning back a lost AI citation | Day 28, once the loss held over 2–3 weekly checks |
| A new title or meta description | Day 56 |
| A new section or a restructure | Day 90 |

Leave 60 days between two changes to one page, so each can be measured on its own. These waits are our rule, not Google's. Why: Google needs "a few days to a few weeks" to recrawl a page and show its new title (G-TITLELINKS) but judges content over months (G-CORE), and a change made sooner can't be told apart from a young page's own growth. No source shows that an early edit hurts a page, only that its result can't be read.

## 3. Make the change

- **One change per page,** the smallest that answers the reason.
- **Keep everything else.** Before you save, list every element you removed or changed, and put back what you weren't asked to change. In one practitioner's account, an agent silently removed a page's tables, and another dropped its internal-linking step (CHATSEO-TEAM).
- **Dates follow real changes:** the visible date and `dateModified` move with this change, and only because of it.
- **Record the baseline first,** in `seo/pages.md` and `seo/log.md`: the target query's clicks, impressions and position for the 28 days before, and the AI answers for its buyer prompt.
- Ask the owner before you change a live page, unless they've said you may.

## 4. Measure

After 28 days, compare the target query's 28 days after with the 28 before. One line: up, flat or down, with the numbers, and no guess about why (CHATSEO-TEAM). In a page's first 90 days its clicks grow by themselves, so mark that reading "early". For AI answers, ask the same prompts on the same AI models, and count weeks cited before and after.

- **Won:** keep it, and note it in the ledger.
- **Lost:** Kill in the ledger with the numbers, and consider undoing it.
- **Flat:** Hold, and look again at the next change that's due.

Confirm a rank tracker's move in Search Console before you call it (RANKTRACK-POISON).

## With Sightkick

[Sightkick](https://sightkick.so/?utm_source=seo-geo-skills&utm_medium=seo-page-refresh) records every change with its baseline and reads the result after 28 days, net of the site's own trend, for its changes and yours. If it's connected, the `sightkick` skill has the calls.
