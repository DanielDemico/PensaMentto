import DailyEmotionsChart from '@/app/components/DailyEmotionsChart';
import DailyStreakCard from '@/app/components/DailyStreakCard';
import EmotionsTimelineBarChart from '@/app/components/EmotionsTimelineBarChart';

export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-4 text-gray-600">Welcome to your dashboard.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DailyEmotionsChart />
        <DailyStreakCard />
        <EmotionsTimelineBarChart />
      </div>
    </main>
  );
}
