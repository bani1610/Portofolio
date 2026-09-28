'use server';

import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';
import { createPublicClient } from '@/lib/supabase/public';

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
