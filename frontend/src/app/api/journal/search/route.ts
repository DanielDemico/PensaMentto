import { connectDB } from "@/lib/mongodb";
import { searchJournals } from "@/services/journal.service";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const text = searchParams.get("text") || "";
        const limit = Number(searchParams.get("limit") || 10);
        const skip = Number(searchParams.get("skip") || 0);

        if (!text.trim()) {
            return Response.json(
                { error: "Texto de busca vazio" },
                { status: 400 }
            );
        }

        const result = await searchJournals(text, limit, skip);

        return Response.json(result);
    } catch (error) {
        return Response.json(
            { error: "Erro na busca" },
            { status: 500 }
        );
    }
}