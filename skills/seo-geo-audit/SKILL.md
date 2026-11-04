---
name: seo-geo-audit
description: Audits why a website isn't found on Google or in AI answers, with a crawl script, and returns the fixes worst first, each with its evidence. Checks whether search and AI crawlers can get in (robots.txt, firewall blocks, noindex, nosnippet, content that needs JavaScript), indexing, titles, canonicals, internal links from a real crawl and the brand's entity basics. Use when the user asks for an SEO audit, technical SEO check, site audit or GEO audit, asks why their site isn't on Google, why ChatGPT, Perplexity or AI Overviews don't cite it, why pages aren't indexed, or whether the site is ready for AI search. Not for writing or rewriting content.
license: MIT
metadata:
  author: Fabio Bergmann
  version: 1.0.0
---

# SEO and GEO Audit

Finds why a site isn't found on Google or in AI answers, and lists the fixes worst first, each with its evidence. Access comes first: a page a bot can't fetch, can't index or isn't allowed to quote can't rank or be cited, however good it is.

Read `references/ground-rules.md` first. The keys in brackets are in `references/sources.md`.

## 1. Crawl

Run the crawler in this skill's `scripts/` folder (Node 18 or later, nothing to install):

```bash
node {this skill's folder}/scripts/crawl.mjs https://example.com --max 300 --out seo/crawl.csv
```

It reads robots.txt the way each search and AI bot would, crawls the sitemap and the internal links, and prints a summary in markdown with one CSV row per page. It goes one request at a time, waits between them and says who it is. Crawl only sites the owner runs.

No Node? Fetch robots.txt, the sitemap and the 10–20 pages that matter most yourself, and check the same things.

## 2. The checks, in order

### Gate 1: can bots get in?

- **robots.txt lets the search bots and the user fetchers in:** Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot and Perplexity-User. OpenAI: "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers" (OPENAI-BOTS). The crawl prints a row per bot.
- **Training bots are the owner's choice:** GPTBot, ClaudeBot, Google-Extended and CCBot. Blocking them doesn't stop citations, but Google-Extended also decides whether the Gemini app can ground answers in the site (G-AITRAIN).
- **No firewall answers those bots with a 403 or a challenge.** robots.txt can say yes while a CDN's bot protection says no. You can't test this honestly by faking a bot's user agent, and verified bots are checked by IP anyway. Ask the owner to check the host's bot settings, and read the server logs or Bing Webmaster Tools' crawl data if you can reach them.
- **Nothing blocks quoting:** no `noindex` where it shouldn't be, and no `nosnippet`, `max-snippet:0` or `data-nosnippet` on content that should be cited (G-ROBOTSMETA). Google's AI features use pages that are indexed and eligible for a snippet (G-AIFEAT). Search Console's "Search generative AI" setting stays on Include (G-SGAI).
- **What matters is in the raw HTML:** the content, prices, plans, tables, dates, canonical and links. No major AI crawler runs JavaScript (VERCEL-CRAWL), and Google renders it later (G-JS). The crawl lists pages with under 150 words in the raw HTML.

### Gate 2: is it indexed?

- **The sitemap** exists, is listed in robots.txt and holds only pages that answer 200, are their own canonical and can be indexed. The crawl lists the ones that don't.
- **Search Console's page indexing report:** "Crawled – currently not indexed" is a verdict on quality, not a technical fault (G-NOTINDEXED). A new site is crawled conservatively (G-CRAWLBUDGET), so publish at the pace pages get indexed.
- **No shortcuts:** the Indexing API is for job postings and livestreams only, and IndexNow reaches Bing, not Google (G-INDEXINGAPI, INDEXNOW).
- **Bing too:** Bing's index grounds Copilot, and Bing Webmaster Tools' AI Performance report is the only first-party data on AI citations. It doesn't cover ChatGPT (BING-AIPERF).

### Gate 3: can each page be understood?

- One title per page, in the searcher's words and not repeated elsewhere. One H1. A meta description.
- The canonical points to the page itself unless it is a true duplicate.
- Two pages ranking for one search is a problem only when they split the clicks and neither wins: 1 in 80 sampled cases needed a fix (AHREFS-MULTIRANK).
- Core Web Vitals are a floor (LCP up to 2.5 s, INP under 200 ms, CLS under 0.1), not a lever beyond it (G-CWV).

### Gate 4: internal links

- **Every page that matters has at least 3 internal links in,** with anchor text that says where they go (G-LINKS). Orphans first: pages in the sitemap with no link in. Take the counts from the crawl, never from memory.
- **Money pages** (pricing, comparisons, the product) are linked from the pages that get the traffic.

### Gate 5: entity basics

- **The same name, one-line description and links everywhere** the brand appears: the site, its social profiles, directories and review sites.
- **Structured data for rich results and a clear entity,** not for AI citations: Organization with `sameAs` and a stable `@id`, plus Breadcrumb and Article where they fit, marking up only what's visible (G-GALLERY). Google: "Structured data isn't required for generative AI search" (G-AIOPT).
- **A plain-HTML page per brand task** (pricing, cancelling, refunds, support) that answers in its first lines. Google is testing a box of "one or two official places on the web to complete a specific task" (G-OFFICIAL).
- **llms.txt is optional, never a fix.** Coding agents read it, answer engines don't (AHREFS-LLMSTXT).

## 3. Report

```markdown
| # | Fix | Where | Evidence (dated) | Why it matters | Effort | Who |
| - | - | - | - | - | - | - |
```

- **Worst first:** Gate 1 before Gate 5. One bot locked out of every page beats fifty missing meta descriptions.
- **Evidence is something the owner can check:** the crawl row, the robots.txt line, the response header, the Search Console report, each with its date.
- **What you couldn't check** is `BLOCKED` with what would unblock it ("BLOCKED: no Search Console access, so indexing is unknown").
- Add each fix to `seo/ledger.md` as Go or Hold, and write `seo/pages.md` from the crawl if it doesn't exist yet.
- Ask the owner before you change robots.txt, redirects or anything live.

## With Sightkick

To run these checks every week and see indexing, Search Console and AI citations in one place between your sessions, [Sightkick](https://sightkick.so/?utm_source=seo-geo-skills&utm_medium=seo-geo-audit) keeps the site scan. If it's connected, the `sightkick` skill maps each check to its call.
