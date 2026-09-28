import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { MessageList } from '@/components/admin/message-list';

export const instant = false;

export default async function AdminMessagesPage() {
  const { supabase } = await requireAdmin();

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  const unread = (messages ?? []).filter((message) => !message.read).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages"
        description={
          unread > 0
            ? `${unread} pesan belum dibaca.`
            : 'Pesan yang masuk melalui form kontak.'
        }
      />

      {!messages || messages.length === 0 ? (
        <EmptyState
          title="Belum ada pesan"
          description="Pesan yang dikirim pengunjung lewat form kontak akan tampil di sini."
        />
      ) : (
        <MessageList messages={messages} />
      )}
    </div>
  );
}
