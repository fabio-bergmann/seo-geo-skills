#!/usr/bin/env node
// A small, polite crawler for an SEO and GEO audit. Node 18+, no dependencies.
//
//   node crawl.mjs https://example.com [--max 200] [--delay 500] [--out seo/crawl.csv]
//
// It reads robots.txt as each search and AI bot would, then crawls the
// sitemap and the links it finds on the same host. For every page it records
// the status, title, meta description, H1, canonical, robots directives, the
// words in the raw HTML (what a bot that runs no JavaScript sees), on the
// whole page and in its content alone, the internal links in and out,
// counting apart the links in a page's content (<main> or <article>, never
// its menus, header or footer), and the page's dates: the sitemap's lastmod,
// the JSON-LD dateModified and the date it shows. For a URL that isn't a
// clean 200 it lists the pages that link to it. It prints a summary in
// markdown and writes one CSV row per page. It waits between requests and
// always sends its own name: never a search or AI bot's user agent, which
// would land in the site's logs as that bot and prove nothing about it.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const UA =
  "seo-geo-skills-crawler/1.0 (+https://github.com/fabio-bergmann/seo-geo-skills)";

// The bots that decide whether a page can be found and cited. "search" bots
// and "user" fetchers should be allowed for GEO; "training" is the owner's
// choice and doesn't decide citations.
const BOTS = [
  ["Googlebot", "search", "Google Search, AI Overviews and AI Mode"],
  ["Bingbot", "search", "Bing and Copilot"],
  ["OAI-SearchBot", "search", "ChatGPT search"],
  ["ChatGPT-User", "user", "ChatGPT fetching a page for a user"],
  ["Claude-SearchBot", "search", "Claude search"],
  ["Claude-User", "user", "Claude fetching a page for a user"],
  ["PerplexityBot", "search", "Perplexity search"],
  ["Perplexity-User", "user", "Perplexity fetching a page for a user"],
  ["Applebot", "search", "Apple (Siri, Spotlight)"],
  ["GPTBot", "training", "OpenAI model training"],
  ["ClaudeBot", "training", "Anthropic model training"],
  ["Google-Extended", "training", "Gemini training and Gemini app grounding"],
  ["CCBot", "training", "Common Crawl"],
];

function args(argv) {
  const out = { max: 200, delay: 500, out: "seo/crawl.csv" };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--max") out.max = Number(argv[++i]);
    else if (a === "--delay") out.delay = Number(argv[++i]);
    else if (a === "--out") out.out = argv[++i];
    else rest.push(a);
  }
  out.start = rest[0];
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The site being crawled: its host with or without "www.". The crawler never
// fetches anything else, so a redirect or a sitemap entry can't send it to
// another site.
const bare = (h) => h.replace(/^www\./i, "").toLowerCase();
let SITE = "";
const onSite = (u) => {
  try {
    const x = new URL(u);
    return /^https?:$/.test(x.protocol) && bare(x.host) === SITE;
  } catch {
    return false;
  }
};

// Follows up to 5 redirects, only on the site. A redirect to another site is
// reported as it is (its 3xx status, final_url the target), not fetched.
async function get(url) {
  let at = url;
  try {
    for (let hop = 0; ; hop++) {
      const res = await fetch(at, {
        headers: { "user-agent": UA, accept: "text/html,application/xml;q=0.9,*/*;q=0.5" },
        redirect: "manual",
        signal: AbortSignal.timeout(20000),
      });
      const location = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && location) {
        const next = new URL(location, at).href;
        if (onSite(next) && hop < 5) {
          at = next;
          continue;
        }
        return { status: res.status, finalUrl: next, type: "", body: "", headers: res.headers };
      }
      const type = res.headers.get("content-type") || "";
      const body = /html|xml|text/.test(type) ? await res.text() : "";
      return { status: res.status, finalUrl: at, type, body, headers: res.headers };
    }
  } catch (e) {
    return { status: 0, finalUrl: at, type: "", body: "", headers: new Headers(), error: String(e.message || e) };
  }
}

