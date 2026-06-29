import { Router } from 'express';
import { contactRouter } from './contact.routes';
import { adminRouter } from './admin.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));
apiRouter.use('/contact', contactRouter);
apiRouter.use('/admin', adminRouter);
