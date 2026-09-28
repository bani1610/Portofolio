import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { DataTable, type Column } from '@/components/admin/data-table';
import { TitleCell, StateCell, TextCell } from '@/components/admin/cells';
import { CardActions } from '@/components/admin/card-actions';
import { RowActions } from '@/components/admin/row-actions';
import { toggleCertificatePublished, deleteCertificate } from '@/lib/actions/entities';
import { formatMonthYear } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

export const instant = false;

type Row = Pick<
  Tables<'certificates'>,
  'id' | 'title' | 'issuer' | 'published' | 'issue_date' | 'credential_url' | 'certificate_file'
>;

const LABELS = { on: 'Terbit', off: 'Draft' };
const editHref = (item: Row) => `/admin/certificates/${item.id}/edit`;

const actions = (item: Row) => (
  <RowActions
    itemName={item.title}
    visible={item.published}
    toggleAction={toggleCertificatePublished.bind(null, item.id)}
    deleteAction={deleteCertificate.bind(null, item.id)}
  />
);

/**
 * "Kredensial" is here because a certificate with neither a verification
 * URL nor a file renders without a link on the public card: the admin can
 * see which entries are still missing one without opening each form.
 */
const hasCredential = (item: Row) =>
  Boolean(item.credential_url || item.certificate_file);

const columns: Column<Row>[] = [
  {
    header: 'Sertifikat',
    cell: (item) => (
      <TitleCell href={editHref(item)} title={item.title} secondary={item.issuer} />
    ),
  },
  {
    header: 'Terbit',
    width: '150px',
    hideOnTablet: true,
    cell: (item) => <TextCell>{formatMonthYear(item.issue_date)}</TextCell>,
  },
  {
    header: 'Kredensial',
    width: '140px',
    cell: (item) => (
      <StateCell on={hasCredential(item)} labels={{ on: 'Ada', off: 'Belum ada' }} />
    ),
  },
  {
    header: 'Status',
    width: '120px',
    cell: (item) => <StateCell on={item.published} labels={LABELS} />,
  },
];

export default async function AdminCertificatesPage() {
  const { supabase } = await requireAdmin();

  const { data: items } = await supabase
    .from('certificates')
    .select('id, title, issuer, published, issue_date, credential_url, certificate_file')
    .order('issue_date', { ascending: false, nullsFirst: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Certificates"
        description="Sertifikasi dan lisensi kompetensi."
        action={{ href: '/admin/certificates/new', label: 'Tambah Sertifikat' }}
      />

      {!items || items.length === 0 ? (
        <EmptyState
          title="Belum ada sertifikat"
          description="Sertifikat yang ditambahkan tampil sebagai kartu di halaman utama dan halaman /certificates."
          action={{ href: '/admin/certificates/new', label: 'Tambah Sertifikat' }}
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
                <TitleCell href={editHref(item)} title={item.title} secondary={item.issuer} />
                <StateCell on={item.published} labels={LABELS} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <TextCell>{formatMonthYear(item.issue_date)}</TextCell>
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
