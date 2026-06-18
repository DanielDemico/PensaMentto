import Streak from "@/models/Streak";
import Journal from "@/models/Journal";

async function calculateLegacyStreak() {
    const records = await Journal.find({}, { createdAt: 1 }).sort({ createdAt: -1 });
    if (!records || records.length === 0) {
        return { currentStreak: 0, lastJournalDate: new Date() };
    }

    const uniqueDates = Array.from(
        new Set(
            records.map((r) => {
                const d = new Date(r.createdAt);
                return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
            })
        )
    ).sort((a, b) => b - a);

    if (uniqueDates.length === 0) {
        return { currentStreak: 0, lastJournalDate: new Date() };
    }

    const today = new Date();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const daysSinceLastEntry = Math.round((todayTime - uniqueDates[0]) / ONE_DAY);

    let currentStreak = 1;
    if (daysSinceLastEntry <= 1) {
        for (let i = 1; i < uniqueDates.length; i++) {
            const diffDays = Math.round((uniqueDates[i - 1] - uniqueDates[i]) / ONE_DAY);
            if (diffDays === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    } else {
        currentStreak = 0; // It was broken
    }
    
    return {
        currentStreak,
        lastJournalDate: new Date(uniqueDates[0])
    };
}

export async function updateStreak(date: Date) {
    let streak = await Streak.findOne();
    
    if (!streak) {
        const legacy = await calculateLegacyStreak();
        // If they post today, and legacy was 0 (broken), they start at 1.
        // If legacy wasn't broken, they continue it.
        const startStreak = legacy.currentStreak > 0 ? legacy.currentStreak : 1;
        streak = new Streak({ currentStreak: startStreak, lastJournalDate: date });
        await streak.save();
        return streak;
    }

    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const lastDateObj = new Date(streak.lastJournalDate);
    const lastDate = new Date(lastDateObj.getFullYear(), lastDateObj.getMonth(), lastDateObj.getDate()).getTime();
    
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const diffDays = Math.round((inputDate - lastDate) / ONE_DAY);

    if (diffDays === 1) {
        streak.currentStreak += 1;
        streak.lastJournalDate = date;
    } else if (diffDays > 1) {
        streak.currentStreak = 1;
        streak.lastJournalDate = date;
    } else if (diffDays === 0) {
        streak.lastJournalDate = date;
    }

    await streak.save();
    return streak;
}

export async function getEffectiveStreak() {
    let streak = await Streak.findOne();
    if (!streak) {
        // Run migration logic once
        const legacy = await calculateLegacyStreak();
        streak = new Streak({ currentStreak: legacy.currentStreak, lastJournalDate: legacy.lastJournalDate });
        await streak.save();
    }

    const today = new Date();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    const lastDateObj = new Date(streak.lastJournalDate);
    const lastDate = new Date(lastDateObj.getFullYear(), lastDateObj.getMonth(), lastDateObj.getDate()).getTime();
    
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const diffDays = Math.round((todayTime - lastDate) / ONE_DAY);

    if (diffDays > 1) {
        return 0;
    }
    return streak.currentStreak;
}
