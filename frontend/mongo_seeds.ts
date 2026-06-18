import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:example@mongo:27017/diario?authSource=admin";

const JournalSchema = new mongoose.Schema(
    {
        userId: String,
        text: { type: String, required: true },
        tags: [{ type: String }],
        analise: {
            sentimento: { type: String },
            pontuation: { type: Number },
            key_words: [{ type: String }]
        }
    },
    { timestamps: true }
);

const Journal = mongoose.models.Journal || mongoose.model("Journal", JournalSchema);

const mockRecords = [
  {
    analise: { sentimento: "NEGATIVO", pontuation: 20, key_words: ["triste", "pão", "bichado"] },
    tags: ["emoção", "alimentação", "qualidade"],
    text: "Estou muito triste, comi pão bichado",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    analise: { sentimento: "POSITIVO", pontuation: 80, key_words: ["feliz", "sol", "parque"] },
    tags: ["natureza", "alegria", "atividade"],
    text: "Fui ao parque e tomei sol, estou muito feliz!",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    analise: { sentimento: "NEUTRO", pontuation: 50, key_words: ["trabalho", "cansado", "rotina"] },
    tags: ["trabalho", "rotina", "cansado"],
    text: "Dia normal de trabalho, um pouco cansado apenas.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    analise: { sentimento: "POSITIVO", pontuation: 90, key_words: ["conquista", "projeto", "sucesso"] },
    tags: ["trabalho", "conquista", "alegria"],
    text: "Entreguei o projeto no prazo e foi um sucesso!",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    analise: { sentimento: "NEUTRO", pontuation: 60, key_words: ["estudo", "foco", "programação"] },
    tags: ["estudo", "foco", "tecnologia"],
    text: "Estudando bastante sobre Next.js e Recharts hoje.",
    createdAt: new Date()
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected. Clearing existing records...");
    await Journal.deleteMany({});
    
    console.log("Inserting mock records...");
    await Journal.insertMany(mockRecords);
    
    console.log("Seed complete!");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
