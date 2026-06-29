import { db } from './database';

export interface Submission {
  id: number;
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  created_at: string;
}

export type NewSubmission = Omit<Submission, 'id' | 'created_at'>;

const insertStmt = db.prepare(
  `INSERT INTO submissions (name, phone, email, topic, message)
   VALUES (@name, @phone, @email, @topic, @message)`,
);
const byIdStmt = db.prepare('SELECT * FROM submissions WHERE id = ?');
const allStmt = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC');

export const submissionsRepo = {
  create(input: NewSubmission): Submission {
    const info = insertStmt.run(input);
    return byIdStmt.get(info.lastInsertRowid) as Submission;
  },

  findAll(): Submission[] {
    return allStmt.all() as Submission[];
  },
};
