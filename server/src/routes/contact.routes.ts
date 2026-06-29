import { Router } from 'express';
import { contactService } from '../services/contact.service';
import { validateBody } from '../middleware/validate';
import { contactLimiter } from '../middleware/rateLimit';
import { contactSchema } from '../schemas';

export const contactRouter = Router();

// POST /api/contact — public contact form.
contactRouter.post('/', contactLimiter, validateBody(contactSchema), (req, res) => {
  contactService.submit(req.body);
  res.status(201).json({ ok: true });
});
