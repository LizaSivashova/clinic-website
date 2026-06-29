// vi.mock must be declared before any imports — Vitest hoists it automatically,
// replacing the real mailer across all modules that import it during this test run.
import { vi, describe, it, expect, beforeAll, afterEach } from 'vitest';

vi.mock('../src/email/mailer', () => ({
  sendSubmissionEmail: vi.fn().mockResolvedValue({ sent: true }),
}));

import request from 'supertest';
import { createApp } from '../src/app';
import { TEST_USER, TEST_PASSWORD } from './setup';
import { settingsRepo } from '../src/db/settings.repository';
import { sendSubmissionEmail } from '../src/email/mailer';

const app = createApp();

async function getToken(): Promise<string> {
  const res = await request(app)
    .post('/api/admin/login')
    .send({ username: TEST_USER, password: TEST_PASSWORD });
  return res.body.accessToken as string;
}

describe('GET /api/admin/settings', () => {
  it('returns notification_email and email_notifications_enabled', async () => {
    const token = await getToken();
    const res = await request(app)
      .get('/api/admin/settings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(typeof res.body.settings.notification_email).toBe('string');
    expect(typeof res.body.settings.email_notifications_enabled).toBe('boolean');
  });
});

describe('PUT /api/admin/settings → notification_email', () => {
  afterEach(() => vi.clearAllMocks());

  it('updates notification_email and persists it to the database', async () => {
    const token = await getToken();
    const newEmail = 'new-recipient@test.com';

    const putRes = await request(app)
      .put('/api/admin/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({ notification_email: newEmail });
    expect(putRes.status).toBe(200);
    expect(putRes.body.ok).toBe(true);

    // Confirm it's saved in the database directly
    expect(settingsRepo.get('notification_email')).toBe(newEmail);

    // Confirm the GET endpoint also reflects the new value
    const getRes = await request(app)
      .get('/api/admin/settings')
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.body.settings.notification_email).toBe(newEmail);
  });

  it('contact submission triggers sendSubmissionEmail when notifications are on', async () => {
    const token = await getToken();

    // Enable email notifications
    await request(app)
      .put('/api/admin/settings')
      .set('Authorization', `Bearer ${token}`)
      .send({ email_notifications_enabled: true });

    // Submit a contact form
    const contactRes = await request(app).post('/api/contact').send({
      name: 'בדיקת מייל',
      phone: '0501234567',
      email: 'client@test.com',
      topic: 'חרדה ולחץ',
      message: 'בדיקה',
    });
    expect(contactRes.status).toBe(201);

    // sendSubmissionEmail is fire-and-forget (void call) so it may not have run
    // yet when the 201 arrives. vi.waitFor polls until the assertion passes.
    await vi.waitFor(() => {
      expect(sendSubmissionEmail).toHaveBeenCalledOnce();
    }, { timeout: 1000 });

    // Verify the submission data passed to the mailer is correct
    const callArg = vi.mocked(sendSubmissionEmail).mock.calls[0]![0]!;
    expect(callArg.name).toBe('בדיקת מייל');
    expect(callArg.email).toBe('client@test.com');
  });
});
