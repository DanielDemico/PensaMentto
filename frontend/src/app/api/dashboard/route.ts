import { NextResponse } from 'next/server';
import { listJournals } from '@/services/journal.service';
import { connectDB } from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        await connectDB();
        
        // Pega um limite maior para o dashboard poder calcular bem o histórico
        const url = new URL(request.url);
        const limitParam = url.searchParams.get('limit');
        const limit = limitParam ? parseInt(limitParam, 10) : 100;
        
        const journals = await listJournals(limit);
        
        return NextResponse.json(journals);
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}
