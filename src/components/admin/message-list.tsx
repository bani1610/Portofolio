'use client';

import * as React from 'react';
import { Mail, MailOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DeleteDialog } from './delete-dialog';
import { markMessageRead, deleteMessage } from '@/lib/actions/singletons';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

type MessageListProps = {
  messages: Tables<'contact_messages'>[];
};

/**
 * The inbox (PRD 24): read, mark, delete. Nothing is authored here, so
 * there is no form.
 *
 * Each message renders in full rather than behind a "view" click: they are
 * short, and an extra navigation to read four lines is friction for no
 * gain.
 */
export function MessageList({ messages }: MessageListProps) {
  const [pending, startTransition] = React.useTransition();

  const toggleRead = (id: string, read: boolean) => {
    startTransition(async () => {
      const result = await markMessageRead(id, read);
      if (result.success) toast.success(result.message ?? 'Tersimpan.');
      else toast.error(result.message ?? 'Gagal menyimpan.');
    });
  };

  return (
    <ul className="space-y-3">
      {messages.map((message) => (
        <li
          key={message.id}
          className={cn(
            'border-border bg-card space-y-3 rounded-xl border p-4',
            // Unread carries a left edge AND the bold sender name, so the
            // state is not signalled by colour alone (DESIGN.md 13).
            !message.read && 'border-l-primary border-l-2',
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={cn(
                  'text-foreground text-sm',
                  !message.read && 'font-semibold',
                )}
              >
                {message.name}
                {!message.read && (
                  <span className="text-primary ml-2 font-mono text-[11px] uppercase">
                    Baru
                  </span>
                )}
              </p>
              <a
                href={`mailto:${message.email}`}
                className="text-muted-foreground hover:text-foreground font-mono text-xs"
              >
                {message.email}
              </a>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={pending}
                onClick={() => toggleRead(message.id, !message.read)}
                aria-label={
                  message.read
                    ? `Tandai pesan dari ${message.name} belum dibaca`
                    : `Tandai pesan dari ${message.name} sudah dibaca`
                }
                title={message.read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                className="text-muted-foreground hover:text-foreground"
              >
                {message.read ? (
                  <MailOpen className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Mail className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>

              <DeleteDialog
                itemName={`pesan dari ${message.name}`}
                onConfirm={() => deleteMessage(message.id)}
              />
            </div>
          </div>

          {message.subject && (
            <p className="text-foreground text-sm font-medium">{message.subject}</p>
          )}

          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {message.message}
          </p>

          <p className="text-muted-foreground font-mono text-[11px]">
            {formatDateTime(message.created_at)}
          </p>
        </li>
      ))}
    </ul>
  );
}
