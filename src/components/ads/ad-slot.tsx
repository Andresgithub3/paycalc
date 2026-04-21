'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

function AdSlotBase({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return;

    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle;
      adsbygoogle?.push({});
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdSlotInArticle({ className }: { className?: string }) {
  return <AdSlotBase slot="in-article" format="auto" className={className} />;
}

export function AdSlotSidebar({ className }: { className?: string }) {
  return <AdSlotBase slot="sidebar" format="rectangle" className={className} />;
}

export function AdSlotFooter({ className }: { className?: string }) {
  return <AdSlotBase slot="footer" format="horizontal" className={className} />;
}
