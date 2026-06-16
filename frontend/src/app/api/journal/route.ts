import { connectDB } from "@/lib/mongodb";
import { JournalType } from "@/models/Journal";
import {
    saveJournal,
    listJournals
} from "@/services/journal.service";

// GET - Listar todos os diários com paginação
export async function GET(req: Request) {
    try {
        await connectDB();

        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const skip = parseInt(url.searchParams.get("skip") || "0");

        const result = await listJournals(limit, skip);
        return Response.json(result);
    } catch (error) {
        return Response.json(
            { error: error },
            { status: 500 }
        );
    }
}

// POST - Criar novo diário
export async function POST(req: Request) {
    try {
        await connectDB();

        // await porque devolve uma Promise
        const body = await req.json() as JournalType;

        //validar se existe texto
        if (!body.text?.trim()) {
            return Response.json(
                { error: "Texto obrigatório" },
                { status: 400 }
            );
        }

        // await porque é async
        const result = await saveJournal(body);
        return Response.json(result);
    } catch (error) {
        return Response.json(
            { error: error },
            { status: 500 },
        );
    }
}