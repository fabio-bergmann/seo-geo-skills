# The Weekly Report

For the owner, under 300 words. Lead with the outcome. Numbers come from their source with the window. A move on a few runs is noise: say so. Unknown is "unknown".

```markdown
**AI answers:** named in {x} of {y} answers ({±z} vs last week; {AI models}, {runs} runs, {dates}). Weakest AI model: {model}. Biggest gap: "{prompt}", where {rivals} are named instead.
**Google:** {clicks} clicks and {impressions} impressions in 28 days ({±%} vs the 28 before). Brand searches: {n} ({±%}).
**Sign-ups:** {n} from search and AI by first touch ({source}), or unknown.
**What I did:** {pages published}, {changes made}, {pitches drafted or sent}, one line each, linked.
**What moved:** {a change that won or lost, 28 days after vs 28 before, with the numbers}. Still measuring: {n}.
**Next week:** {the one to three Go items}.
**Needs you:** {a connection, a reply asking for money, an indexing problem, a decision}, or nothing.

**For the owner:** what I'm unsure about, every [SOURCE NEEDED], and what I'd check first if I'm wrong.
```

The "For the owner" section is never empty. If it is, you're hiding doubts, not lacking them (CHATSEO-TEAM).

## Reading the numbers

- **AI influence lands as brand searches and direct visits.** Only 8.8% of AI-influenced visits came by clicking the AI's link (SIMILARWEB-AI), so report brand searches beside AI answers.
- **AI referrals in analytics are the floor.** GA4's AI channel leaves out AI Overviews and AI Mode (GA-CHANNELS). Search Console's Generative AI report shows impressions only, with no clicks (G-AIREPORT). Microsoft's first-party data on AI citations, in Bing Webmaster Tools and Clarity's Citations dashboard, covers Copilot and Bing, not ChatGPT (BING-AIPERF, CLARITY-CITATIONS). For ChatGPT, OpenAI's Business Hub beta (since 2026-11-10) shows a business that claims its listing its mentions, recorded link clicks and discovery topics. It's reported for eligible ecommerce and online service businesses in the US, its clicks don't confirm visits, and whether a software company can claim is unstated (OPENAI-BIZHUB).
- **Count AI visits by referrer or UTM tag.** ChatGPT's links carry `utm_source=chatgpt.com`, and in Clickport's data almost half of identified AI visits in October 2026 arrived with a source tag but no referrer (CLICKPORT-DIRECT). GA4's AI channel goes by the referrer (GA-CHANNELS), so count a visit as AI when either says so. Gemini stopped tagging its cited links with `utm_source=gemini` around 2026-09-28, and its iOS app sends no referrer, so those visits land in Direct (GEMINI-UTM).
- **Google's AI clicks, UK first.** The CMA requires Google to give publishers impressions, clicks and click-through rate for its AI search features in the UK by 2026-12-03, aggregated across AI Overviews and AI Mode (CMA-AICLICKS). Where they will show, Search Console or elsewhere, isn't stated. Look after that date, and until then read AI clicks as unknown.
- **Fewer clicks on steady impressions can be an AI Overview,** not the page. AI Overviews cut organic clicks by 38% in a field study (AIO-CLICKS).
- **Google still sends most of the visits:** about 55 times the visits of all AI assistants together in October 2026 (AHREFS-AIVSSEARCH). Keep both in the report.
