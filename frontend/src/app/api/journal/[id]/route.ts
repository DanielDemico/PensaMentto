import { connectDB } from "@/lib/mongodb";
import { JournalType } from "@/models/Journal";
import {
    getJournal,
    editJournal,
    removeJournal
} from "@/services/journal.service";

// GET - Buscar diário por ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const result = await getJournal(params.id);

        if (!result) {
            return Response.json(
                { error: "Diário não encontrado" },
                { status: 404 }
            );
        }

        return Response.json(result);
    } catch (error) {
        return Response.json(
            { error: error },
            { status: 500 }
        );
    }
}

// PUT - Atualizar diário
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const body = await req.json() as Partial<JournalType>;

        if (body.text !== undefined && !body.text.trim()) {
            return Response.json(
                { error: "Texto não pode estar vazio" },
                { status: 400 }
            );
        }

        const result = await editJournal(params.id, body);

        if (!result) {
            return Response.json(
                { error: "Diário não encontrado" },
                { status: 404 }
            );
        }

        return Response.json(result);
    } catch (error) {
        return Response.json(
            { error: error },
            { status: 500 }
        );
    }
}

// DELETE - Deletar diário
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params;

        const result = await removeJournal(id);
        
        await console.log("parans" + id);
        console.log("result" + result);

        // if (!result) {
        //     return Response.json(
        //         { error: "Diário não encontrado" },
        //         { status: 404 }
        //     );
        // }

        return Response.json({ message: "Diário deletado com sucesso" });
    } catch (error) {
        return Response.json(
            { error: error },
            { status: 500 }
        );
    }
}
