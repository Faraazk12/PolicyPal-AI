import { DB, GLOSSARY } from "../data/policyData";

const MAX_INPUT_LENGTH = 300;

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Score user input against each intent's keyword list for the active policy,
 * then fall back to the glossary, then to a "no match" response.
 *
 * Throws if `policyKey` doesn't exist in DB so callers can surface a
 * meaningful error instead of a silent crash deep in string interpolation.
 */
export function getResponse(input, policyKey) {
  const db = DB[policyKey];
  if (!db) {
    throw new Error(`Unknown policy type: "${policyKey}"`);
  }

  const clean = String(input || "")
    .slice(0, MAX_INPUT_LENGTH)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ");

  let best = null;
  let top = 0;

  for (const [intent, keywords] of Object.entries(db.kw)) {
    let score = 0;
    keywords.forEach((k) => {
      if (clean.includes(k)) score += k.length > 4 ? 2 : 1;
    });
    if (score > top) {
      top = score;
      best = intent;
    }
  }

  if (top > 0 && db.res[best]) {
    return { ...db.res[best], found: true };
  }

  for (const [term, definition] of Object.entries(GLOSSARY)) {
    if (clean.includes(term)) {
      return {
        a: `<strong>${term.charAt(0).toUpperCase() + term.slice(1)}</strong>: ${definition}`,
        sec: "Policy Glossary",
        ex: `Definition: "${term}"`,
        c: 80,
        found: true,
      };
    }
  }

  return {
    a: `I couldn't find a match in the <strong>${db.name}</strong>.<br>Try asking about: <em>coverage, exclusions, claim, premium, deductible, grace period</em>.`,
    sec: "N/A",
    ex: "No section matched.",
    c: 0,
    found: false,
  };
}

/**
 * Wraps glossary terms found in the raw sample policy text with a highlight
 * span (and a tooltip via title attr). Escapes HTML first so policy text
 * containing < or > can't break the markup.
 */
export function highlightPolicyText(rawText) {
  let html = rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  Object.keys(GLOSSARY).forEach((term) => {
    const re = new RegExp(`\\b(${escapeRegExp(term)})\\b`, "gi");
    html = html.replace(re, `<span class="hl" title="${GLOSSARY[term]}">$1</span>`);
  });
  return html.replace(/\n/g, "<br>");
}

/** Rough count of <span class='term'> usages, used for the "terms" stat. */
export function countTerms(html) {
  return (html.match(/class=['"]term['"]/g) || []).length;
}
