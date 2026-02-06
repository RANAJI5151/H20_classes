import { useEffect } from 'react';

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    const fullTitle = `${title} | H2O Classes`;
    document.title = fullTitle;
    
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
}
