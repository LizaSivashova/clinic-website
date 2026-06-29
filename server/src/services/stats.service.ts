import { submissionsRepo, type Submission } from '../db/submissions.repository';

const parse = (s: Submission) => new Date(`${s.created_at}Z`);

export const statsService = {
  compute() {
    const subs = submissionsRepo.findAll();
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = subs.length;
    const thisMonth = subs.filter((s) => parse(s) >= startOfMonth).length;
    const thisWeek = subs.filter((s) => parse(s) >= startOfWeek).length;

    const topicCounts: Record<string, number> = {};
    for (const s of subs) topicCounts[s.topic] = (topicCounts[s.topic] ?? 0) + 1;
    const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    const daily: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      daily.push({
        date: key,
        count: subs.filter((s) => parse(s).toISOString().slice(0, 10) === key).length,
      });
    }

    const byDayOfWeek = Array.from({ length: 7 }, () => 0);
    const byHour = Array.from({ length: 24 }, () => 0);
    for (const s of subs) {
      byDayOfWeek[parse(s).getDay()]! += 1;
      byHour[parse(s).getHours()]! += 1;
    }

    let avgPerWeek = 0;
    if (subs.length) {
      const earliest = subs.reduce<Date>((min, s) => (parse(s) < min ? parse(s) : min), parse(subs[0]!));
      const weeks = Math.max(1, (now.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 7));
      avgPerWeek = +(subs.length / weeks).toFixed(1);
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
      recent: subs.slice(0, 5),
    };
  },
};
