"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DailyEmotionsChart from '@/app/components/DailyEmotionsChart';
import DailyStreakCard from '@/app/components/DailyStreakCard';
import EmotionsTimelineKeywordsCloud from '@/app/components/EmotionsTimelineKeywordsCloud';
import { EmotionRecord } from '@/types/emotion';

export default function DashboardPage() {
  const [records, setRecords] = useState<EmotionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error("Erro ao buscar dashboard");
        const data = await res.json();
        
        const mappedRecords: EmotionRecord[] = data.map((j: any) => ({
          analise: {
            sentimento: j.analise?.sentimento || "NEUTRO",
            pontuation: j.analise?.pontuation || 50,
            key_words: j.analise?.key_words || [],
          },
          key_words: j.analise?.key_words || [],
          pontuation: j.analise?.pontuation || 50,
          sentimento: j.analise?.sentimento || "NEUTRO",
          createdAt: j.createdAt ? j.createdAt : new Date().toISOString(),
          tags: j.tags || [],
          text: j.text || ""
        }));

        setRecords(mappedRecords);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="journal-page" style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <p className="text-[#4f4574] text-lg font-medium">Carregando dashboard...</p>
      </main>
    );
  }

  return (
    <main className="journal-page" style={{ height: 'auto', minHeight: '100vh', flexDirection: 'column', overflow: 'auto', gap: '1rem' }}>
      <div className="max-w-7xl mx-auto space-y-8 w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="journal-title" style={{ textAlign: 'left' }}>Dashboard de Emoções</h1>
            <p className="mt-2 text-[#4f4574] opacity-80 text-lg">Acompanhe seu humor, ofensiva de registros e principais tópicos.</p>
          </div>
          <button 
            className="cta-button"
            onClick={() => router.push('/journal')}
          >
            Tela inicial
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 min-h-[350px]">
            <DailyEmotionsChart records={records} />
          </div>
          <div className="lg:col-span-1 min-h-[350px]">
            <DailyStreakCard />
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
