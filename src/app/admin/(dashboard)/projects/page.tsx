import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { DataTable, type Column } from '@/components/admin/data-table';
import { TitleCell, StateCell, TagCell, TextCell } from '@/components/admin/cells';
import { CardActions } from '@/components/admin/card-actions';
import { ProjectRowActions } from '@/components/admin/project-row-actions';
import type { Tables } from '@/lib/supabase/types';

export const instant = false;

type Row = Pick<
  Tables<'projects'>,
  'id' | 'title' | 'slug' | 'category' | 'published' | 'featured'
>;

const CATEGORY_LABELS: Record<string, string> = {
  web: 'Web',
  ai: 'AI & ML',
  data: 'Data',
  other: 'Lainnya',
};

const LABELS = { on: 'Terbit', off: 'Draft' };
const editHref = (item: Row) => `/admin/projects/${item.id}/edit`;

const actions = (item: Row) => (
  <ProjectRowActions
    id={item.id}
    slug={item.slug}
    title={item.title}
    published={item.published}
    featured={item.featured}
  />
);

const columns: Column<Row>[] = [
  {
    header: 'Project',
    cell: (item) => (
      <TitleCell
        href={editHref(item)}
        title={item.title}
        featured={item.featured}
        secondary={`/projects/${item.slug}`}
      />
    ),
  },
  {
    header: 'Kategori',
    width: '140px',
    hideOnTablet: true,
    cell: (item) => <TagCell>{CATEGORY_LABELS[item.category] ?? item.category}</TagCell>,
  },
  {
    header: 'Status',
    width: '120px',
    cell: (item) => <StateCell on={item.published} labels={LABELS} />,
  },
];

export default async function AdminProjectsPage() {
  const { supabase } = await requireAdmin();

  const { data: items } = await supabase
    .from('projects')
    .select('id, title, slug, category, published, featured')
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects"
        description="Project yang tampil di halaman utama dan halaman /projects."
        action={{ href: '/admin/projects/new', label: 'Tambah Project' }}
      />

      {!items || items.length === 0 ? (
        <EmptyState
          title="Belum ada project"
          description="Project yang ditambahkan tampil setelah diterbitkan. Tandai sebagai unggulan agar muncul di halaman utama."
          action={{ href: '/admin/projects/new', label: 'Tambah Project' }}
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
                  featured={item.featured}
                  secondary={`/projects/${item.slug}`}
                />
                <StateCell on={item.published} labels={LABELS} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <TextCell>{CATEGORY_LABELS[item.category] ?? item.category}</TextCell>
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
