import DailyEmotionsChart from '@/app/components/DailyEmotionsChart';
import DailyStreakCard from '@/app/components/DailyStreakCard';
import EmotionsTimelineKeywordsCloud from '@/app/components/EmotionsTimelineKeywordsCloud';
import { EmotionRecord } from '@/types/emotion';
import Journal from '@/models/Journal';
import { connectDB } from '@/lib/mongodb';

export default async function DashboardPage() {
  await connectDB();
  const journals = await Journal.find().sort({ createdAt: -1 }).lean();
  
  const records: EmotionRecord[] = journals.map((j: any) => ({
    analise: {
      sentimento: j.analise?.sentimento || "NEUTRO",
      pontuation: j.analise?.pontuation || 50,
      key_words: j.analise?.key_words || [],
    },
    key_words: j.analise?.key_words || [],
    pontuation: j.analise?.pontuation || 50,
    sentimento: j.analise?.sentimento || "NEUTRO",
    createdAt: j.createdAt ? j.createdAt.toISOString() : new Date().toISOString(),
    tags: j.tags || [],
    text: j.text || ""
  }));
  return (
    <main className="p-8 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard de Emoções</h1>
          <p className="mt-2 text-gray-500 text-lg">Acompanhe seu humor, ofensiva de registros e principais tópicos.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 min-h-[350px]">
            <DailyEmotionsChart records={records} />
          </div>
          <div className="lg:col-span-1 min-h-[350px]">
            <DailyStreakCard records={records} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 items-stretch mt-6">
          <div className="w-full min-h-[400px]">
            <EmotionsTimelineKeywordsCloud records={records} />
          </div>
        </div>
      </div>
    </main>
  );
}
