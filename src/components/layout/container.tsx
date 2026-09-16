import { cn } from '@/lib/utils';

type ContainerProps = {
  /**
   * 'prose' narrows to 768px for text-heavy pages — project detail and
   * about — so lines stay readable (DESIGN.md §4.2).
   */
  width?: 'default' | 'prose';
  className?: string;
  children: React.ReactNode;
};

export function Container({ width = 'default', className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 md:px-6 lg:px-8',
        width === 'default' ? 'max-w-[1200px]' : 'max-w-[768px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
