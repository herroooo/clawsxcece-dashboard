import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, styleInterest } = await req.json();

    const templates = [
      `hai @${username}! i saw you liked one of my reels! I love your style and was wondering if you'd be down to get a custom designed nail set :3`,
      `omg hai @${username}! noticed you liked my recent reel! let me know if u ever want to get nails done :33`,
      `haii @${username}! saw u liked my reel :p your page is so cool! I'm opening up a few spots for custom ${styleInterest} sets this week if u ever wanna get your nails done too!!`,
    ];

    const generatedText = templates[Math.floor(Math.random() * templates.length)];

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate message" }, { status: 500 });
  }
}
