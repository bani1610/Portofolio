import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Nama minimal 2 karakter' }).max(100),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  subject: z.string().max(150).optional(),
  message: z.string().min(10, { message: 'Pesan minimal 10 karakter' }).max(2000),
  // Honeypot field for bot protection (must be empty)
  hp: z.string().max(0, { message: 'Bot detected' }).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
