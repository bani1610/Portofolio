import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Column<T> = {
  /** Column heading. Name what the cell holds, never "Info". */
  header: string;
  /** Fixed width for narrow columns; the first column takes the rest. */
  width?: string;
  /** Hidden below lg, for detail that is not worth a cramped column. */
  hideOnTablet?: boolean;
  cell: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  items: T[];
  columns: Column<T>[];
  getKey: (item: T) => string;
  getEditHref: (item: T) => string;
  /** Title used in the edit link's accessible name. */
  getLabel: (item: T) => string;
  renderActions?: (item: T) => React.ReactNode;
  /** Card layout for narrow screens (DESIGN.md 8.3). */
  renderCard: (item: T) => React.ReactNode;
};

/**
 * Admin list, with columns supplied per entity.
 *
 * The previous version rendered the same three columns for every table:
 * Judul, Status, Info. "Info" is what a column is called when nobody
 * decided what belongs in it, and it ended up holding a raw sort number
 * for skills and a date for certificates. Columns now come from the
 * entity, because the field an admin scans for differs per entity.
 *
 * Table from 768px up, cards below: a table that scrolls sideways on a
 * phone is unusable (DESIGN.md 8.3).
 */
export function DataTable<T>({
  items,
  columns,
  getKey,
  getEditHref,
  getLabel,
  renderActions,
  renderCard,
}: DataTableProps<T>) {
  return (
    <>
      <div className="border-border hidden overflow-hidden rounded-xl border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-muted/30 border-b">
              {columns.map((column, index) => (
                <th
                  key={column.header}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  className={[
                    'text-muted-foreground px-4 py-2.5 text-left text-xs font-medium',
                    column.hideOnTablet ? 'hidden lg:table-cell' : '',
                    index === 0 ? 'w-auto' : '',
                  ].join(' ')}
                >
                  {column.header}
                </th>
              ))}
              <th scope="col" className="w-[120px] px-4 py-2.5">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={getKey(item)}
                className="border-border hover:bg-muted/30 border-b transition-colors last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={[
                      'px-4 py-3 align-middle',
                      column.hideOnTablet ? 'hidden lg:table-cell' : '',
                    ].join(' ')}
                  >
                    {column.cell(item)}
                  </td>
                ))}

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-0.5">
                    <Button asChild variant="ghost" size="icon-sm">
                      <Link
                        href={getEditHref(item)}
                        aria-label={`Ubah ${getLabel(item)}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    {renderActions?.(item)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-2 md:hidden">
        {items.map((item) => (
          <li
            key={getKey(item)}
            className="border-border bg-card rounded-xl border p-4"
          >
            {renderCard(item)}
          </li>
        ))}
      </ul>
    </>
  );
}
