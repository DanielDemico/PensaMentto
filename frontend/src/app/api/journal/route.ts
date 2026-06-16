import { connectDB } from "@/lib/mongodb";
import { JournalType } from "@/models/Journal";
import { saveJournal } from "@/services/journal.service";

export async function POST(req: Request) {

    console.log("API chamada");
    await connectDB();
    const body = await req.json() as JournalType; // await porque devolve uma Promise

    try {

        //validar se existe texto
        if (!body.text?.trim()) {
            return Response.json(
                { error: "Texto obrigatório" },
                { status: 400 }
            );
        }
    }
    catch (error) {
        console.error("Erro ao salvar journal:", error);
        return Response.json(
            { error: "Erro ao salvar journal" },
            { status: 500 }
        );
    }

    const result = await saveJournal(body); // await porque é async

    return Response.json(result);
}