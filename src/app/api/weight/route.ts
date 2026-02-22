import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { addWeightEntry, getWeightEntries } from "@/lib/services/weight.service";
import { auth } from "@/lib/auth";

export async function GET() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
	}

	const weightEntries = await getWeightEntries(session.user.id);

	return NextResponse.json(weightEntries);
}

export async function POST(request: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
	}

	const body = await request.json();
	if (typeof body.weight != 'number') {
		return NextResponse.json({ error: "Le poids n'est pas renseigné correctement" }, { status: 400 });
	}

	const newWeightEntry = await addWeightEntry(session.user.id, body.weight, body.date, body.note);

	return NextResponse.json(newWeightEntry, {status: 201});
}