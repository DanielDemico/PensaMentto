'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmotionRecord } from '@/types/emotion';
import { useMemo } from 'react';

interface Props {
  records: EmotionRecord[];
}

const DailyEmotionsChart = ({ records }: Props) => {
  const data = useMemo(() => {
    if (!records || records.length === 0) return [];
    
    // Group records by day and calculate average pontuation
    const grouped: Record<string, { sum: number; count: number }> = {};
    
    records.forEach((record) => {
      const dateStr = new Date(record.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      if (!grouped[dateStr]) {
        grouped[dateStr] = { sum: 0, count: 0 };
      }
      grouped[dateStr].sum += record.pontuation;
      grouped[dateStr].count += 1;
    });

    // Sort by actual date ascending before formatting
    const sortedDates = [...records].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Re-construct the data array in sorted order
    const finalData: { date: string; pontuacao: number }[] = [];
    const seen = new Set<string>();
    
    sortedDates.forEach(record => {
      const dateStr = new Date(record.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      if (!seen.has(dateStr)) {
        seen.add(dateStr);
        finalData.push({
          date: dateStr,
          pontuacao: Math.round(grouped[dateStr].sum / grouped[dateStr].count)
        });
      }
    });

    return finalData;
  }, [records]);

  return (
    <div className="journal-card w-full h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#4f4574]">Variação de Humor</h2>
        <p className="text-sm text-[#4f4574] opacity-80">Média diária da sua pontuação de sentimento</p>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPontuacao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7a69b8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7a69b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4f4574', fontSize: 12, opacity: 0.8 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4f4574', fontSize: 12, opacity: 0.8 }} 
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#4f4574', marginBottom: '4px' }}
                itemStyle={{ color: '#7a69b8' }}
              />
              <Area 
                type="monotone" 
                dataKey="pontuacao" 
                stroke="#7a69b8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorPontuacao)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Dados insuficientes para gerar o gráfico.
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyEmotionsChart;