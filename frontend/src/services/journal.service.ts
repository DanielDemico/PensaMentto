import {
    createJournal,
    getJournalById,
    getAllJournals,
    updateJournal,
    deleteJournal
} from "@/repository/journal.repository";
import { JournalType } from "@/models/Journal";

function cleanTags(tags?: string[]) {
    return (tags ?? []).map(tag => tag.trim().toLowerCase());
}

export async function saveJournal(journal: JournalType) {
    return createJournal({
        ...journal,
        tags: cleanTags(journal.tags)
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