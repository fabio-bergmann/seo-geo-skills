---
name: seo-geo-playbook
description: Runs SEO and GEO (AI search visibility) for one website on a daily, weekly and monthly rhythm, with health checks, a weekly review of Google and AI answers, a skeptic go/hold/kill on what to write or fix next, and a short weekly report on outcomes. Keeps its notes in a seo/ folder so every run picks up where the last one stopped. Use when the user asks to run, plan or manage SEO or GEO for their site, wants a weekly SEO report or an SEO routine, asks what to do next for organic traffic or AI mentions, or mentions an SEO autopilot, organic growth plan or getting found on Google and in ChatGPT. For a one-off audit use seo-geo-audit; to write one page use seo-page-writer.
license: MIT
metadata:
  author: Fabio Bergmann
  version: 1.0.4
---

# SEO and GEO Playbook

You run organic visibility for one website: found on Google, and named, recommended and cited in AI answers for its buyers' questions. The two feed each other. AI answers cite pages only when they search the web, and each AI model decides per question whether to (ANTHROPIC-WEBSEARCH, AHREFS-FANOUT). What they search is an index like Google's or Bing's, or the AI model's own (JIANG). And AI influence shows up mostly as more people searching the brand's name, not as clicks from the AI (SIMILARWEB-AI).

The goal is never "more pages". It's the brand named for its buyers' questions, and the sign-ups that follow. Fewer, better pages on one topic beat many scattered ones.

Read `references/ground-rules.md` at the start of every session. It holds the rules every skill in this set follows, and `references/sources.md` has the source behind each key in brackets.

## Your notes: the seo/ folder

You have no memory between runs, so everything lives in `seo/` in the site's repo or working folder, a pattern taken from seo-autopilot (SEO-AUTOPILOT). Templates: `references/notes-templates.md`.

| File | What it holds |
| - | - |
| `site.md` | The business: what it sells, to whom and to whom not, prices with source and date, money pages, rivals, the conversion that counts, the site's authority, what data you can reach and what you may do without asking |
| `prompts.md` | The fixed set of buyer questions and every run's results (ai-visibility-check) |
| `pages.md` | Every page: its URL, the one question it answers, when it went live, its last change and when the next is allowed |
| `ledger.md` | Every topic, change and pitch with Go, Hold or Kill, the reason and when to look again |
| `log.md` | One dated line per change shipped, with its URL |
| `reports/` | The weekly reports |

## Setup (first run, no seo/ yet)

1. Find in the repo, or ask the owner: the site, what it sells, the buyer, prices, the conversion (trial, sale, lead), 3–5 rivals, which data you can reach (Search Console, Bing Webmaster Tools, analytics, a backlink source, AI answers), and what you may do without asking.
2. Write `seo/site.md`. Mark what you couldn't check `[SOURCE NEEDED]`.
3. Run seo-geo-audit once, and ai-visibility-check once for the baseline.
4. Fill `seo/pages.md` from the sitemap or the crawl.
5. Stop. Show the owner `site.md`, the audit's five worst fixes and the baseline.

## Start every session

1. Read `seo/`: `site.md`, the ledger (don't decide again what you decided last week unless the data changed), the end of `log.md`, the last report.
2. Do what's due: Daily always, Weekly when the last report is 7 or more days old, Monthly when the last keyword research is 30 or more days old. Run only once a week? Do the daily part at the start of the weekly review.

## Daily (a few minutes)

- **Health:** pages dropped from the index, broken links, a failed deploy or publish. Fix or flag first: a page Google doesn't index can't rank or be cited.
- **Indexing:** new pages submitted and indexed yet? Search Console's URL inspection for Google, IndexNow for Bing. IndexNow doesn't reach Google, and the Indexing API is only for job postings and livestreams (INDEXNOW, G-INDEXINGAPI).
- **Replies and events:** a reply to a pitch, a lost citation. Act in the weekly review unless a reply waits on an answer.

## Weekly (the review)

1. **AI answers:** run the prompt set again (ai-visibility-check). Read the trend over weeks, never one run.
2. **Google:** clicks, impressions and position per page, the last 28 days against the 28 before, brand and non-brand apart (Search Console's branded queries filter, G-BRANDED).
3. **Page 2 to page 1:** pages at positions 8–20 with impressions are the cheapest wins (seo-page-refresh).
4. **The plan:** run every planned topic through seo-page-writer's gates. Write within the pace.
5. **Pitches:** third-party pages the AI answers cite that name rivals but not the brand (ai-visibility-check).
6. **The weekly report:** `references/weekly-report.md`.

## Monthly

- **Keyword research:** new seeds from Search Console queries, People Also Ask, the buyer prompts and rivals' pages. Group keywords by what Google ranks: two share a page when Google ranks several of the same URLs for both, not when they sound alike (KWI-CLUSTERING).
- **The bottom of the funnel first:** comparison, alternatives, pricing and "best X" pages before definitions, one per rival with demand.
- **Rivals:** what changed on their sites (diff their sitemaps month to month) and in the answers that name them.
- **Links and mentions:** new and lost links, pages that name the brand without a link.
- **Refresh:** lists and comparisons whose prices or year went stale. Real changes only.
- **Audit:** run seo-geo-audit again.

## Go, hold, kill

Every topic, change and pitch gets one, written to the ledger with its reason.

- **Go:** passes every gate. Do it within the pace.
- **Hold:** could be right later. Write what's missing and what would change it ("hold until 5 pages are indexed"). Look again weekly.
- **Kill:** off the field, a repeat, or a change that lost. It doesn't come back by itself.

Be the skeptic. Most weeks, most ideas are Hold or Kill. If more than a third of what you look at gets Go, you're cheering, not deciding (CHATSEO-TEAM). A reason names the buyer's question, where the brand stands today (named in x of y answers, its Google position), what Google and the AI answers show now, and the page's edge. Numbers with their window.

## The pace

- **Warm-up for young sites.** Google crawls a new site conservatively and indexes by quality (G-CRAWLBUDGET, G-NOTINDEXED). Nobody has published a safe rate, so pace by what gets indexed. Our starting rule: 3 new pages a week, up to 5 and then one a day once 80% of what's live is indexed, back down when the share drops. Practitioners cap young sites harder: Paul Vengeons at about one a week (CHATSEO-TEAM).
- **Live pages wait by kind of change** before you change them (seo-page-refresh).
- **One change at a time per page,** measured before the next.
- **Links last.** Pages first, then internal links, then pitches. A pitch for a page that doesn't deserve a place doesn't land.

## The weekly report

Under 300 words, outcome first, every number with its source and window, and a "For the owner" section with your doubts: `references/weekly-report.md`.

## With Sightkick

Between your sessions nothing tracks, publishes or measures unless something runs. [Sightkick](https://sightkick.so/?utm_source=seo-geo-skills&utm_medium=seo-geo-playbook) is the platform for that part: AI answers and Google tracked every day with history, the publishing schedule, outreach from the site's own inbox and every change measured. If it's connected, the `sightkick` skill says which call does each step.
