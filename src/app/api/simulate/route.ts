import { NextRequest, NextResponse } from "next/server";
import { simulateTweet } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tweet } = body;

        if (!tweet || typeof tweet !== "string") {
            return NextResponse.json(
                { error: "Tweet content is required" },
                { status: 400 }
            );
        }

        if (tweet.length > 280) {
            return NextResponse.json(
                { error: "Tweet exceeds 280 characters" },
                { status: 400 }
            );
        }

        const analysis = await simulateTweet(tweet);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Simulation error:", error);
        return NextResponse.json(
            { error: "Failed to simulate tweet. Please try again." },
            { status: 500 }
        );
    }
}
