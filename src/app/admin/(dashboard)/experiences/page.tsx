import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { DataTable, type Column } from '@/components/admin/data-table';
import { TitleCell, StateCell, TextCell } from '@/components/admin/cells';
import { CardActions } from '@/components/admin/card-actions';
import { RowActions } from '@/components/admin/row-actions';
import { toggleExperiencePublished, deleteExperience } from '@/lib/actions/entities';
import { formatDateRange } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

export const instant = false;

type Row = Pick<
  Tables<'experiences'>,
  'id' | 'position' | 'company' | 'published' | 'featured' | 'start_date' | 'end_date' | 'current'
>;

const LABELS = { on: 'Terbit', off: 'Draft' };
const editHref = (item: Row) => `/admin/experiences/${item.id}/edit`;

const actions = (item: Row) => (
  <RowActions
    itemName={item.position}
    visible={item.published}
    toggleAction={toggleExperiencePublished.bind(null, item.id)}
    deleteAction={deleteExperience.bind(null, item.id)}
  />
);

const columns: Column<Row>[] = [
  {
    header: 'Posisi',
    cell: (item) => (
      <TitleCell
        href={editHref(item)}
        title={item.position}
        featured={item.featured}
        secondary={item.company}
      />
    ),
  },
  {
    header: 'Periode',
    width: '210px',
    hideOnTablet: true,
    cell: (item) => (
      <TextCell>{formatDateRange(item.start_date, item.end_date, item.current)}</TextCell>
    ),
  },
  {
    header: 'Status',
    width: '120px',
    cell: (item) => <StateCell on={item.published} labels={LABELS} />,
  },
];

export default async function AdminExperiencesPage() {
  const { supabase } = await requireAdmin();

  const { data: items } = await supabase
    .from('experiences')
    .select('id, position, company, published, featured, start_date, end_date, current')
    .order('start_date', { ascending: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Experiences"
        description="Riwayat pekerjaan dan magang, ditampilkan sebagai timeline."
        action={{ href: '/admin/experiences/new', label: 'Tambah Pengalaman' }}
      />

      {!items || items.length === 0 ? (
        <EmptyState
          title="Belum ada pengalaman"
          description="Pengalaman yang ditambahkan tampil sebagai timeline di halaman utama dan halaman /experience."
          action={{ href: '/admin/experiences/new', label: 'Tambah Pengalaman' }}
        />
      ) : (
        <DataTable
          items={items}
          columns={columns}
          getKey={(item) => item.id}
          getEditHref={editHref}
          getLabel={(item) => item.position}
          renderActions={actions}
          renderCard={(item) => (
            <>
              <div className="flex items-start justify-between gap-3">
                <TitleCell
                  href={editHref(item)}
                  title={item.position}
                  featured={item.featured}
                  secondary={item.company}
                />
                <StateCell on={item.published} labels={LABELS} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <TextCell>
                  {formatDateRange(item.start_date, item.end_date, item.current)}
                </TextCell>
                <CardActions href={editHref(item)} label={item.position}>
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