// robots.txt, per RFC 9309: the group that names the bot wins over "*", the
// longest matching rule wins, and Allow wins a tie.
function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let current = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "sitemap") {
      sitemaps.push(value);
      continue;
    }
    if (key === "user-agent") {
      if (!lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (current && (key === "allow" || key === "disallow")) {
      current.rules.push({ allow: key === "allow", path: value });
    }
  }
  return { groups, sitemaps };
}

function ruleMatches(pattern, path) {
  if (pattern === "") return false;
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const re = new RegExp(
    "^" + body.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + (anchored ? "$" : ""),
  );
  return re.test(path);
}

// The shared AI-training opt-out (IETF aipref draft). Not a bot: no crawler
// fetches as it. Google, 2026-10-30: from 2027, a robots.txt that opts out
// with this token and doesn't name Google-Extended is read as blocking
// Google-Extended, which also takes the site out of the Gemini app's answers.
const TRAINING_TOKEN = "__usage_ai-training";

const groupsNaming = (robots, agent) => robots.groups.filter((g) => g.agents.includes(agent));

function allowed(robots, bot, path) {
  const name = bot.toLowerCase();
  let group = robots.groups.filter((g) => g.agents.some((a) => a !== "*" && a !== TRAINING_TOKEN && name.includes(a)));
  let via = "";
  if (group.length === 0 && name === "google-extended" && groupsNaming(robots, TRAINING_TOKEN).length) {
    group = groupsNaming(robots, TRAINING_TOKEN);
    via = TRAINING_TOKEN;
  }
  if (group.length === 0) group = robots.groups.filter((g) => g.agents.includes("*"));
  const rules = group.flatMap((g) => g.rules);
  let best = null;
  for (const r of rules) {
    if (!ruleMatches(r.path, path)) continue;
    const len = r.path.replace(/\$$/, "").length;
    if (!best || len > best.len || (len === best.len && r.allow)) best = { len, allow: r.allow };
  }
  return { allowed: best ? best.allow : true, named: !via && group.some((g) => !g.agents.includes("*")), via };
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripTags = (s) => decode(s.replace(/<[^>]+>/g, " "));

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    out[m[1].toLowerCase()] = m[3] ?? m[4] ?? m[5] ?? "";
  }
  return out;
}

