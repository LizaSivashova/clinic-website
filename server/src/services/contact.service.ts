import { submissionsRepo } from '../db/submissions.repository';
import { sendSubmissionEmail } from '../email/mailer';
import { logger } from '../utils/logger';
import type { ContactInput } from '../schemas';

export const contactService = {
  /** Persist a submission and fire off the notification email (best-effort). */
  submit(input: ContactInput) {
    const submission = submissionsRepo.create(input);
    // Don't block the response on email; log failures.
    void sendSubmissionEmail(submission).catch((err) =>
      logger.error({ err }, 'submission email failed'),
    );
    return submission;
  },
};
