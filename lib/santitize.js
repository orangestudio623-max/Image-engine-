const LIMITS = { name: 24, location: 32, credits: 9, health: 12, energy: 12 };

function sanitize(raw = {}) {
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v !== "string") continue;
    const max = LIMITS[k] ?? 64;
    out[k] = v.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
  }
  return out;
}

module.exports = { sanitize };