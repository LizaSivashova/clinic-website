import { submissionsRepo } from '../db/submissions.repository';

export const statsService = {
  compute() {
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay());
    startOfWeek.setUTCHours(0, 0, 0, 0);
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const total      = submissionsRepo.total();
    const thisMonth  = submissionsRepo.countSince(startOfMonth.toISOString().slice(0, 10));
    const thisWeek   = submissionsRepo.countSince(startOfWeek.toISOString().slice(0, 10));

    const topicRows  = submissionsRepo.topicCounts();
    const topicCounts: Record<string, number> = Object.fromEntries(topicRows.map(r => [r.topic, r.count]));
    const topTopic   = topicRows[0]?.topic ?? '—';

    const dailyMap   = new Map(submissionsRepo.dailyCounts().map(r => [r.date, r.count]));
    const daily: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(now.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10);
      daily.push({ date: key, count: dailyMap.get(key) ?? 0 });
    }

    const byDayOfWeek = Array.from<number>({ length: 7 }).fill(0);
    for (const r of submissionsRepo.byDow()) byDayOfWeek[r.dow] = r.count;

    const byHour = Array.from<number>({ length: 24 }).fill(0);
    for (const r of submissionsRepo.byHour()) byHour[r.hour] = r.count;

    let avgPerWeek = 0;
    if (total > 0) {
      const earliestStr = submissionsRepo.earliest();
      if (earliestStr) {
        const earliest = new Date(`${earliestStr}Z`);
        const weeks = Math.max(1, (now.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 7));
        avgPerWeek = +(total / weeks).toFixed(1);
      }
    }

    return {
      total,
      thisMonth,
      thisWeek,
      topTopic,
      topicCounts,
      daily,
      byDayOfWeek,
      byHour,
      avgPerWeek,
      recent: submissionsRepo.recent(5),
    };
  },
};
