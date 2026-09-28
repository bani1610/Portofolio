import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { DataTable, type Column } from '@/components/admin/data-table';
import { TitleCell, StateCell, TextCell } from '@/components/admin/cells';
import { CardActions } from '@/components/admin/card-actions';
import { RowActions } from '@/components/admin/row-actions';
import { toggleSocialLinkVisible, deleteSocialLink } from '@/lib/actions/entities';
import type { Tables } from '@/lib/supabase/types';

export const instant = false;

type Row = Pick<Tables<'social_links'>, 'id' | 'platform' | 'url' | 'visible'>;

const LABELS = { on: 'Tampil', off: 'Tersembunyi' };
const editHref = (item: Row) => `/admin/social-links/${item.id}/edit`;

const actions = (item: Row) => (
  <RowActions
    itemName={item.platform}
    visible={item.visible}
    labels={{ show: 'Tampilkan', hide: 'Sembunyikan' }}
    toggleAction={toggleSocialLinkVisible.bind(null, item.id)}
    deleteAction={deleteSocialLink.bind(null, item.id)}
  />
);

const columns: Column<Row>[] = [
  {
    header: 'Platform',
    width: '200px',
    cell: (item) => <TitleCell href={editHref(item)} title={item.platform} />,
  },
  {
    header: 'URL',
    cell: (item) => (
      // Opens the real destination, so a wrong link is caught here rather
      // than on the live site.
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-primary truncate font-mono text-xs transition-colors"
      >
        {item.url}
      </a>
    ),
  },
  {
    header: 'Tampilan',
    width: '140px',
    cell: (item) => <StateCell on={item.visible} labels={LABELS} />,
  },
];

export default async function AdminSocialLinksPage() {
  const { supabase } = await requireAdmin();

  const { data: items } = await supabase
    .from('social_links')
    .select('id, platform, url, visible')
    .order('display_order');

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Social Links"
        description="Tautan yang tampil di hero dan footer."
        action={{ href: '/admin/social-links/new', label: 'Tambah Tautan' }}
      />

      {!items || items.length === 0 ? (
        <EmptyState
          title="Belum ada tautan"
          description="Tautan yang ditambahkan tampil di bagian hero dan footer website publik."
          action={{ href: '/admin/social-links/new', label: 'Tambah Tautan' }}
        />
      ) : (
        <DataTable
          items={items}
          columns={columns}
          getKey={(item) => item.id}
          getEditHref={editHref}
          getLabel={(item) => item.platform}
          renderActions={actions}
          renderCard={(item) => (
            <>
              <div className="flex items-start justify-between gap-3">
                <TitleCell href={editHref(item)} title={item.platform} />
                <StateCell on={item.visible} labels={LABELS} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <TextCell>{item.url}</TextCell>
                <CardActions href={editHref(item)} label={item.platform}>
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
