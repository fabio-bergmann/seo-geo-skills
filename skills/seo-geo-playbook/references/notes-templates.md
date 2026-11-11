# Notes Templates

Create `seo/` with these files on the first run. Keep them short and true: change a line when a fact changes, don't add a second one beside it.

## seo/site.md

```markdown
# {Site}

Updated {date}

## The business

- Sells: {the product, one line} (source: {URL or file})
- Buyer: {who, and the problem they have}
- Not for: {who it isn't for, so topics stay honest}
- Prices: {plans and prices} (source: {pricing page}, read {date})
- The conversion that counts: {trial, sale, lead}, measured in {tool}
- Money pages: {URLs}

## Rivals

| Rival | Site | Price from (dated) | Where they're stronger |
| - | - | - | - |

## Authority

- Referring domains: {n} ({source}, {date}), or BLOCKED: no backlink data
- Indexed: {n} of {n} sitemap pages ({source}, {date})

## Data I can reach

Search Console: {yes/no} · Bing Webmaster Tools: {yes/no} · Analytics: {tool or none} · Backlinks: {tool or none} · AI answers: {which AI models, and how}

## What I may do without asking

{publish / change live pages / send email / nothing yet}
```

## seo/prompts.md

```markdown
# Buyer prompts

Fixed since {date}. Retire a prompt only with a reason in ledger.md.

| # | Prompt | Kind |
| - | - | - |
| 1 | {in the buyer's words} | problem / category / comparison / branded |

## Runs

### {date}: {AI models}, {n} runs each, {API or app}, search {on/off}

| # | AI model | Named | Recommended | Cited | Rivals named | Pages cited |
| - | - | - | - | - | - | - |
```

## seo/pages.md

```markdown
| URL | The one question it answers | Main keyword | Live since | Last change (kind, date) | Next change allowed |
| - | - | - | - | - | - |
```

## seo/ledger.md

```markdown
| Date | Topic, change or pitch | Decision | Reason | Look again |
| - | - | - | - | - |
| {date} | {item} | Go / Hold / Kill | {the buyer's question; where the brand stands, with numbers and window; what Google and AI show; the edge, or what's missing} | {date or never} |
```

## seo/plan.md

```markdown
# The next 30 days, from {date}

Pace: {n} new pages ({why: indexed share, warm-up}). Calendar: {Sightkick, the CMS, or this file}.

| Day | Page | The one question | Main keyword (volume, source, date) | Verdict | Brief | Status |
| - | - | - | - | - | - | - |
| {date} | {title, URL} | {question} | {keyword} | Go | seo/briefs/{slug}.md | brief / draft / owner said yes / on its day / live |
```

## seo/log.md

```markdown
- {date} {what shipped} {URL} – {why, in one line}
```

## seo/reports/{date}.md

The weekly report: `weekly-report.md`.
