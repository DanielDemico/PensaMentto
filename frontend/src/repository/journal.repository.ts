import Journal, { JournalType } from "@/models/Journal";
import { Types } from "mongoose";

export async function createJournal(data: JournalType) {
    return Journal.create(data);
}

export async function getJournalById(id: string) {
    console.log(id)
    return Journal.findById(new Types.ObjectId(id));
}

export async function getAllJournals(limit: number = 10, skip: number = 0) {
    return Journal.find().limit(limit).skip(skip).sort({ createdAt: -1 });
}

export async function updateJournal(id: string, data: Partial<JournalType>) {
    return Journal.findByIdAndUpdate(
        new Types.ObjectId(id),
        data,
        { new: true, runValidators: true }
    );
}

export async function deleteJournal(id: string) {
    console.log(id);
    return Journal.findByIdAndDelete(new Types.ObjectId(id));
}

export async function searchJournalsByText(query: string, limit = 10, skip = 0) {
    return Journal.find({
        text: {
            $regex: query,
            $options: "i" // case-insensitive
        }
    })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });
}