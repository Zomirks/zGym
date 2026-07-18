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

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Validates a "yyyy-MM-dd" calendar-day string before it is trusted by `parseDateOnly`. */
export function isDateOnly(date: string) {
	if (!DATE_ONLY_PATTERN.test(date)) return false;
	// Round-tripping through Date.UTC rejects impossible calendar days (e.g. "2026-02-30"),
	// which would otherwise silently roll over into another month.
	return parseDateOnly(date).toISOString().slice(0, 10) === date;
}

export function parseDateOnly(date: string) {
	const [year, month, day] = date.split("-").map(Number);
	return new Date(Date.UTC(year, month - 1, day));
}