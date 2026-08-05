'use client';

import React from 'react';

interface AppStoreLinkProps {
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

const APP_STORE_URL = 'https://apps.apple.com/us/app/bouncinn/id6759291367';

export function AppStoreLink({ className, children, ariaLabel }: AppStoreLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === 'undefined') return;
    
    // Check if the user is browsing within the Instagram in-app browser
    const isInstagram = navigator.userAgent.toLowerCase().includes('instagram');
    
    if (isInstagram) {
      e.preventDefault();
      // Force Instagram to open the link in the device's external browser (Safari)
      window.location.href = `instagram://extbrowser/?url=${encodeURIComponent(APP_STORE_URL)}`;
    }
  };

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
