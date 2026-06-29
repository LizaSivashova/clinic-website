import { z } from 'zod';

export const TOPICS = [
  'חרדה ולחץ',
  'דיכאון ועצב',
  'הדרכת הורים',
  'טיפול זוגי',
  'נוער ומתבגרים',
  'אבל ואובדן',
  'אחר',
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'שם מלא נדרש').max(120),
  phone: z
    .string()
    .trim()
    .min(6, 'טלפון נדרש')
    .max(30)
    .regex(/^[0-9+\-\s()]+$/, 'מספר טלפון לא תקין'),
  email: z.string().trim().email('אימייל לא תקין').max(254),
  topic: z.enum(TOPICS, { errorMap: () => ({ message: 'נושא לא תקין' }) }),
  message: z.string().trim().min(1, 'הודעה נדרשת').max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const settingsSchema = z
  .object({
    notification_email: z.string().trim().email('אימייל לא תקין').or(z.literal('')).optional(),
    email_notifications_enabled: z.boolean().optional(),
    current_password: z.string().optional(),
    new_password: z.string().min(6, 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים').optional(),
  })
  .refine((d) => !d.new_password || !!d.current_password, {
    message: 'יש להזין את הסיסמה הנוכחית',
    path: ['current_password'],
  });
export type SettingsInput = z.infer<typeof settingsSchema>;
