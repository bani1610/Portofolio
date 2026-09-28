'use server';

import { headers } from 'next/headers';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';
import { createPublicClient } from '@/lib/supabase/public';
import { checkRateLimit } from '@/lib/utils/rate-limit';

/** Five messages an hour from one address: generous for a person, tedious
 *  for a script (PRD 17). */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

/**
 * Best-effort client address.
 *
 * x-forwarded-for is client-supplied and therefore spoofable in general,
 * but on Vercel the proxy appends the real address as the last entry, so
 * that is the one taken. Falling back to a shared bucket when no header is
 * present is deliberate: it throttles rather than waving the request
 * through.
 */
async function clientKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    const last = parts[parts.length - 1]?.trim();
    if (last) return last;
  }
  return headerList.get('x-real-ip')?.trim() || 'unknown';
}

export type ContactActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitContactMessage(
  data: ContactFormData
): Promise<ContactActionResult> {
  const result = contactFormSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: 'Mohon periksa kembali form isian Anda.',
      errors: fieldErrors as Record<string, string[]>,
    };
  }

  // Honeypot check (bot prevention)
  if (result.data.hp && result.data.hp.length > 0) {
    return {
      success: false,
      message: 'Pengiriman pesan ditolak.',
    };
  }

  // Checked after validation so a malformed flood cannot burn a real
  // visitor's allowance, and before the insert so it actually saves work.
  const limit = checkRateLimit(
    `contact:${await clientKey()}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );

  if (!limit.allowed) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfter / 60));
    return {
      success: false,
      message: `Terlalu banyak pesan terkirim. Silakan coba lagi dalam ${minutes} menit.`,
    };
  }

  try {
    const supabase = createPublicClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject || null,
      message: result.data.message,
    });

    if (error) {
      console.error('Supabase error saving contact message:', error);
      return {
        success: false,
        message: 'Gagal mengirim pesan. Silakan coba kembali nanti.',
      };
    }

    return {
      success: true,
      message: 'Pesan Anda berhasil dikirim! Saya akan segera merespons melalui email Anda.',
    };
  } catch (err) {
    console.error('Unexpected error in submitContactMessage:', err);
    return {
      success: false,
      message: 'Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.',
    };
  }
}
