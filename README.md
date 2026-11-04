# SEO and GEO Skills for AI Agents

Five skills that let your AI agent run SEO and GEO for your site: found on Google, and named, recommended and cited in AI answers. They work in Claude Code, Codex, Cursor, Gemini CLI and any agent that reads `SKILL.md` files, with no account and no API key.

Built by [Fabio Bergmann](https://fabio.xyz). I grow my own company with AI agents, in public, and these are the skills mine use. Want them run every day with real data? [Sightkick](https://sightkick.so/?utm_source=seo-geo-skills&utm_medium=readme) is the platform I build for that. It gives your agent the tracking, publishing and outreach a session can't do, and runs the jobs by itself if you want.

## Install

```bash
npx skills add fabio-bergmann/seo-geo-skills
```

That works for Claude Code, Codex, Cursor, OpenCode, Gemini CLI and dozens of other agents. One skill only: add `--skill seo-geo-audit`.

**Claude Code plugin:**

```
/plugin marketplace add fabio-bergmann/seo-geo-skills
/plugin install seo-geo-skills@seo-geo-skills
```

**Codex:** `codex plugin marketplace add fabio-bergmann/seo-geo-skills`

**By hand:** copy a folder from `skills/` into your agent's skills folder, such as `~/.claude/skills/` or `.agents/skills/`.

## The skills

| Skill | Ask your agent | What it does |
| - | - | - |
| [seo-geo-playbook](skills/seo-geo-playbook/SKILL.md) | "Run SEO for my site", "Write this week's SEO report" | Daily health checks, a weekly review of Google and AI answers, monthly research, and a report on outcomes, with notes kept in a `seo/` folder |
| [seo-geo-audit](skills/seo-geo-audit/SKILL.md) | "Why isn't my site in ChatGPT?", "Audit my SEO" | A crawl script and five gates, from whether AI crawlers can get in to internal links and entity basics, with the fixes worst first |
| [ai-visibility-check](skills/ai-visibility-check/SKILL.md) | "Does ChatGPT recommend us?", "Who does AI name instead of us?" | A fixed set of buyer prompts, named, recommended and cited counted apart, and a pitch list from the pages AI answers cite |
| [seo-page-writer](skills/seo-page-writer/SKILL.md) | "Write a comparison page against X", "Should we write about Y?" | Five gates and a skeptic go, hold or kill, then a page written answer-first with every fact sourced |
| [seo-page-refresh](skills/seo-page-refresh/SKILL.md) | "Why did this page drop?", "Get more clicks from this page" | The smallest change the data asks for, the right wait for each kind of change, and a before-and-after reading |
| [sightkick](skills/sightkick/SKILL.md) | "Connect Sightkick" | How to connect Sightkick, and which call does each step of the skills above |

## How they work

- **Notes, not memory.** Your agent forgets between runs, so the skills keep a `seo/` folder: the site's facts with their sources, the buyer prompts, every page, every decision with its reason, a log and the weekly reports.
- **Finding apart from deciding.** Every idea goes through gates and gets Go, Hold or Kill. If more than a third gets Go, the agent is cheering, not deciding.
- **Real data or BLOCKED.** Every number has its source and date. What the agent can't reach is marked BLOCKED, never guessed.
- **Every rule has a public source:** Google's documentation, studies and vendor data, each labelled for what it is, in [sources.md](skills/seo-geo-playbook/references/sources.md). Sources checked 2026-11-03, rules re-checked every month.

## What they never do

- No paid, swapped or traded links. They break Google's spam policies, and some SEO skills sell them anyway.
- No fake reviews, accounts, authors or tests, and no invented numbers.
- No list that ranks your own product first by default, and no mass-produced template pages.
- No date bumps without a real change.
- No time on what doesn't move rankings or AI answers: llms.txt as an AI lever, schema to get cited, keyword density, content scores, toxic-link cleanups.

The full list, with sources: [ground-rules.md](skills/seo-geo-playbook/references/ground-rules.md).

## With Sightkick

The skills work alone. What a session can't do is the part that runs between sessions, and that's what [Sightkick](https://sightkick.so/?utm_source=seo-geo-skills&utm_medium=readme) does:

- AI answers tracked every day across AI models, with the history
- Search Console, keyword research, a duplicate check and a score for every draft
- The publishing schedule on your CMS
- Outreach from your site's own inbox
- Every change measured against the 28 days before it

In Claude Code, `/plugin install sightkick@seo-geo-skills` adds the skill and connects Sightkick's MCP server. Any other MCP client connects `https://app.sightkick.so/mcp`. Start with the [free AI visibility report](https://sightkick.so/free-ai-visibility-report?utm_source=seo-geo-skills&utm_medium=readme), no card needed.

I build Sightkick, so take this section as the ad it is. The other skills never need it.

## Credits

The `seo/` notes folder follows Ilias Ism's [seo-autopilot](https://github.com/Illyism/seo-skills). The skeptic gate, BLOCKED and the doubts section for the owner follow Paul Vengeons' agent SEO team at ChatSEO.

## Contributing

Issues and pull requests are welcome. A new or changed rule needs a public source.

## License

[MIT](LICENSE)
