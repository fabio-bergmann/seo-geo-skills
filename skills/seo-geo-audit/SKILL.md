---
name: seo-geo-audit
description: Audits why a website isn't found on Google or in AI answers, with a crawl script, and returns the fixes worst first, each with its evidence. Checks whether search and AI crawlers can get in (robots.txt, firewall blocks, noindex, nosnippet, content that needs JavaScript), indexing, titles, canonicals, internal links from a real crawl and the brand's entity basics. Use when the user asks for an SEO audit, technical SEO check, site audit or GEO audit, asks why their site isn't on Google, why ChatGPT, Perplexity or AI Overviews don't cite it, why pages aren't indexed, or whether the site is ready for AI search. Not for writing or rewriting content.
license: MIT
metadata:
  author: Fabio Bergmann
  version: 1.0.8
---

# SEO and GEO Audit

Finds why a site isn't found on Google or in AI answers, and lists the fixes worst first, each with its evidence. Access comes first: a page a bot can't fetch, can't index or isn't allowed to quote can't rank or be cited, however good it is.

Read `references/ground-rules.md` first. The keys in brackets are in `references/sources.md`.

## 1. Crawl

Run the crawler in this skill's `scripts/` folder (Node 18 or later, nothing to install):

```bash
node {this skill's folder}/scripts/crawl.mjs https://example.com --max 300 --out seo/crawl.csv
```

It reads robots.txt the way each search and AI bot would, crawls the sitemap and the internal links, and prints a summary in markdown with one CSV row per page. For each URL that isn't a 200 it lists the pages that link to it, where the fix goes. It goes one request at a time, waits between them, says who it is and never leaves the site, not even for a redirect. Crawl only sites the owner runs.

No Node? Fetch robots.txt, the sitemap and the 10–20 pages that matter most yourself, and check the same things.

## 2. The checks, in order

### Gate 1: can bots get in?

- **robots.txt lets the search bots and the user fetchers in:** Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot and Perplexity-User. OpenAI: "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers" (OPENAI-BOTS). The crawl prints a row per bot.
- **Training bots are the owner's choice:** GPTBot, ClaudeBot, Google-Extended and CCBot. Blocking GPTBot or ClaudeBot has no measured citation cost: 88.2% of sites blocking GPTBot were still cited in one study (BUZZSTREAM-BLOCKING). But Google-Extended also decides whether the Gemini app can ground answers in the site (G-AITRAIN).
- **The shared training opt-out:** if robots.txt has a `User-agent: __usage_ai-training` group and no `Google-Extended` group, flag it. The crawl does. From 2027 Google will read that opt-out as a Google-Extended block, which drops the site from Gemini-app answers. AI Overviews and AI Mode are not affected. To stay in Gemini's answers, add `User-agent: Google-Extended` with `Allow: /`. That also allows Gemini training, since one token covers both. Which matters more is the owner's call (G-AITRAIN).
- **No firewall answers those bots with a 403 or a challenge.** robots.txt can say yes while a CDN's bot protection says no. Ask the owner to check the host's bot settings, and read the server logs or Bing Webmaster Tools' crawl data if you can reach them. Google-Agent ignores robots.txt, so check the firewall instead. Leave it unblocked if agents should be able to buy or book on the site (G-AGENT).
- **On Cloudflare, Training "Block" blocks search too.** In AI Crawl Control, "Block" for the Training class still stops Googlebot, Bingbot and Applebot, search included. "Disallow AI Training" opts out of training and keeps them crawling for search (CF-AITRAIN, 2026-09-15).
- **Never test with a crawler's user agent.** A fetch that borrows a bot's name lands in the site's logs as that bot, so it muddies the owner's crawler data, and anyone else's site you fetch. It proves nothing either: a firewall that verifies bots by their IP addresses answers the real bot differently from a faked one. Check the host's bot settings, the server logs with each bot verified by reverse DNS or its maker's published IP ranges, or Bing Webmaster Tools' crawl data (G-VERIFY, OPENAI-BOTS). The crawl sends its own name, never a bot's.
- **Nothing blocks quoting:** no `noindex` where it shouldn't be, and no `nosnippet`, `max-snippet:0` or `data-nosnippet` on content that should be cited (G-ROBOTSMETA). Google's AI features use pages that are indexed and eligible for a snippet (G-AIFEAT). Search Console's "Search generative AI" setting stays on Include (G-SGAI).
- **Nothing keeps Copilot from grounding in the page.** Until 2027-03-01, Bing reads `noarchive` as keeping a page out of Copilot's answers and grounding, and `nocache` as limiting Copilot to the URL, title and snippet. From 2027-02-01 the page-level `ai-grounding:disallow` (or `disallowextended`) setting does that job instead. A stray one in a template drops every page on it from Copilot while rankings look fine (BING-GROUNDING, 2026-10-30). The crawl flags all three.
- **What matters is in the raw HTML:** the content, prices, plans, tables, dates, canonical and links. ChatGPT-User and Claude's and Perplexity's bots don't run JavaScript (VERCEL-CRAWL, EDGECOMET-JS), and Google renders it later (G-JS). OAI-SearchBot may have started rendering some pages in late 2026, unconfirmed. The crawl lists pages with under 150 words in the raw HTML, and pages whose `<main>` or `<article>` holds under 150 while a big menu or footer fills the page count.

