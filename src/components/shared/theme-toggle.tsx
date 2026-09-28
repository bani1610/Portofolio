'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from './theme-provider';
import type { Theme } from '@/lib/theme';

type Option = { value: Theme; label: string; icon: typeof Sun };

// Dark is the default (PRD §34), so it doubles as the fallback below.
const DARK: Option = { value: 'dark', label: 'Dark', icon: Moon };

const OPTIONS: Option[] = [
  { value: 'light', label: 'Light', icon: Sun },
  DARK,
  { value: 'system', label: 'System', icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  /**
   * The rendered icon depends on localStorage, which the server cannot
   * read: it always renders the dark default while the browser may hold
   * 'light' or 'system'. React compares the two during hydration and
   * reports a mismatch.
   *
   * suppressHydrationWarning does not help here, since it covers only the
   * element it sits on, not the subtree. So the server and the first
   * client render agree on the default, and the stored choice is applied
   * once mounted. ThemeScript has already set the actual colours before
   * paint, so nothing flashes while this settles.
   */
  // The one case this rule cannot express: "has hydration finished". The
  // value must differ between the server render and the mounted client,
  // and an effect running once after mount is how React reports that.
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const active = mounted
    ? (OPTIONS.find((option) => option.value === theme) ?? DARK)
    : DARK;
  const ActiveIcon = active.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          // The label states the current theme so a screen reader user
          // knows what is active, not just that a control exists
          // (DESIGN.md §10).
          aria-label={`Theme: ${active.label}. Change theme`}
        >
          <ActiveIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => setTheme(value)}
            data-active={mounted && theme === value}
            className="data-[active=true]:text-primary"
          >
            <Icon aria-hidden="true" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
