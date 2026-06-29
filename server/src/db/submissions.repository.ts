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
const byIdStmt    = db.prepare('SELECT * FROM submissions WHERE id = ?');
const allStmt     = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC');
const recentStmt  = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC LIMIT ?');
const totalStmt   = db.prepare('SELECT COUNT(*) as count FROM submissions');
const sinceDateStmt = db.prepare(
  'SELECT COUNT(*) as count FROM submissions WHERE created_at >= ?',
);
const topicCountsStmt = db.prepare(
  'SELECT topic, COUNT(*) as count FROM submissions GROUP BY topic ORDER BY count DESC',
);
const dailyCountsStmt = db.prepare(
  `SELECT DATE(created_at) as date, COUNT(*) as count
   FROM submissions
   WHERE DATE(created_at) >= DATE('now', '-29 days')
   GROUP BY DATE(created_at)`,
);
const byDowStmt = db.prepare(
  `SELECT CAST(strftime('%w', created_at) AS INTEGER) as dow, COUNT(*) as count
   FROM submissions GROUP BY dow`,
);
const byHourStmt = db.prepare(
  `SELECT CAST(strftime('%H', created_at) AS INTEGER) as hour, COUNT(*) as count
   FROM submissions GROUP BY hour`,
);
const earliestStmt = db.prepare('SELECT MIN(created_at) as earliest FROM submissions');

export const submissionsRepo = {
  create(input: NewSubmission): Submission {
    const info = insertStmt.run(input);
    return byIdStmt.get(info.lastInsertRowid) as Submission;
  },

  findAll(): Submission[] {
    return allStmt.all() as Submission[];
  },

  recent(limit: number): Submission[] {
    return recentStmt.all(limit) as Submission[];
  },

  total(): number {
    return (totalStmt.get() as { count: number }).count;
  },

  countSince(isoDateTime: string): number {
    return (sinceDateStmt.get(isoDateTime) as { count: number }).count;
  },

  topicCounts(): { topic: string; count: number }[] {
    return topicCountsStmt.all() as { topic: string; count: number }[];
  },

  dailyCounts(): { date: string; count: number }[] {
    return dailyCountsStmt.all() as { date: string; count: number }[];
  },

  byDow(): { dow: number; count: number }[] {
    return byDowStmt.all() as { dow: number; count: number }[];
  },

  byHour(): { hour: number; count: number }[] {
    return byHourStmt.all() as { hour: number; count: number }[];
  },

  earliest(): string | null {
    return (earliestStmt.get() as { earliest: string | null }).earliest;
  },
};
