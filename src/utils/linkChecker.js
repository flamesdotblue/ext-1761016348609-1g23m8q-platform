// Extract URLs from text (video descriptions from various platforms)
export function extractLinks(text) {
  if (!text) return [];
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>()\"'\]]+/gi;
  const raw = (text.match(urlRegex) || [])
    .map((u) => u.replace(/[\]\),.;:!?]+$/g, '')) // trim trailing punctuation
    .map((u) => (u.startsWith('www.') ? `https://${u}` : u));
  // De-duplicate while preserving order
  const seen = new Set();
  const unique = [];
  for (const u of raw) {
    const key = u.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(u);
    }
  }
  return unique;
}

// Attempt to resolve known platform redirectors to direct URLs (e.g., YouTube redirect links)
function normalizeRedirectors(url) {
  try {
    const u = new URL(url);
    // YouTube redirect wrapper
    if (u.hostname.includes('youtube.com') && (u.pathname.includes('/redirect') || u.pathname.includes('/redirect?'))) {
      const q = u.searchParams.get('q') || u.searchParams.get('url');
      if (q) return decodeURIComponent(q);
    }
    // TikTok track or redirect links
    if (u.hostname.includes('tiktok.com')) {
      const target = u.searchParams.get('u') || u.searchParams.get('target');
      if (target) return decodeURIComponent(target);
    }
    // Generic redirect params
    const possible = ['url', 'u', 'target', 'redirect', 'dest', 'destination'];
    for (const key of possible) {
      const v = u.searchParams.get(key);
      if (v && /^https?:/i.test(v)) return decodeURIComponent(v);
    }
  } catch (e) {
    // ignore parsing errors
  }
  return url;
}

// Check links via a reader that avoids CORS issues (Jina reader). We fetch the content through
// https://r.jina.ai/http://example.com which generally returns 200 if reachable.
export async function checkLinks(urls, onProgress) {
  const concurrency = 4;
  const queue = [...urls];
  const results = [];

  async function worker() {
    while (queue.length) {
      const original = queue.shift();
      const directUrl = normalizeRedirectors(original);
      const result = await checkSingle(original, directUrl);
      results.push(result);
      if (onProgress) onProgress(result);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function checkSingle(originalUrl, directUrl) {
  const target = directUrl || originalUrl;
  let status = 'unknown';
  let httpStatus;
  let finalUrl = target;
  let reason;

  try {
    // Use Jina reader as a proxy to bypass CORS and still infer reachability
    const readerUrl = `https://r.jina.ai/http://${target.replace(/^https?:\/\//i, '')}`;
    const res = await fetch(readerUrl, { method: 'GET' });
    httpStatus = res.status;

    if (res.ok) {
      // Heuristics for redirects: try a HEAD request via https://r.jina.ai/http:// may still return 200
      // So we infer redirect by checking if the original and normalized differ.
      if (directUrl !== originalUrl) {
        status = 'redirected';
        reason = 'Platform redirector normalized';
      } else {
        status = 'ok';
      }
    } else if (httpStatus >= 300 && httpStatus < 400) {
      status = 'redirected';
    } else if (httpStatus === 404) {
      status = 'broken';
      reason = 'Not found (404)';
    } else if (httpStatus === 410) {
      status = 'broken';
      reason = 'Gone (410)';
    } else if (httpStatus >= 500) {
      status = 'broken';
      reason = 'Server error';
    } else if (httpStatus === 0) {
      status = 'unknown';
      reason = 'Blocked by CORS or network';
    } else {
      status = 'unknown';
      reason = 'Unreachable';
    }
  } catch (e) {
    status = 'broken';
    reason = 'Network error';
  }

  return {
    url: originalUrl,
    directUrl: directUrl !== originalUrl ? directUrl : undefined,
    finalUrl,
    httpStatus,
    status,
    reason,
  };
}