// The page's own content, where a link is a real recommendation: every
// <main>, else every <article>, else the body, without menus, footers and
// sidebars (and the body without its header too). A menu link is on every
// page and says nothing about the page it points to.
function contentOf(html) {
  for (const tag of ["main", "article"]) {
    const parts = [...html.matchAll(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`, "gi"))].map((m) => m[0]);
    if (parts.length) return { area: tag, html: parts.join("\n").replace(/<(nav|footer|aside)\b[\s\S]*?<\/\1>/gi, " ") };
  }
  const body = html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html;
  return { area: "body", html: body.replace(/<(nav|header|footer|aside)\b[\s\S]*?<\/\1>/gi, " ") };
}

function linksIn(html, pageUrl, host) {
  const links = new Set();
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const href = attrs(m[0]).href;
    if (!href || /^(mailto|tel|javascript):/i.test(href)) continue;
    try {
      const u = new URL(href, pageUrl);
      if (u.host !== host || !/^https?:$/.test(u.protocol)) continue;
      u.hash = "";
      links.add(u.href);
    } catch {
      // not a URL
    }
  }
  return [...links];
}

function readPage(html, pageUrl, host) {
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? html;
  const title = stripTags(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  let description = "";
  let robots = "";
  for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    const name = (a.name || "").toLowerCase();
    if (name === "description") description = decode(a.content || "");
    if (name === "robots" || name === "googlebot" || name === "bingbot") robots = [robots, a.content || ""].filter(Boolean).join(", ");
  }
  let canonical = "";
  for (const m of head.matchAll(/<link\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    if ((a.rel || "").toLowerCase().split(/\s+/).includes("canonical") && a.href) {
      try {
        canonical = new URL(a.href, pageUrl).href;
      } catch {
        canonical = a.href;
      }
    }
  }
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const schemaTypes = new Set();
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g)) schemaTypes.add(t[1]);
  }
  let dateModified = "";
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const d of m[1].matchAll(/"dateModified"\s*:\s*"([^"]+)"/g)) {
      const day = isoDay(d[1]);
      if (day && day > dateModified) dateModified = day;
    }
  }
  const content = contentOf(html);
  return {
    title, description, robots, canonical, h1s,
    words: countWords(html),
    contentWords: countWords(content.html),
    dateModified,
    visibleDate: visibleDate(content.html),
    links: linksIn(html, pageUrl, host),
    contentLinks: linksIn(content.html, pageUrl, host),
    contentArea: content.area,
    schemaTypes: [...schemaTypes],
  };
}

const countWords = (html) =>
  stripTags(html.replace(/<(script|style|svg|template|head)\b[\s\S]*?<\/\1>/gi, " ").replace(/<!--[\s\S]*?-->/g, " "))
    .split(" ")
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// A date as its day, YYYY-MM-DD, as written (no time zone shift): from
// ISO 8601 ("2026-11-03", "2026-11-03T09:00:00+01:00") or from words
// ("November 3, 2026", "3 Nov 2026"). Anything else is "".
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const pad = (n) => String(n).padStart(2, "0");
function isoDay(text) {
  const t = String(text || "").trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/);
  if (m && MONTHS.includes(m[1].toLowerCase())) return `${m[3]}-${pad(MONTHS.indexOf(m[1].toLowerCase()) + 1)}-${pad(m[2])}`;
  m = t.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3})[a-z]*\.?,?\s+(\d{4})$/);
  if (m && MONTHS.includes(m[2].toLowerCase())) return `${m[3]}-${pad(MONTHS.indexOf(m[2].toLowerCase()) + 1)}-${pad(m[1])}`;
  return "";
}

// The date a reader sees on the page: the newest <time> in its content
// (its datetime, else its text), else a date written after "Updated",
// "Last updated", "Modified" or "Reviewed". Dates elsewhere in the text
// (a study from 2024, an event) are left alone.
const DATE_WORDS = String.raw`\d{4}-\d{2}-\d{2}|[A-Za-z]{3,9}\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}|\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]{3,9}\.?,?\s+\d{4}`;
function visibleDate(html) {
  let best = "";
  for (const m of html.matchAll(/<time\b([^>]*)>([\s\S]*?)<\/time>/gi)) {
    const day = isoDay(attrs(m[1]).datetime || stripTags(m[2]));
    if (day > best) best = day;
  }
  if (best) return best;
  const text = stripTags(html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " "));
  for (const m of text.matchAll(new RegExp(String.raw`\b(?:last updated|updated|modified|reviewed)(?: on)?:?\s+(${DATE_WORDS})`, "gi"))) {
    const day = isoDay(m[1]);
    if (day > best) best = day;
  }
  return best;
}

async function sitemapUrls(start, list, max) {
  const seen = new Set();
  const urls = [];
  const lastmod = new Map();
  const queue = list.length ? [...list] : [new URL("/sitemap.xml", start).href];
  while (queue.length && urls.length < max * 5 && seen.size < 50) {
    const sm = queue.shift();
    if (seen.has(sm) || !onSite(sm)) continue;
    seen.add(sm);
    const res = await get(sm);
    if (res.status !== 200) continue;
    const locs = [...res.body.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((m) => decode(m[1]));
    if (/<sitemapindex/i.test(res.body)) queue.push(...locs);
    else {
      urls.push(...locs);
      for (const u of res.body.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
        const loc = u[1].match(/<loc>\s*([\s\S]*?)\s*<\/loc>/i);
        const mod = u[1].match(/<lastmod>\s*([\s\S]*?)\s*<\/lastmod>/i);
        if (loc && mod) lastmod.set(norm(decode(loc[1])), isoDay(decode(mod[1])));
      }
    }
  }
  return { urls, lastmod, read: [...seen] };
}

const norm = (u) => {
  try {
    const x = new URL(u);
    x.hash = "";
    return x.href;
  } catch {
    return u;
  }
};

// A cell a spreadsheet would run as a formula (a page's title can start with
// "=") gets a leading apostrophe, so it opens as text.
const csvCell = (v) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

async function main() {
  const opt = args(process.argv.slice(2));
  if (!opt.start) {
    console.error("Usage: node crawl.mjs https://example.com [--max 200] [--delay 500] [--out seo/crawl.csv]");
    process.exit(1);
  }
  const start = new URL(opt.start);
  SITE = bare(start.host);
  // The host the site answers on (example.com may redirect to www.), whose
  // links are the internal ones.
  const landed = await get(start.href);
  const host = onSite(landed.finalUrl) ? new URL(landed.finalUrl).host : start.host;

  const robotsRes = await get(new URL("/robots.txt", start).href);
  const robots = parseRobots(robotsRes.status === 200 ? robotsRes.body : "");
  const sm = await sitemapUrls(start, robots.sitemaps, opt.max);
  const inSitemap = new Set(sm.urls.map(norm));

  // Each URL once: the home page is usually in the sitemap too, and a page
  // fetched twice would count its links twice.
  const queue = [...new Set([norm(start.href), ...sm.urls.map(norm).filter((u) => onSite(u) && new URL(u).host === host)])];
  const queued = new Set(queue);
  const pages = new Map();
  const inlinks = new Map();
  const contentInlinks = new Map();
  const linkedFrom = new Map();

  while (queue.length && pages.size < opt.max) {
    const url = queue.shift();
    const path = new URL(url).pathname + new URL(url).search;
    if (!allowed(robots, "seo-geo-skills-crawler", path).allowed) {
      pages.set(url, { url, status: "blocked by robots.txt" });
      continue;
    }
    const res = await get(url);
    const row = {
      url,
      status: res.status || res.error,
      finalUrl: res.finalUrl,
      xRobots: res.headers.get("x-robots-tag") || "",
      inSitemap: inSitemap.has(url),
      lastmod: sm.lastmod.get(url) || "",
    };
    if (res.status === 200 && /html/.test(res.type)) {
      Object.assign(row, readPage(res.body, res.finalUrl, host));
      for (const l of row.contentLinks) {
        if (l !== url) contentInlinks.set(l, (contentInlinks.get(l) || 0) + 1);
      }
      for (const l of row.links) {
        if (l === url) continue;
        inlinks.set(l, (inlinks.get(l) || 0) + 1);
        if (!linkedFrom.has(l)) linkedFrom.set(l, []);
        linkedFrom.get(l).push(url);
        const clean = new URL(l);
        if (!queued.has(l) && !clean.search && !/\.(pdf|jpe?g|png|gif|webp|svg|zip|mp4|xml)$/i.test(clean.pathname)) {
          queued.add(l);
          queue.push(l);
        }
      }
    }
    pages.set(url, row);
    await sleep(opt.delay);
  }

  const rows = [...pages.values()];
  for (const r of rows) {
    r.inlinks = inlinks.get(r.url) || 0;
    r.contentInlinks = contentInlinks.get(r.url) || 0;
    r.linkedFrom = linkedFrom.get(r.url) || [];
  }

  const header = [
    "url", "status", "final_url", "in_sitemap", "title", "title_length", "description_length",
    "h1_count", "h1", "canonical", "robots", "x_robots_tag", "words_raw_html", "words_in_content", "links_out", "links_in",
    "links_in_content", "content_area", "schema_types", "sitemap_lastmod", "json_ld_date_modified", "visible_date",
    "linked_from",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.url, r.status, r.finalUrl, r.inSitemap, r.title, r.title?.length ?? "", r.description?.length ?? "",
        r.h1s?.length ?? "", r.h1s?.[0] ?? "", r.canonical, r.robots, r.xRobots, r.words ?? "", r.contentWords ?? "",
        r.links?.length ?? "", r.inlinks, r.title !== undefined ? r.contentInlinks : "", r.contentArea ?? "",
        (r.schemaTypes || []).join(" "), r.lastmod ?? "", r.dateModified ?? "", r.visibleDate ?? "",
        // Only for a URL that isn't a clean 200: the pages whose link to fix.
        r.status !== 200 ? r.linkedFrom.join(" ") : "",
      ]
        .map(csvCell)
        .join(","),
    );
  }
  mkdirSync(dirname(opt.out), { recursive: true });
  writeFileSync(opt.out, lines.join("\n") + "\n");

  const html = rows.filter((r) => r.title !== undefined);
  const home = norm(start.href);
  const list = (label, items, show = (r) => r.url) => {
    if (!items.length) return;
    console.log(`\n**${label}** (${items.length})`);
    for (const r of items.slice(0, 15)) console.log(`- ${show(r)}`);
    if (items.length > 15) console.log(`- … ${items.length - 15} more in ${opt.out}`);
  };
  const titles = new Map();
  for (const r of html) if (r.title) titles.set(r.title, [...(titles.get(r.title) || []), r]);

  console.log(`# Crawl of ${host}, ${new Date().toISOString().slice(0, 10)}`);
  console.log(
    `\n${rows.length} URLs fetched (max ${opt.max}), ${html.length} HTML pages, ${sm.urls.length} URLs in ${sm.read.length} sitemap file(s). CSV: ${opt.out}`,
  );
  console.log(`\n## robots.txt (${robotsRes.status === 200 ? "found" : `status ${robotsRes.status}`})\n`);
  console.log("| Bot | Kind | For | Home page | Own rules |\n| - | - | - | - | - |");
  for (const [bot, kind, what] of BOTS) {
    const a = allowed(robots, bot, start.pathname || "/");
    const own = a.via ? `no, uses ${a.via}` : a.named ? "yes" : "no, uses *";
    console.log(`| ${bot} | ${kind} | ${what} | ${a.allowed ? "allowed" : "BLOCKED"} | ${own} |`);
  }
  if (groupsNaming(robots, TRAINING_TOKEN).length && !groupsNaming(robots, "google-extended").length) {
    console.log(
      `\n**Shared training opt-out, no Google-Extended group.** robots.txt has \`User-agent: ${TRAINING_TOKEN}\` and no \`User-agent: Google-Extended\`. From 2027 Google reads that opt-out as a Google-Extended block, which takes the site out of the Gemini app's answers (AI Overviews and AI Mode aren't affected). To stay in them, add \`User-agent: Google-Extended\` with \`Allow: /\`. That also allows Gemini training: the owner's call.`,
    );
  }
  console.log(
    "\nrobots.txt is only half: a firewall or bot-protection setting can still answer these bots with a 403 or a challenge. Check the host's bot settings (on Cloudflare, Training \"Block\" also stops Googlebot, Bingbot and Applebot), and the server logs with each bot verified by reverse DNS or its published IP ranges. Never test by fetching as a bot: the fetch lands in the logs as that bot and proves nothing about it.",
  );

  console.log("\n## Findings");
  const from = (r) => {
    if (!r.linkedFrom.length) return r.inSitemap ? "from the sitemap, no link in" : "no link in";
    const more = r.linkedFrom.length > 5 ? ` and ${r.linkedFrom.length - 5} more (linked_from in ${opt.out})` : "";
    return `linked from ${r.linkedFrom.slice(0, 5).join(", ")}${more}`;
  };
  list("Not a 200", rows.filter((r) => r.status !== 200), (r) => `${r.url} – ${r.status}, ${from(r)}`);
  list("Redirected", html.filter((r) => norm(r.finalUrl) !== r.url), (r) => `${r.url} → ${r.finalUrl}`);
  list("noindex", html.filter((r) => /noindex/i.test(`${r.robots} ${r.xRobots}`)), (r) => `${r.url} – ${r.robots || r.xRobots}`);
  list("nosnippet or max-snippet:0 (can't be quoted in AI answers)", html.filter((r) => /nosnippet|max-snippet\s*:\s*0/i.test(`${r.robots} ${r.xRobots}`)));
  list(
    "noarchive, nocache or ai-grounding:disallow (Bing keeps the page out of Copilot's answers or limits them: noarchive and nocache until 2027-03-01, ai-grounding from 2027-02-01)",
    html.filter((r) => /noarchive|nocache|ai-grounding\s*:\s*disallow/i.test(`${r.robots} ${r.xRobots}`)),
    (r) => `${r.url} – ${[r.robots, r.xRobots].filter(Boolean).join(", ")}`,
  );
  list("Canonical points elsewhere", html.filter((r) => r.canonical && norm(r.canonical) !== norm(r.finalUrl)), (r) => `${r.url} → ${r.canonical}`);
  list("No title", html.filter((r) => !r.title));
  list("Same title on several pages", [...titles.values()].filter((g) => g.length > 1), (g) => `"${g[0].title}" – ${g.length} pages`);
  list("No meta description", html.filter((r) => !r.description));
  list("No H1, or more than one", html.filter((r) => r.h1s.length !== 1), (r) => `${r.url} – ${r.h1s.length} H1`);
  list(
    "Under 150 words in the raw HTML (bots that run no JavaScript see little)",
    html.filter((r) => r.words < 150),
    (r) => `${r.url} – ${r.words} words`,
  );
  list(
    "Under 150 words in the page's <main> or <article>, though the whole page has more (a menu, header or footer fills the count)",
    html.filter((r) => r.words >= 150 && r.contentArea !== "body" && r.contentWords < 150),
    (r) => `${r.url} – ${r.contentWords} words in <${r.contentArea}>, ${r.words} on the page`,
  );
  list(
    "Dates disagree (sitemap lastmod, JSON-LD dateModified, the date on the page)",
    html.filter((r) => new Set([r.lastmod, r.dateModified, r.visibleDate].filter(Boolean)).size > 1),
    (r) => `${r.url} – lastmod ${r.lastmod || "none"}, dateModified ${r.dateModified || "none"}, on the page ${r.visibleDate || "none"}`,
  );
  list("In the sitemap, no internal link in (orphans)", html.filter((r) => r.inSitemap && r.inlinks === 0 && r.url !== home));
  list(
    "Fewer than 3 internal links in from page content (menus, header and footer left out; hubs, legal pages and About can live on menu links)",
    html.filter((r) => r.inlinks > 0 && r.contentInlinks < 3 && r.url !== home),
    (r) => `${r.url} – ${r.contentInlinks} from content, ${r.inlinks} in all`,
  );
  list("Linked but not in the sitemap", html.filter((r) => !r.inSitemap && r.url !== home));
  list(
    "In the sitemap but not a clean 200 page",
    rows.filter((r) => r.inSitemap && (r.status !== 200 || (r.finalUrl && norm(r.finalUrl) !== r.url))),
    (r) => `${r.url} – ${r.status}`,
  );
  const types = new Set(html.flatMap((r) => r.schemaTypes));
  console.log(`\n**Structured data types seen:** ${types.size ? [...types].join(", ") : "none"}`);
  if (pages.size >= opt.max) {
    console.log(
      `\nStopped at --max ${opt.max}: the site has more pages than were crawled, so the links-in counts are partial. Run again with a higher --max before calling a page an orphan.`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
