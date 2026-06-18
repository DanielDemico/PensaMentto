import { EmotionRecord } from '@/types/emotion';
import { useMemo } from 'react';

interface Props {
  records: EmotionRecord[];
}

const DailyStreakCard = ({ records }: Props) => {
  const streak = useMemo(() => {
    if (!records || records.length === 0) return 0;

    // Get unique dates (ignoring time)
    const uniqueDates = Array.from(
      new Set(
        records.map((r) => {
          const d = new Date(r.createdAt);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        })
      )
    ).sort((a, b) => b - a); // Sort descending

    if (uniqueDates.length === 0) return 0;

    // To check if the streak includes today, compare with today's date
    const today = new Date();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    // Allow yesterday to keep the streak alive if today's entry hasn't been made yet
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();

    let currentStreak = 0;
    let expectedNextTime = uniqueDates[0];

    // If the most recent entry is older than yesterday, streak is broken
    if (uniqueDates[0] < yesterdayTime) {
      return 0;
    }

    for (let i = 0; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === expectedNextTime) {
        currentStreak++;
        // Expected next date is one day before the current valid date in the streak
        const prev = new Date(expectedNextTime);
        prev.setDate(prev.getDate() - 1);
        expectedNextTime = prev.getTime();
      } else {
        break; // Streak broken
      }
    }

    return currentStreak;
  }, [records]);

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-center items-center h-full transform transition-transform hover:scale-[1.02]">
      <div className="text-4xl mb-2">🔥</div>
      <h2 className="text-lg font-medium opacity-90 mb-1">Ofensiva Atual</h2>
      <div className="flex items-baseline space-x-1">
        <span className="text-5xl font-extrabold tracking-tight">{streak}</span>
        <span className="text-xl opacity-80">dias</span>
      </div>
      <p className="mt-3 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
        {streak > 0 ? "Continue assim!" : "Comece sua ofensiva hoje!"}
      </p>
    </div>
  );
};

export default DailyStreakCard;