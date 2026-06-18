'use client';

import { EmotionRecord } from '@/types/emotion';
import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

const WordCloud = dynamic(() => import('react-d3-cloud'), { ssr: false });

interface Props {
  records?: EmotionRecord[];
}

const colors = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#6366f1'];

export default function EmotionsTimelineKeywordsCloud({ records = [] }: Props) {
  const [period, setPeriod] = useState<number>(7); // days

  const words = useMemo(() => {
    if (!records || records.length === 0) return [];

    const now = new Date().getTime();
    const filterTime = period === 0 ? 0 : now - period * 24 * 60 * 60 * 1000;

    // Filter by period
    const filtered = records.filter(r => new Date(r.createdAt).getTime() >= filterTime);

    // Aggregate key_words and tags
    const wordCounts: Record<string, number> = {};
    filtered.forEach(r => {
      const allWords = [...(r.key_words || []), ...(r.tags || [])];
      allWords.forEach(w => {
        if (!w) return;
        const word = w.toLowerCase().trim();
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });

    const entries = Object.entries(wordCounts);
    if (entries.length === 0) return [];

    // format for react-d3-cloud requires { text: string, value: number }
    return entries
      .map(([text, count]) => ({ text, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 30);
  }, [records, period]);

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm p-4 w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Nuvem de Palavras</h2>
          <p className="text-sm text-gray-500">Principais sentimentos e tópicos no período selecionado</p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none shadow-sm"
        >
          <option value={7}>Últimos 7 dias</option>
          <option value={15}>Últimos 15 dias</option>
          <option value={30}>Últimos 30 dias</option>
          <option value={0}>Todo o período</option>
        </select>
      </div>

      <div className="flex-1 w-full bg-gray-50/50 rounded-xl flex justify-center items-center p-3 min-h-[150px]">
        {words.length > 0 ? (
          <div style={{ width: '100%', height: '100%' }}>
            <WordCloud
              data={words}
              font="Inter, sans-serif"
              fontStyle="normal"
              fontWeight="bold"
              fontSize={(word) => Math.max(14, Math.min(60, 12 + word.value * 8))}
              spiral="archimedean"
              rotate={0}
              padding={2}
              fill={(d, i) => colors[i % colors.length]}
            />
          </div>
        ) : (
          <div className="text-gray-400">
            Nenhuma palavra encontrada neste período.
          </div>
        )}
      </div>
    </div>
  );
}