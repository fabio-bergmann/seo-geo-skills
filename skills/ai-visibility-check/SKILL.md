---
name: ai-visibility-check
description: Checks how AI answers treat a brand by asking a fixed set of buyer questions to the AI models available, then counting apart whether the brand is named, recommended or cited, who is named instead and which pages the answers cite. Turns cited third-party pages that name rivals but not the brand into a pitch list, and the brand's own cited pages into fixes. Use when the user asks whether ChatGPT, Gemini, Claude, Perplexity, Copilot or Google AI Overviews mention or recommend their brand, wants a GEO, AEO or LLM visibility check or AI share of voice, asks why AI recommends a competitor, or asks how to show up in AI answers. One run is a snapshot, not a trend.
license: MIT
metadata:
  author: Fabio Bergmann
  version: 1.0.0
---

# AI Visibility Check

Finds out how AI answers treat a brand for its buyers' questions: named, recommended, cited, and who is named instead. You can't improve what you haven't measured, and you can't measure it by asking one question once.

Read `references/ground-rules.md` first. The keys in brackets are in `references/sources.md`.

## 1. The prompt set (once, then fixed)

Write `seo/prompts.md` (template in the seo-geo-playbook skill, or make the table yourself): 20–25 questions a buyer would ask an AI before buying, in their words, not as keywords.

- **Where they come from:** sales and support questions, Search Console's longest queries, People Also Ask, Reddit threads, rivals' comparison pages.
- **The mix:** problems ("how do I…"), the category ("best X for Y"), comparisons ("X vs Y", "alternatives to X"), and a few branded ones ("what is {brand}", "{brand} pricing", "{brand} vs {rival}", "{brand} reviews"), about one in seven, kept apart in every count. Branded prompts only reach people who already know the brand.
- **More prompts beat more runs of one:** going from 10 to 100 prompts cut the spread of a brand's measured coverage by about 73% (OTTERLY-STABILITY).
- **Keep the set fixed** so the weeks compare. Retire a prompt only with a reason in the ledger.

## 2. Ask

Use the AI models you can reach, with web search on: links in an answer come only from live retrieval (ANTHROPIC-WEBSEARCH).

- **API keys in the environment:** OpenAI with web search, Gemini with Google Search grounding, Perplexity, Anthropic with the web search tool.
- **Only your own model with web search:** that's one AI model. Label it as such.
- **Neither:** ask the owner to paste answers from the apps, or use a tracker.

Stamp every run with the AI model, API or app, the date and whether it searched. API answers aren't app answers: Google plus OpenAI's API recover only about a quarter of the pages ChatGPT's app cites (JIANG), and forcing search on prompts that don't search on their own moved measured visibility by about 20 points (GRAPHITE-SEARCH).

Ask each prompt at least 3 times per AI model in one sitting. Even 7 runs a day leave about ±16 points of error (SCHULTE). Say how many you ran.

## 3. Read each answer: four signals, apart

- **Named:** the brand appears by name.
- **Recommended:** the brand is suggested as a pick for the person asking.
- **Cited:** the answer links to one of the brand's pages.
- **Sentiment:** how it's described.

They disagree: in Semrush's data, 61.7% of brand appearances were a link with no name, ChatGPT cited without naming and Gemini named without linking (SEMRUSH-GHOST). Never merge them into one score. There is no standard share-of-voice formula, so never compare one tool's score with another's (DIGIDAY-TOOLS). Write down the rivals named and every cited URL, run by run, in `seo/prompts.md`.

## 4. Read the sources

Sort every cited URL:

