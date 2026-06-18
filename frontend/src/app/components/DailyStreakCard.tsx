import { useEffect, useState } from 'react';

const DailyStreakCard = () => {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStreak() {
      try {
        const res = await fetch('/api/streak');
        if (res.ok) {
          const data = await res.json();
          setStreak(data.streak);
        } else {
          setStreak(0);
        }
      } catch (error) {
        console.error("Erro ao buscar ofensiva:", error);
        setStreak(0);
      }
    }
    fetchStreak();
  }, []);

  const displayStreak = streak ?? 0;

  return (
    <div className="journal-card justify-center items-center h-full transform transition-transform hover:scale-[1.02] text-[#4f4574]">
      <div className="text-4xl mb-2">📄​</div>
      <h2 className="text-lg font-bold mb-1">Ofensiva Atual</h2>
      <div className="flex items-baseline space-x-1">
        <span className="text-5xl font-extrabold tracking-tight">{streak === null ? '-' : displayStreak}</span>
        <span className="text-xl opacity-80">dias</span>
      </div>
      <p className="mt-3 text-sm font-medium bg-[#f2eefc] px-3 py-1 rounded-full">
        {displayStreak > 0 ? "Continue assim!" : "Comece sua ofensiva hoje!"}
      </p>
    </div>
  );
};

export default DailyStreakCard;