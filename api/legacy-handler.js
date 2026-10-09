// Vercel Serverless Function to handle legacy/deleted URLs
// Returns HTTP 410 Gone for permanently deleted AI-generated blog posts and removed portfolio projects.
// Supports both Node.js (req, res) and Web Standard (Request, Response) environments.

const DELETED_BLOG_SLUGS = new Set([
  'revit-vs-autocad-mastery',
  'top-10-autocad-commands-architects',
  'bim-level-2-clash-detection-guide',
  'photorealistic-vray-exterior-lighting',
  'parametric-revit-family-creation-lod-standards',
  'structural-bim-modeling-revit-rcc-steel',
  'architectural-working-drawings-approval-checklist',
  'why-bim-revit-training-essential-engineers',
  'interior-design-renders-3ds-max-vray',
  'navisworks-clash-resolution-mep-architecture',
  '3d-architectural-walkthroughs-real-estate',
  'structural-rebar-detailing-scheduling-revit',
  'autocad-layering-standards-aia-templates',
  'how-to-choose-bim-outsourcing-partner-india',
  'future-of-ai-in-architecture-and-3d-visualization'
]);

const DELETED_PROJECT_SLUGS = new Set([
  'corporate-office-tower',
  'international-school-campus',
  'multi-specialty-hospital',
  'luxury-apartment-interior'
]);

// If any legacy slug has a genuine 1:1 replacement, map it here for a 301 redirect
const REDIRECT_MAP = {
  // Empty by default: all deleted AI blogs and fake projects are permanently removed without 1:1 replacements
};

function generate410Html(itemType, slug) {
  const formattedTitle = slug
    ? slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>410 Gone — ${itemType} Permanently Removed | Prema Design Studio</title>
  <style>
    :root {
      --bg: #0a0a0a;
      --card-bg: #141414;
      --gold: #d4af37;
      --text: #f5f5f5;
      --muted: #a0a0a0;
      --border: rgba(212, 175, 55, 0.25);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .container {
      max-width: 580px;
      width: 100%;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 48px 36px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .badge {
      display: inline-block;
      color: var(--gold);
      border: 1px solid var(--border);
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 0.75rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    h1 {
      color: var(--gold);
      font-size: 1.75rem;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .target-title {
      color: #fff;
      font-size: 1.1rem;
      font-style: italic;
      margin-bottom: 16px;
      opacity: 0.9;
    }
    p {
      color: var(--muted);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 12px;
    }
    .actions {
      margin-top: 32px;
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    a.btn {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    a.btn-primary {
      background: var(--gold);
      color: #0a0a0a;
    }
    a.btn-outline {
      background: transparent;
      color: var(--gold);
      border: 1px solid var(--gold);
    }
    a.btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">HTTP 410 · GONE</div>
    <h1>${itemType} Permanently Removed</h1>
    ${formattedTitle ? `<div class="target-title">"${formattedTitle}"</div>` : ''}
    <p>This ${itemType.toLowerCase()} has been permanently removed as part of our studio content authenticity and integrity cleanup.</p>
    <p>The resource is no longer hosted and will not be restored. Search engine crawlers have been instructed to permanently remove this URL from search indexes.</p>
    <div class="actions">
      <a href="/" class="btn btn-primary">Return Home</a>
      <a href="/services" class="btn btn-outline">Explore Services</a>
    </div>
  </div>
</body>
</html>`;
}

export default function handler(req, res) {
  // Support both standard Node.js (req, res) and Web Standard (Request)
  const isWebStandard = typeof req?.text === 'function' && !res;
  const urlStr = isWebStandard ? req.url : (req.url || '');
  const url = new URL(urlStr, 'https://www.premadesignstudio.in');

  // Extract slug from search params or pathname
  let slug = url.searchParams.get('slug') || '';
  const type = url.searchParams.get('type') || '';

  if (!slug) {
    const pathSegments = url.pathname.split('/').filter(Boolean);
    slug = pathSegments[pathSegments.length - 1] || '';
  }

  // Clean slug of query characters if any
  slug = slug.split('?')[0];

  // 1. Check for intentional 301 redirects
  if (REDIRECT_MAP[slug]) {
    const dest = REDIRECT_MAP[slug];
    if (isWebStandard) {
      return Response.redirect(new URL(dest, url.origin), 301);
    }
    res.setHeader('Location', dest);
    return res.status(301).end();
  }

  // 2. Identify resource type (Project vs Blog Article)
  const isProject =
    type === 'project' ||
    url.pathname.startsWith('/portfolio/') ||
    DELETED_PROJECT_SLUGS.has(slug);

  const itemType = isProject ? 'Project' : 'Article';
  const html = generate410Html(itemType, slug);

  if (isWebStandard) {
    return new Response(html, {
      status: 410,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  return res.status(410).send(html);
}
