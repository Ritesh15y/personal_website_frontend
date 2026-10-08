import { useEffect } from 'react';

/**
 * Custom hook to update document title and meta description dynamically on page mount
 * @param {string} title Page title
 * @param {string} [description] Meta description
 */
export const useDocumentTitle = (title, description) => {
  useEffect(() => {
    if (title) {
      document.title = title.includes('Prema Design Studio')
        ? title
        : `${title} | Prema Design Studio`;
    }
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);
};

export default useDocumentTitle;