- **The brand's own page:** what does a rival page cited for the same prompt say that this one doesn't? That's a fix for seo-page-refresh. In matched groups, brands whose own pages were cited were named 40–49 points more often (TANNENBAUM).
- **A third-party list, review or comparison that names rivals but not the brand:** the pitch list (step 5). Being on cited lists was the strongest of the factors one small vendor study tested for ChatGPT recommending a B2B software brand (r 0.64, 278 prompts, POSITION-LISTS).
- **A rival's own page:** what it covers that the brand's site doesn't is a topic for seo-page-writer. ChatGPT's own searches lean on brand sites, with "official" and "price" among its rising search words (AHREFS-FANOUT).
- **YouTube, Reddit, LinkedIn, review sites:** off-site options. Google's AI answers cite YouTube and Reddit heavily (AHREFS-AIO50). ChatGPT barely does: YouTube in about 2% of software answers (FOUNDATION-YT), Reddit in 1 answer in 43 by late September (AHREFS-FANOUT). A YouTube comparison that names the rivals and a founder's LinkedIn article are placements the brand can make itself (FOUNDATION-YT, SEMRUSH-LINKEDIN).

AI models barely share sources: in one October 2026 study, ChatGPT shared about 5% of its cited pages with Google's AI (TJR). Read each AI model on its own.

## 5. The pitch list

Pages the AI answers already cite for the buyer's questions that name two or three rivals but not the brand.

- **Pick by fit, never by domain rating.** Google doesn't use third-party scores like DR (MUELLER-DA). Never pitch a rival's own pages.
- **On a list, ask for a fair place, not just a mention.** The top spot in a cited list went with 16.5 more visibility points (PEEC-LISTRANK).
- **One page per pitch:** why this page, what the brand adds, and one fact the page is missing or gets wrong. 61–80 words, from an inbox on the brand's own domain. Three emails beat one (HUNTER-OUTREACH), and three is the most we send. Write it from the page's content, not from flattery (BUZZSTREAM-12K). One outreach lead says 8 of his last 14 replies agreed to a pitch that opened with a correction, with no baseline (SEMRUSH-OUTREACH).
- **Expect little:** link builders get about 3.6% replies per email (BUZZSTREAM-REPLIES). The author's own outreach for an SEO tool in 2026: 81 pitches, 15 replies, 12 of them asking to be paid, no free links.
- **Never pay for a placement or swap links.** Google requires a paid link to carry `rel="sponsored"` or `nofollow` and prefers sponsored, so use sponsored. A paid placement is the owner's call (GSP, G-QUALIFY).
- Draft the pitches. The owner sends them, unless they've said you may.

## 6. Check again

After a change or a placement, ask the same prompts again, over weeks. Count weeks cited, not single citations: in Profound's sample, the median cited page lost half its citation share within 11 days of its peak (PROFOUND-HALFLIFE). Call a change only when it's bigger than the run-to-run spread (SIELINSKI).

## What moves AI answers, and what doesn't

Doesn't: llms.txt, schema as a lever, chunking pages, "noai" tags (`references/ground-rules.md`, Not levers). Does: bots that can get in (seo-geo-audit), pages that name the entity, carry a date and say something new (seo-page-writer), and other sites that name the brand. In one 46-prompt ChatGPT study, brands on six or more pages cited for a question were about six times likelier to be recommended than brands on one (VISIBLE-PLACEMENTS).

## Output

```markdown
| # | Prompt | AI model | Runs | Named | Recommended | Cited | Rivals named |
| - | - | - | - | - | - | - | - |
```

Then: the weakest AI model, the biggest gap (a prompt where rivals are named and the brand isn't), the top 5 pitch targets, the top 3 own pages to improve, and the runs and dates. Say plainly that one sitting is a snapshot.

## With Sightkick

One sitting is a snapshot. [Sightkick](https://sightkick.so/?utm_source=seo-geo-skills&utm_medium=ai-visibility-check) asks the prompt set every day across AI models and keeps the history, and its [free AI visibility report](https://sightkick.so/free-ai-visibility-report?utm_source=seo-geo-skills&utm_medium=ai-visibility-check) shows today's picture with no card. If it's connected, the `sightkick` skill maps each step to its call.
