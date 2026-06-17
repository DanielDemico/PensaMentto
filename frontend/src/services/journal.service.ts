import {
    createJournal,
    getJournalById,
    getAllJournals,
    updateJournal,
    deleteJournal
} from "@/repository/journal.repository";
import { JournalType } from "@/models/Journal";
import { z } from "zod";
import Groq from "groq-sdk";

async function makeAnalisys(text:string){

    const groq = new Groq({
        apiKey:process.env.GROQ_API_KEY
    });

    const prompt = `Analise o texto abaixo e retorne apenas JSON válido:
        {
        "sentimento": "POSITIVO" | "NEGATIVO" | "NEUTRO",
        "pontuacao": 0..100,
        "palavras_chave": ["...", "...", "..."],
        "tags":["...","...","..."]
        }


        
        Texto; ${text}`

    const SentimentoSchema = z.object({
    sentimento: z.enum(['POSITIVO','NEGATIVO','NEUTRO']).describe("A classificação de sentimento do texto"),
    pontuacao: z.number().min(0).max(100).describe("Grau de confiança da análise de 0 a 100"),
    palavras_chave: z.array(z.string()).describe("As 3 palavras que mais impactaram o sentimento"),
    tags: z.array(z.string()).describe("Tags baseadas nos sentimentos do usuário")    
});

    const response = await groq.chat.completions.create({
        model:"openai/gpt-oss-20b",
        messages: [{ role: "user", content: prompt }],
        temperature:0,
    });

    const rawText = response.choices[0].message.content as string;
    const parsed = SentimentoSchema.parse(JSON.parse(rawText));
    return parsed;
}

function cleanTags(tags?: string[]) {
    return (tags ?? []).map(tag => tag.trim().toLowerCase());
}

export async function saveJournal(journal: JournalType) {
    const analise = await makeAnalisys(journal.text);

    console.log("Análise recebida:", analise);  

    return createJournal({
        ...journal, 
        tags:analise.tags,
        analise: {
            sentimento: analise.sentimento,
            pontuation: analise.pontuacao,
            key_words: analise.palavras_chave
        }
    });
}

export async function getJournal(id: string) {
    console.log(id)
    return getJournalById(id);
}



export async function listJournals(limit: number = 10, skip: number = 0) {
    return getAllJournals(limit, skip);
}

export async function editJournal(id: string, journal: Partial<JournalType>) {
    const updateData = {
        ...journal,
        tags: journal.tags ? cleanTags(journal.tags) : undefined
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
        updateData[key as keyof typeof updateData] === undefined && 
        delete updateData[key as keyof typeof updateData]
    );
    
    return updateJournal(id, updateData);
}

export async function removeJournal(id: string) {
    console.log(id);
    return deleteJournal(id);
}