import mongoose, { InferSchemaType } from "mongoose";

const StreakSchema = new mongoose.Schema(
    {
        currentStreak: {
            type: Number,
            required: true,
            default: 0
        },
        lastJournalDate: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export type StreakType = InferSchemaType<typeof StreakSchema> & {
    _id: string;
};

export default mongoose.models.Streak || mongoose.model("Streak", StreakSchema);
