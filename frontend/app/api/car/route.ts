import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.CAR_API_TOKEN;
  const secret = process.env.CAR_API_SECRET;

  if (!token || !secret) {
    return NextResponse.json(
      { error: "CarAPI credentials missing" },
      { status: 500 }
    );
  }

  try {
    // 1️⃣ Authenticate
    const authRes = await fetch("https://carapi.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ api_token: token, api_secret: secret }),
    });

    if (!authRes.ok) {
      const text = await authRes.text();
      return NextResponse.json(
        { error: "Authentication failed", details: text },
        { status: authRes.status }
      );
    }

    // Get token as plain text
    const jwt = await authRes.text();

    // 2️⃣ Fetch car makes
    const res = await fetch("https://carapi.app/api/makes", {
      headers: { Authorization: `Bearer ${jwt}`, Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Failed to fetch car makes", details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ makes: data });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
