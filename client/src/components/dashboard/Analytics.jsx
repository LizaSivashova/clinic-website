import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import StatCard from './StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DAY_LABELS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export default function Analytics({ stats }) {
  if (!stats) return null;

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  const dowData = {
    labels: DAY_LABELS,
    datasets: [
      {
        data: stats.byDayOfWeek,
        backgroundColor: '#C17A50',
        borderRadius: 6,
      },
    ],
  };

  const hourData = {
    labels: Array.from({ length: 24 }, (_, h) => `${h}:00`),
    datasets: [
      {
        data: stats.byHour,
        backgroundColor: '#6B4226',
        borderRadius: 4,
      },
    ],
  };

  const peakHour = stats.byHour.indexOf(Math.max(...stats.byHour));
  const peakDay = stats.byDayOfWeek.indexOf(Math.max(...stats.byDayOfWeek));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="ממוצע פניות לשבוע" value={stats.avgPerWeek} />
        <StatCard label="היום הפעיל ביותר" value={stats.total ? DAY_LABELS[peakDay] : '—'} accent="bark" />
        <StatCard label="השעה הפעילה ביותר" value={stats.total ? `${peakHour}:00` : '—'} accent="green" />
      </div>

      <div className="rounded-2xl border border-cream-dark bg-white/80 p-5 shadow-soft">
        <h3 className="mb-1 font-bold text-bark">פניות לפי יום בשבוע</h3>
        <p className="mb-4 text-sm text-bark/55">מתי לקוחות פונים אליך</p>
        <div className="h-64">
          <Bar data={dowData} options={baseOpts} />
        </div>
      </div>

      <div className="rounded-2xl border border-cream-dark bg-white/80 p-5 shadow-soft">
        <h3 className="mb-1 font-bold text-bark">פניות לפי שעה ביום</h3>
        <p className="mb-4 text-sm text-bark/55">השעות שבהן פונים אליך הכי הרבה</p>
        <div className="h-64">
          <Bar data={hourData} options={baseOpts} />
        </div>
      </div>
    </div>
  );
}
