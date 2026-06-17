import mongoose, { InferSchemaType } from "mongoose";

const JournalSchema = new mongoose.Schema(
    {
        userId: String,

        text: {
            type: String,
            required: true
        },

        tags: [
            {
                type: String,
            }
        ],
        analise: {
            sentimento: { type: String },
            pontuation: {type: Number},
            key_words: [{type: String}]
        }
    },

    {
        timestamps: true
    }

);

export type JournalType = InferSchemaType<typeof JournalSchema> & {
  _id: string;
};

export default mongoose.models.Journal || mongoose.model("Journal", JournalSchema);