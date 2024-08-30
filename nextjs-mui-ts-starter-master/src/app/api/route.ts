import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const nameTrack = request.nextUrl.searchParams.get('nameTrack')
    return await fetch(`${process.env.BACKEND_URL_AUDIO}/${nameTrack}`);
}