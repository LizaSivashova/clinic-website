import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { TEST_USER, TEST_PASSWORD } from './setup';

const app = createApp();

describe('admin auth', () => {
  it('rejects wrong credentials with 401', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: TEST_USER, password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('unauthorized');
  });

  it('logs in, sets an httpOnly refresh cookie, returns an access token', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ username: TEST_USER, password: TEST_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    const cookie = res.headers['set-cookie']?.[0] ?? '';
    expect(cookie).toMatch(/rt=/);
    expect(cookie.toLowerCase()).toContain('httponly');
  });

  it('blocks protected routes without a token', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(401);
  });

  it('allows protected routes with a valid access token', async () => {
    const agent = request.agent(app);
    const login = await agent
      .post('/api/admin/login')
      .send({ username: TEST_USER, password: TEST_PASSWORD });
    const token = login.body.accessToken as string;

    const res = await agent.get('/api/admin/stats').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(typeof res.body.stats.total).toBe('number');
  });

  it('rotates the refresh cookie via /refresh', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send({ username: TEST_USER, password: TEST_PASSWORD });
    const res = await agent.post('/api/admin/refresh');
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
  });

  it('revokes the refresh token on logout', async () => {
    const agent = request.agent(app);
    await agent.post('/api/admin/login').send({ username: TEST_USER, password: TEST_PASSWORD });
    await agent.post('/api/admin/logout').expect(200);
    // After logout the (revoked) cookie can no longer refresh.
    const res = await agent.post('/api/admin/refresh');
    expect(res.status).toBe(401);
  });
});
