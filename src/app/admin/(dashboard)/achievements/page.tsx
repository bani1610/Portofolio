import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { DataTable, type Column } from '@/components/admin/data-table';
import { TitleCell, StateCell, TextCell } from '@/components/admin/cells';
import { CardActions } from '@/components/admin/card-actions';
import { RowActions } from '@/components/admin/row-actions';
import { toggleAchievementPublished, deleteAchievement } from '@/lib/actions/entities';
import { formatMonthYear } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

export const instant = false;

type Row = Pick<
  Tables<'achievements'>,
  'id' | 'title' | 'organization' | 'published' | 'date'
>;

const LABELS = { on: 'Terbit', off: 'Draft' };
const editHref = (item: Row) => `/admin/achievements/${item.id}/edit`;

const actions = (item: Row) => (
  <RowActions
    itemName={item.title}
    visible={item.published}
    toggleAction={toggleAchievementPublished.bind(null, item.id)}
    deleteAction={deleteAchievement.bind(null, item.id)}
  />
);

const columns: Column<Row>[] = [
  {
    header: 'Pencapaian',
    cell: (item) => (
      <TitleCell href={editHref(item)} title={item.title} secondary={item.organization} />
    ),
  },
  {
    header: 'Tanggal',
    width: '150px',
    hideOnTablet: true,
    cell: (item) => <TextCell>{formatMonthYear(item.date)}</TextCell>,
  },
  {
    header: 'Status',
    width: '120px',
    cell: (item) => <StateCell on={item.published} labels={LABELS} />,
  },
];

export default async function AdminAchievementsPage() {
  const { supabase } = await requireAdmin();

  const { data: items } = await supabase
    .from('achievements')
    .select('id, title, organization, published, date')
    .order('display_order')
    .order('date', { ascending: false, nullsFirst: false });

  const publishedCount = (items ?? []).filter((item) => item.published).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Achievements"
        description={
          publishedCount === 1
            ? 'Bagian ini belum tampil di halaman utama: perlu minimal 2 pencapaian terbit.'
            : 'Penghargaan dan pencapaian di luar pekerjaan formal.'
        }
        action={{ href: '/admin/achievements/new', label: 'Tambah Pencapaian' }}
      />

      {!items || items.length === 0 ? (
        <EmptyState
          title="Belum ada pencapaian"
          description="Bagian Achievements di halaman utama muncul setelah ada minimal 2 pencapaian yang terbit."
          action={{ href: '/admin/achievements/new', label: 'Tambah Pencapaian' }}
        />
      ) : (
        <DataTable
          items={items}
          columns={columns}
          getKey={(item) => item.id}
          getEditHref={editHref}
          getLabel={(item) => item.title}
          renderActions={actions}
          renderCard={(item) => (
            <>
              <div className="flex items-start justify-between gap-3">
                <TitleCell
                  href={editHref(item)}
                  title={item.title}
                  secondary={item.organization}
                />
                <StateCell on={item.published} labels={LABELS} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <TextCell>{formatMonthYear(item.date)}</TextCell>
                <CardActions href={editHref(item)} label={item.title}>
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
