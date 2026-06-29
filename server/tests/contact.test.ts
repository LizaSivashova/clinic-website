import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('POST /api/contact', () => {
  it('accepts a valid submission', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'דנה',
      phone: '050-1234567',
      email: 'dana@example.com',
      topic: 'חרדה ולחץ',
      message: 'אשמח לקבוע פגישה',
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });
  });

  it('rejects an invalid submission with field errors', async () => {
    const res = await request(app).post('/api/contact').send({
      name: '',
      phone: 'x',
      email: 'not-an-email',
      topic: 'unknown',
      message: '',
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('rejects missing name', async () => {
    const res = await request(app).post('/api/contact').send({
      name: '', phone: '0501234567', email: 'test@example.com',
      topic: 'חרדה ולחץ', message: 'שלום',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('שם מלא נדרש');
  });

  it('rejects phone with letters', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'דנה', phone: 'abcdef', email: 'dana@example.com',
      topic: 'חרדה ולחץ', message: 'שלום',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('מספר טלפון לא תקין');
  });

  it('rejects a badly formatted email', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'דנה', phone: '0501234567', email: 'notanemail',
      topic: 'חרדה ולחץ', message: 'שלום',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('אימייל לא תקין');
  });

  it('accepts message at exactly 4000 chars (boundary)', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'דנה', phone: '0501234567', email: 'dana@example.com',
      topic: 'אחר', message: 'א'.repeat(4000),
    });
    expect(res.status).toBe(201);
  });

  it('rejects message at 4001 chars', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'דנה', phone: '0501234567', email: 'dana@example.com',
      topic: 'אחר', message: 'א'.repeat(4001),
    });
    expect(res.status).toBe(400);
  });

  it('rejects a disallowed topic', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'דנה',
      phone: '0501234567',
      email: 'dana@example.com',
      topic: 'משהו אחר לגמרי',
      message: 'שלום',
    });
    expect(res.status).toBe(400);
  });
});
