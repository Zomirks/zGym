import { NextRequest, NextResponse } from "next/server";

// LIB
import { requireSession } from "@/lib/api-utils";
import { addWeightEntry, getWeightEntries, deleteWeightEntry } from "@/lib/services/weight.service";

export async function GET(request: NextRequest) {
	const { session, error } = await requireSession();
	if (error) return error

	const limitParam = request.nextUrl.searchParams.get("limit");
	const limit = limitParam ? Number(limitParam) : undefined;

	const weightEntries = await getWeightEntries(session.user.id, limit);

	return NextResponse.json(weightEntries);
}

export async function POST(request: NextRequest) {
	const { session, error } = await requireSession();
	if (error) return error

	const body = await request.json();
	if (typeof body.weight != 'number') {
		return NextResponse.json({ error: "Le poids n'est pas renseigné correctement" }, { status: 400 });
	}

	try {
		const newWeightEntry = await addWeightEntry(session.user.id, body.weight, body.date, body.note);
		return NextResponse.json(newWeightEntry, {status: 201});
	} catch (error) {
		return NextResponse.json({ error: "Votre poids n'a pas pu être enregistré" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	const { session, error } = await requireSession();
	if (error) return error

	const entryId = request.nextUrl.searchParams.get("id");

	if (entryId) {
		try {
			const deleted = await deleteWeightEntry(entryId, session.user.id);
			return NextResponse.json(deleted);
		} catch {
			return NextResponse.json({ error: "Donnée non trouvée" }, { status: 404 });
		}
	} else {
		return NextResponse.json({ error: "Aucune donnée n'a été spécifiée pour être supprimée" }, { status: 400 });
	}
}