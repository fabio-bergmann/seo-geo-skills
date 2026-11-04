---
name: seo-page-writer
description: Decides whether a page is worth writing, then writes it to rank on Google and be cited in AI answers. Runs five gates (fit, search intent from the live results, a duplicate on the site, the page's information edge, worth it now) with a skeptic go, hold or kill, then drafts answer-first with sourced, dated facts and checks the draft before it ships. Covers blog posts, comparison (X vs Y), alternatives, best-of lists, integration and use-case pages. Use when the user asks to write an SEO article, blog post, comparison page, alternatives page or listicle, plan content for a keyword, write a content brief, or create a page for AI search or GEO. To change a page that's already live, use seo-page-refresh.
license: MIT
metadata:
  author: Fabio Bergmann
  version: 1.0.0
---

# SEO Page Writer

Writes one page that can rank on Google and be cited in AI answers, after deciding it deserves to exist. Most pages that fail were never worth writing, so the gates come first.

Read `references/ground-rules.md` first. Page types and the evidence each needs: `references/page-types.md`. The keys in brackets are in `references/sources.md`.

## 1. The gates

Run the topic through these in order. The first one it fails is the reason. Write the outcome to `seo/ledger.md`.

1. **Fit.** Would someone searching this ever buy the product? Read the top 10, not just the keyword: a shared word isn't a shared field. Grade it 0–3: 3 the product is the answer, 2 the searcher has the problem, 1 adjacent, 0 another field. Drop 0, hold 1.
2. **Intent.** Read the live top 10 (the type, format and angle of each page) and the AI answer for the same question. Pick the page type from what ranks and what gets cited. A list only when the query asks for one: explicit "best" or "ideas" searches had a list in the top 3 54.5% of the time, implicit ones 10.2% (PPC-LISTICLES). If the top 10 is agencies, product pages or dictionaries, an article won't rank there.
3. **Duplicate.** Does a page on the site already answer this question, in any wording? Check `seo/pages.md`, the sitemap and Search Console's queries per page. Then it's a section of that page or a refresh (seo-page-refresh), never a twin. Two keywords belong on one page when Google ranks the same URLs for both (KWI-CLUSTERING). A review, an alternatives page and a comparison for one rival are three different questions.
4. **Edge.** Name, in one line, what this page will say that the top 10 doesn't: the brand's own data, a dated primary source, a real comparison, first-hand product detail. No edge, no page. A page that adds nothing the top results lack is what Google's scaled content abuse policy targets, however it was written (GSP).
5. **Worth it now.** Demand (keyword volume as a rank, impressions, a buyer prompt where the brand is missing), winnability against the site's authority (a young or weak site goes for long-tail and comparison searches first), and focus: cover at least 3 of a topic's 5 buyer questions before you start the next topic (SEMRUSH-TOPICAL). Comparison, alternatives, pricing and "best X" pages come before definitions.

Then Go, Hold or Kill, with the reason. Be the skeptic: if more than a third of what you look at gets Go, you're cheering, not deciding (CHATSEO-TEAM).

## 2. The brief

Before you write, in `seo/briefs/{slug}.md` or the ledger row:

- The one question, the main keyword, and the other wordings that become sections.
- What the top 5 results and the AI answer all say, and what they all miss.
- The sub-questions an AI model would search on the way to its answer, not only the keyword: 95% of Gemini 3's fan-out queries had no search volume (SEER-FANOUT).
- The edge, with its source.
- The evidence for every claim about another company (`references/page-types.md`, Evidence).
- An outline that isn't the shape of the last page you wrote. Practitioners read the 2026 spam updates as hitting pages built from one template, though Google named no target.
- At least 3 pages on the site that will link in, and where this page links out to next.

## 3. Write

- **Answer first.** Under every question heading, 1–3 sentences that answer it and make sense lifted out alone, then the detail. Cited pages opened with a direct answer 20% of the time, against 5% for pages that weren't (TJR).
- **Name things.** The brand, the tools and the rivals by name, and the entity named in the first sentence of each section, not "it". Show a visible date and one hard number or new claim in each section. Passages AI answers quoted had these far more often than passages they used without credit (AWR-PASSAGES).
- **The strongest evidence early.** Put the brand's own data and the freshest facts in the first 30% of the page: 44% of ChatGPT citations come from there (INDIG-FIRST3RD). Define each number where it first appears, and give the method in one line ("90 answers from three AI models, 1–30 October 2026").
- **Nothing invented.** Every number, quote and claim about another company comes from a source you read, with its date. Write `[SOURCE NEEDED]` where you have none, then find it or cut the claim.
- **The product, once.** A blog post pitches the product in one place at most, worded freshly. Comparison, alternatives, integration and use-case pages are about the product by nature, and say so in a disclosure line.
- **Real freshness.** The year goes in the title only when the content is current and the results show years. Adding the month and year cost clicks in one split test (SEMRUSH-TITLEYEAR).
- **Substance over format.** Formatting-only edits barely change what gets cited (SPRINKLR).
- **Plain semantic HTML:** headings, paragraphs, real tables and lists, with the content, prices and dates in the HTML, never loaded by a script.

## 4. Check before it ships

- **Every claim has its source,** and every `[SOURCE NEEDED]` is resolved or cut.
- **Against the brief:** the question answered in the first lines, the edge on the page, the evidence a page type needs.
- **What changed:** when you rewrote a draft or started from a template, list every element you removed or changed, and put back what you weren't asked to change. Agents drop tables and sections without saying so (CHATSEO-TEAM).
- **The basics:** one title, one H1, a meta description, the canonical, the date, the disclosure where the page needs one.
- **For the owner:** what you're unsure about, every claim you couldn't source and the three sentences you're least sure of. Never empty.

Ask the owner before you publish, unless they've said you may.

## 5. After it goes live

- Add at least 3 internal links in from related pages, with anchors that say where they go (G-LINKS).
- Record the page in `seo/pages.md` and the change in `seo/log.md`.
- Ask for indexing in Search Console, and send IndexNow for Bing.
- Leave it alone until its kind of change is due (seo-page-refresh).

## With Sightkick

With [Sightkick](https://sightkick.so/?utm_source=seo-geo-skills&utm_medium=seo-page-writer) connected, the duplicate check, the results page, the draft's score against these rules and the publishing schedule are one call each. The `sightkick` skill has them.
