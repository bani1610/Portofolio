'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';
import { submitContactMessage } from '@/lib/actions/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function ContactForm() {
  const [serverStatus, setServerStatus] = React.useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    setServerStatus(null);
    try {
      const response = await submitContactMessage(data);
      setServerStatus(response);
      if (response.success) {
        reset();
      }
    } catch {
      setServerStatus({
        success: false,
        message: 'Terjadi kendala jaringan saat mengirim pesan.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Inline Success or Error Banner (DESIGN.md §7.8) */}
      {serverStatus && (
        <div
          role="status"
          className={cn(
            'flex items-start gap-3 rounded-lg p-4 text-sm leading-relaxed border',
            serverStatus.success
              ? 'border-primary/30 bg-primary/10 text-primary'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          )}
        >
          {serverStatus.success ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{serverStatus.message}</span>
        </div>
      )}

      {/* Honeypot field for bot protection */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp">Leave this empty</label>
        <input type="text" id="hp" tabIndex={-1} autoComplete="off" {...register('hp')} />
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Nama Lengkap <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Nama Anda"
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={cn('h-11', errors.name && 'border-destructive focus-visible:ring-destructive')}
          {...register('name')}
        />
        {errors.name && (
          <p id="name-error" className="text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-muted-foreground">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={cn('h-11', errors.email && 'border-destructive focus-visible:ring-destructive')}
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm text-muted-foreground">
          Subjek (Opsional)
        </Label>
        <Input
          id="subject"
          placeholder="Topik atau keperluan pesan"
          disabled={isSubmitting}
          className="h-11"
          {...register('subject')}
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm text-muted-foreground">
          Pesan <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tuliskan pesan atau penawaran Anda di sini..."
          disabled={isSubmitting}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={cn(
            'min-h-[140px] resize-y',
            errors.message && 'border-destructive focus-visible:ring-destructive'
          )}
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Mengirim Pesan...</span>
          </>
        ) : (
          <span>Kirim Pesan</span>
        )}
      </Button>
    </form>
  );
}
