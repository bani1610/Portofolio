'use client';

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
  const active = OPTIONS.find((option) => option.value === theme) ?? DARK;
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
            data-active={theme === value}
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
