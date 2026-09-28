import { z } from 'zod';

/**
 * Field helpers shared by the admin schemas.
 *
 * An HTML form submits "" for an untouched optional field, but the database
 * columns are nullable, not empty-string. Normalising here means every
 * action writes NULL for absent values rather than each form remembering to.
 */

/** Optional free text: "" becomes null. */
export const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))
  .nullable();

/** Optional URL: "" becomes null, anything else must parse. */
export const optionalUrl = z
  .union([z.literal(''), z.url({ message: 'URL tidak valid' })])
  .transform((value) => (value === '' ? null : value))
  .nullable();

/** Optional date column ('YYYY-MM-DD'): "" becomes null. */
export const optionalDate = z
  .union([
    z.literal(''),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Format tanggal tidak valid' }),
  ])
  .transform((value) => (value === '' ? null : value))
  .nullable();

/** Required date column. */
export const requiredDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Tanggal wajib diisi' });

/** Sort position; the column is NOT NULL DEFAULT 0. */
export const displayOrder = z.coerce
  .number()
  .int({ message: 'Urutan harus bilangan bulat' })
  .min(0, { message: 'Urutan tidak boleh negatif' })
  .default(0);

/**
 * A checkbox is absent from FormData when unchecked, so a plain boolean
 * would reject the "off" case instead of reading it as false.
 */
export const flag = z
  .union([z.boolean(), z.literal('on'), z.literal('true'), z.literal('false'), z.undefined()])
  .transform((value) => value === true || value === 'on' || value === 'true');