### Gate 2: is it indexed?

- **The sitemap** exists, is listed in robots.txt and holds only pages that answer 200, are their own canonical and can be indexed. The crawl lists the ones that don't.
- **Search Console's page indexing report:** "Crawled – currently not indexed" is usually a verdict on quality, not a technical fault (G-NOTINDEXED). A new site is crawled conservatively (G-CRAWLBUDGET), so publish at the pace pages get indexed.
- **Dates agree:** the sitemap's `lastmod`, the JSON-LD `dateModified` and the date on the page name the same day, and move only with a real change. Google can stop trusting `lastmod` for the whole site once it finds it wrong (G-SITEMAP, ILLYES-LASTMOD). The crawl lists the pages where they disagree.
- **No shortcuts:** the Indexing API is for job postings and livestreams only, and IndexNow reaches Bing, not Google (G-INDEXINGAPI, INDEXNOW).
- **Bing too:** Bing's index grounds Copilot. Microsoft's first-party data on AI citations is Bing Webmaster Tools' AI Performance report and Clarity's Citations dashboard (BING-AIPERF, CLARITY-CITATIONS). Neither covers ChatGPT, and Search Console's AI report shows impressions only (G-AIREPORT).
- **ChatGPT, for a claimed business:** since 2026-11-10, OpenAI's Business Hub beta shows a business that claims its listing its mentions (ChatGPT referencing its website), recorded link clicks and discovery topics. It's reported for eligible ecommerce and online service businesses in the US. "Clicks don't confirm website visits or conversions", and whether a software company can claim is unstated (OPENAI-BIZHUB).

### Gate 3: can each page be understood?

- One title per page, in the searcher's words and not repeated elsewhere. One H1. A meta description.
- The canonical points to the page itself unless it is a true duplicate.
- Two pages ranking for one search isn't a problem by itself: on Ahrefs' own site, 1 of 80 sampled cases needed a fix (AHREFS-MULTIRANK, 2024). Act when they split the clicks and neither wins.
- Core Web Vitals are a floor (LCP up to 2.5 s, INP under 200 ms, CLS under 0.1), not a lever beyond it (G-CWV). Measure them in PageSpeed Insights (pagespeed.web.dev) or Search Console's Core Web Vitals report. The verdict is the field data: real Chrome users over the last 28 days, at the 75th percentile (PSI). A small site often has none, for the page or the whole origin: then write `BLOCKED: no field data` and give the lab numbers as a hint, not a verdict. A lab run can't measure INP (PSI).

### Gate 4: internal links

- **Every page that matters has at least 3 internal links in,** with anchor text that says where they go. Google asks for at least one link from another page (G-LINKS); 3 is our floor. Pages that matter are the ones meant to rank for a buyer's question. Hubs, legal pages and About can live on menu links. Orphans first: pages in the sitemap with no link in. Count the links in the page content: a menu or footer link is on every page, so it meets the floor without recommending anything. The crawl counts both: the links in from page content, and all links in. Take the counts from the crawl, never from memory.
- **Money pages** (pricing, comparisons, the product) are linked from the pages that get the traffic.

### Gate 5: entity basics

- **The same name, one-line description and links everywhere** the brand appears: the site, its social profiles, directories and review sites.
- **Structured data for rich results and a clear entity,** not for AI citations: Organization with `sameAs` and a stable `@id`, plus Breadcrumb and Article where they fit, marking up only what's visible (G-GALLERY). FAQPage and HowTo earn no rich result any more (G-SDUPDATES). Google: "Structured data isn't required for generative AI search" (G-AIOPT).
- **A plain-HTML page per brand task** (pricing, cancelling, refunds, support) that answers in its first lines. Google is testing a box of "one or two official places on the web to complete a specific task" (G-OFFICIAL).
- **llms.txt is optional, never a fix.** Coding agents read it, AI answers don't use it (AHREFS-LLMSTXT).

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
