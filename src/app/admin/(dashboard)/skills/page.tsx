import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { DataTable, type Column } from '@/components/admin/data-table';
import { TitleCell, StateCell, TagCell, TextCell } from '@/components/admin/cells';
import { CardActions } from '@/components/admin/card-actions';
import { RowActions } from '@/components/admin/row-actions';
import { toggleTechnologyVisible, deleteTechnology } from '@/lib/actions/entities';
import type { Tables } from '@/lib/supabase/types';

export const instant = false;

type Row = Pick<Tables<'technologies'>, 'id' | 'name' | 'category' | 'visible' | 'display_order'>;

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend & API',
  database: 'Database',
  tools: 'Tools & DevOps',
};

const LABELS = { on: 'Tampil', off: 'Tersembunyi' };

const editHref = (item: Row) => `/admin/skills/${item.id}/edit`;

const actions = (item: Row) => (
  <RowActions
    itemName={item.name}
    visible={item.visible}
    labels={{ show: 'Tampilkan', hide: 'Sembunyikan' }}
    toggleAction={toggleTechnologyVisible.bind(null, item.id)}
    deleteAction={deleteTechnology.bind(null, item.id)}
  />
);

// Category is what an admin scans this list for, so it earns a column.
// The sort number does not: it matters only while reordering, and the list
// is already shown in that order.
const columns: Column<Row>[] = [
  {
    header: 'Nama',
    cell: (item) => <TitleCell href={editHref(item)} title={item.name} />,
  },
  {
    header: 'Kategori',
    width: '200px',
    cell: (item) => <TagCell>{CATEGORY_LABELS[item.category] ?? item.category}</TagCell>,
  },
  {
    header: 'Di bagian Skills',
    width: '160px',
    cell: (item) => <StateCell on={item.visible} labels={LABELS} />,
  },
];

export default async function AdminSkillsPage() {
  const { supabase } = await requireAdmin();

  const { data: items } = await supabase
    .from('technologies')
    .select('id, name, category, visible, display_order')
    .order('category')
    .order('display_order');

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Skills & Tech"
        description="Satu daftar untuk dua keperluan: keahlian di bagian Skills, dan tag teknologi pada project."
        action={{ href: '/admin/skills/new', label: 'Tambah Teknologi' }}
      />

      {!items || items.length === 0 ? (
        <EmptyState
          title="Belum ada teknologi"
          description="Teknologi yang ditambahkan tampil di bagian Skills, dan bisa dipilih sebagai tag pada project."
          action={{ href: '/admin/skills/new', label: 'Tambah Teknologi' }}
        />
      ) : (
        <DataTable
          items={items}
          columns={columns}
          getKey={(item) => item.id}
          getEditHref={editHref}
          getLabel={(item) => item.name}
          renderActions={actions}
          renderCard={(item) => (
            <>
              <div className="flex items-start justify-between gap-3">
                <TitleCell href={editHref(item)} title={item.name} />
                <StateCell on={item.visible} labels={LABELS} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <TextCell>{CATEGORY_LABELS[item.category] ?? item.category}</TextCell>
                <CardActions href={editHref(item)} label={item.name}>
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
