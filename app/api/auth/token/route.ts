import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session?.tokenSet?.accessToken) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    return NextResponse.json({
      accessToken: session.tokenSet.accessToken,
    });
  } catch (err) {
    console.error("Error en /api/auth/token:", err);
    return NextResponse.json({ error: "Error getting token" }, { status: 500 });
  }
}