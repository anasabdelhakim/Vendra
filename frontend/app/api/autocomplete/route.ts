import { NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");

  if (!input) return NextResponse.json([]);

  try {
    const res = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GOOGLE_API_KEY!,
      },
    });

    return NextResponse.json(res.data.predictions);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
