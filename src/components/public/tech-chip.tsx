import { cn } from '@/lib/utils';

type TechChipProps = {
  name: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export function TechChip({ name, active = false, onClick, className }: TechChipProps) {
  const isButton = typeof onClick === 'function';
  const Component = isButton ? 'button' : 'span';

  return (
    <Component
      type={isButton ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex h-6 items-center rounded-sm px-2 font-mono text-xs transition-colors',
        active
          ? 'bg-primary/15 text-primary border border-primary/30 font-medium'
          : 'bg-muted text-muted-foreground border-transparent',
        isButton && 'cursor-pointer hover:bg-muted/80 focus:outline-none focus:ring-1 focus:ring-ring',
        className
      )}
    >
      {name}
    </Component>
  );
}
