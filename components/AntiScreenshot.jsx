// components/AntiScreenshot.js

'use client'

import { useEffect } from 'react';

export function AntiScreenshot({ children }) {
  useEffect(() => {
    const preventScreenshot = (e) => {
      e.preventDefault();
      alert('Screenshots are not allowed for security reasons.');
    };

    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        preventScreenshot(e);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'p') {
        preventScreenshot(e);
      }
    });

    return () => {
      document.removeEventListener('keyup', preventScreenshot);
      document.removeEventListener('keydown', preventScreenshot);
    };
  }, []);

  return (
    <div style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {children}
    </div>
  );
}