import { connectDB } from "@/lib/mongodb";
import { getEffectiveStreak } from "@/services/streak.service";

export async function GET() {
    try {
        await connectDB();
        const streak = await getEffectiveStreak();
        return Response.json({ streak });
    } catch (error) {
        return Response.json(
            { error: error },
            { status: 500 }
        );
    }
}
