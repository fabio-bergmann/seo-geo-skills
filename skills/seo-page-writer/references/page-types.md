# Page Types

What each page type needs. For software, the pages that carry buying intent are comparisons, alternatives and pricing, so these come first. AI answers cite lists most (OTTERLY-CONTENTTYPES), and ChatGPT's searches lean on vendors' own pricing and product pages (AHREFS-FANOUT). The keys in brackets are in `sources.md`.

## Evidence

A page about a rival makes claims about someone else's product, so every claim about a named company carries its source. Google's guidance asks you to fact-check generated content and warns against deceiving readers (G-GENAI, G-HELPFUL). Strongest first:

1. **First-hand:** the brand used the rival, with an account, its own screenshot or a test it ran, dated. Only when it happened. Never "we tested" without a record of the test.
2. **The brand's own data:** what AI models said about both brands, counted and dated, with the method in one line.
3. **The rival's own pages,** read and dated: pricing, docs, changelog, feature pages, terms.
4. **Third-party pages, linked:** a review on a review site, a Reddit thread, an article. Quoted or summed up with the link and date, and labelled as their view.

Not evidence: what a model remembers, a rival's ad copy as fact, "users say" without a link, a feature table copied from another comparison site, a price without a date.

**The minimum for a page about a rival:** the rival's price from its own pricing page with "as of {date}" (or "pricing on request" when it's behind a sales call), at least three feature claims each with a source from levels 1–3, at least one place where the rival is better, and the brand's own claims held to the same standard.

**Can't meet it?** Don't write the page. Hold the topic with what's missing ("hold: the rival's pricing page needs a login, no dated price").

**Re-read rivals' prices and plan names every 90 days** on a live page, and fix the page when they change.

## Comparison: "{Brand} vs {Rival}"

URL `/vs/{rival}`. Title: "{Brand} vs {Rival}: {the one difference that matters}", with a year only when the page is current.

1. **The verdict first:** 2–4 sentences on who each product is best for and the main difference.
2. **At a glance:** a small table with price from (dated), best for, the main features and the free plan or trial. Visible HTML, not an image.
3. **Feature rows with a note column:** 6–12 rows, each with what the difference means in use. No tick grids without notes.
4. **Where {Rival} wins,** under its own heading, with at least one real point.
5. **Where {Brand} wins,** to the same standard.
6. **Prices:** each plan with what it includes, "as of {date}", linked to the pricing page.
7. **Who should pick which:** two or three short buyer cases.
8. **The brand's own data, if any,** with its method.
9. **FAQ:** 3–6 questions from People Also Ask and the buyer prompts, each answered in 1–3 sentences, visible on the page.
10. **Disclosure** near the top, in one line: "{Brand} makes this page. We keep the comparison factual and dated; tell us if something changed."

## Alternatives: "{Rival} alternatives"

URL `/alternatives/{rival}`. Title: "{N} {Rival} Alternatives for {the buyer's reason to leave}".

1. **Why people look for an alternative,** from evidence: price changes, reviews, Reddit threads, limits in the rival's docs. Linked.
2. **The short list:** a table of 5–10 options with name, best for, price from (dated) and one line on how each differs from {Rival}.
3. **One section per option:** what it is, best for, price, one strength and one limit, linked to its site. The brand is one of them, placed by the list rule below.
4. **How the options were picked,** in 2–4 lines.
5. **When to stay with {Rival}:** one honest paragraph.
6. **FAQ and disclosure,** as on a comparison page.

Each option needs a dated price and two sourced claims. Naming the real options is good for the page too: pages naming six or more brands drew about 1.76 times the ChatGPT citations of pages naming none, in one vendor study from August 2026, before GPT-6 (POSITION-LISTS, SISTRIX-GPT6).

## Lists that rank the brand ("best X")

A brand's own "best X" list can still win Google traffic: 62% of vendor-written lists gained it this year (PPC-LISTICLES). But AI Overviews left the self-ranking author out of the recommendation 83% of the time in one study (LILYRAY-SELFLISTS).

- **At most one per topic group.** Audience variants ("for beginners", "for small teams") are sections of it, unless Google ranks different pages for them.
- **Never the brand first by default.** Order by a stated criterion (best for a segment, price, alphabetical) and put the brand where that criterion puts it, or group by "best for" with no overall rank.
- **Disclosed in the first lines:** "{Brand} is one of the tools on this list; we make it."
- **At least one honest limit** in the brand's own entry.
- **Every option linked, priced and dated,** with the evidence above.
- **Updated at least yearly, with real changes.** 79.1% of the lists ChatGPT cited had been updated that year (AHREFS-BESTLISTS).

Better than writing one: getting onto the third-party lists AI answers already cite (ai-visibility-check, the pitch list). Being on them was the strongest of the factors one vendor study tested for ChatGPT, before GPT-6 (POSITION-LISTS).

## Integration: "{Brand} + {Tool}"

Only for an integration that works today. URL `/integrations/{tool}`.

1. What it does, in two sentences.
2. Who it's for.
3. How to set it up: numbered steps, each with a real screenshot of the product, never a generated image.
4. What it syncs or sends, and what it doesn't.
5. Limits and requirements: plans, permissions, known issues.
6. FAQ.

## Use case or industry: "{Brand} for {who}"

Pages that swap one word ("for dentists", "for lawyers") over the same text are doorway pages, which Google's spam policies name (GSP). Write one only when the use case has at least three things of its own: a problem the others don't have, a different setup or workflow, its own data or example, a different buyer question in the results. If the only difference is the noun, it's a sentence on another page.

URL `/use-cases/{case}` or `/for/{who}`. The problem in their words, how the product solves it with this case's own workflow and screenshots, an example or data from the case, what it doesn't do for them, FAQ.

## Blog post

Answers one buyer question, with the rules in the skill. The product pitched in one place at most. If the question has a page type above, use that type instead.

## Structured data

WebPage or Article with a `dateModified` that changes only with real changes, BreadcrumbList, and Organization for the publisher. ItemList on lists. It's hygiene, not a lever: price, date and verdict must be in the visible text (G-AIOPT, AHREFS-SCHEMA).

- **No FAQPage or HowTo markup for rich results.** FAQ rich results stopped appearing in Google Search on 2026-05-07, and HowTo was dropped in 2023 (G-SDUPDATES). Neither is in Google's gallery (G-GALLERY). A visible FAQ is still worth its text.
- **Product with Offer still earns its keep on a pricing page,** with the price, currency and availability matching what the page shows (G-GALLERY).
