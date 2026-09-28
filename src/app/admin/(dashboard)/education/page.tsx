import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { DataTable, type Column } from '@/components/admin/data-table';
import { TitleCell, StateCell, TextCell } from '@/components/admin/cells';
import { CardActions } from '@/components/admin/card-actions';
import { RowActions } from '@/components/admin/row-actions';
import { toggleEducationPublished, deleteEducation } from '@/lib/actions/entities';
import { formatDateRange } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

export const instant = false;

type Row = Pick<
  Tables<'education'>,
  'id' | 'institution' | 'degree' | 'field' | 'published' | 'start_date' | 'end_date'
>;

const LABELS = { on: 'Terbit', off: 'Draft' };
const editHref = (item: Row) => `/admin/education/${item.id}/edit`;

const degreeLine = (item: Row) =>
  [item.degree, item.field].filter(Boolean).join(' / ') || null;

const actions = (item: Row) => (
  <RowActions
    itemName={item.institution}
    visible={item.published}
    toggleAction={toggleEducationPublished.bind(null, item.id)}
    deleteAction={deleteEducation.bind(null, item.id)}
  />
);

const columns: Column<Row>[] = [
  {
    header: 'Institusi',
    cell: (item) => (
      <TitleCell
        href={editHref(item)}
        title={item.institution}
        secondary={degreeLine(item)}
      />
    ),
  },
  {
    header: 'Periode',
    width: '210px',
    hideOnTablet: true,
    cell: (item) => (
      <TextCell>{formatDateRange(item.start_date, item.end_date, false)}</TextCell>
    ),
  },
  {
    header: 'Status',
    width: '120px',
    cell: (item) => <StateCell on={item.published} labels={LABELS} />,
  },
];

export default async function AdminEducationPage() {
  const { supabase } = await requireAdmin();

  const { data: items } = await supabase
    .from('education')
    .select('id, institution, degree, field, published, start_date, end_date')
    .order('start_date', { ascending: false, nullsFirst: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Education"
        description="Riwayat pendidikan formal."
        action={{ href: '/admin/education/new', label: 'Tambah Pendidikan' }}
      />

      {!items || items.length === 0 ? (
        <EmptyState
          title="Belum ada riwayat pendidikan"
          description="Riwayat yang ditambahkan tampil di halaman utama dan halaman /education."
          action={{ href: '/admin/education/new', label: 'Tambah Pendidikan' }}
        />
      ) : (
        <DataTable
          items={items}
          columns={columns}
          getKey={(item) => item.id}
          getEditHref={editHref}
          getLabel={(item) => item.institution}
          renderActions={actions}
          renderCard={(item) => (
            <>
              <div className="flex items-start justify-between gap-3">
                <TitleCell
                  href={editHref(item)}
                  title={item.institution}
                  secondary={degreeLine(item)}
                />
                <StateCell on={item.published} labels={LABELS} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <TextCell>{formatDateRange(item.start_date, item.end_date, false)}</TextCell>
                <CardActions href={editHref(item)} label={item.institution}>
                  {actions(item)}
                </CardActions>
              </div>
            </>
          )}
        />
      )}
    </div>
  );
}
