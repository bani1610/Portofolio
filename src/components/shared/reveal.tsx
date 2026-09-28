'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type RevealProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Fades a section in as it scrolls into view (DESIGN.md 9).
 *
 * IntersectionObserver rather than a scroll handler, and no animation
 * library: the whole effect is two CSS properties, and DESIGN.md 14 rules
 * out shipping a motion dependency for it.
 *
 * The observer disconnects after the first intersection — replaying the
 * reveal every time a section scrolls back past makes a long page feel
 * restless.
 *
 * Reduced motion is handled entirely in CSS (globals.css), where `.reveal`
 * resolves to the finished state. Nothing here needs to check the media
 * query, and an element is never left invisible if the observer never runs.
 */
export function Reveal({ className, children }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || revealed) return;

    // Without IntersectionObserver the element would sit at opacity 0
    // forever. Written straight to the DOM rather than through state on
    // purpose: the server cannot detect this, so deciding it in a state
    // initialiser would make the server and client disagree and break
    // hydration for everyone else.
    if (typeof IntersectionObserver === 'undefined') {
      element.dataset.revealed = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <div ref={ref} className={cn('reveal', className)} data-revealed={revealed}>
      {children}
    </div>
  );
}
