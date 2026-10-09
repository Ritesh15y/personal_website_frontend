import { useEffect } from 'react';

/**
 * Custom hook to update document title, meta description, canonical URL, and robots meta tag dynamically on page mount
 * @param {string} title Page title
 * @param {string} [description] Meta description
 * @param {Object} [options] Additional SEO configuration options
 * @param {string} [options.canonical] Custom canonical URL override
 * @param {boolean} [options.noindex] Set true to apply noindex, nofollow
 */
export const useDocumentTitle = (title, description, options = {}) => {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = title.includes('Prema Design Studio')
        ? title
        : `${title} | Prema Design Studio`;
    }

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // 3. Update Canonical Tag Dynamically
    const pathname = window.location.pathname;
    const cleanPath = pathname === '/' ? '' : pathname.replace(/\/+$/, '');
    const canonicalHref =
      options.canonical || `https://www.premadesignstudio.in${cleanPath}`;

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalHref);

    // 4. Manage Meta Robots Directive
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (options.noindex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow, noarchive');
    } else {
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    }
  }, [title, description, options.canonical, options.noindex]);
};

export default useDocumentTitle;
