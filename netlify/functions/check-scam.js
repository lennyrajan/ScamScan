// File: netlify/functions/check-scam.js

const fetch = require("node-fetch"); const cheerio = require("cheerio");

exports.handler = async function (event) { const query = event.queryStringParameters.message || ""; if (!query) { return { statusCode: 400, body: JSON.stringify({ error: "Message is required" }) }; }

try { const encodedQuery = encodeURIComponent(query); const searchUrl = https://html.duckduckgo.com/html?q=${encodedQuery};

const res = await fetch(searchUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0',
    'Content-Type': 'text/html'
  }
});

const html = await res.text();
const $ = cheerio.load(html);

const results = [];
$(".result__snippet").each((_, el) => {
  results.push($(el).text().toLowerCase());
});

const joined = results.join(" ");
const scamIndicators = [
  "scam",
  "fraud",
  "hoax",
  "fake",
  "phishing",
  "spam",
  "too good to be true",
  "warning",
  "report",
  "beware",
  "not real"
];

const hits = scamIndicators.filter(term => joined.includes(term));

let verdict = "Can't tell";
let reason = "Insufficient data to confirm scam.";

if (hits.length >= 2) {
  verdict = "Likely a Scam";
  reason = `Multiple scam-related terms found: ${hits.join(", ")}`;
} else if (hits.length === 1) {
  verdict = "Suspicious";
  reason = `Scam-related term found: ${hits[0]}`;
} else {
  verdict = "Likely Safe";
  reason = "No obvious scam indicators found in top results.";
}

return {
  statusCode: 200,
  body: JSON.stringify({
    verdict,
    reason,
    matched: hits
  })
};

} catch (err) { console.error(err); return { statusCode: 500, body: JSON.stringify({ error: "Failed to check scam status" }) }; } };

