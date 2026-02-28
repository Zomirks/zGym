import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function requireSession() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if(!session) {
		return { session: null, error: NextResponse.json({ error: "Non autorisé" }, { status: 401 })}
	}

	return { session, error: null }
}