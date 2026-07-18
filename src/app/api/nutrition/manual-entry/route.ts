import { NextRequest, NextResponse } from "next/server";

// LIB
import { requireSession, parseDateOnly, isDateOnly } from "@/lib/api-utils";
import { addManualEntry, deleteManualEntry } from "@/lib/services/nutrition.service";

export async function POST(request: NextRequest) {
	const { session , error } = await requireSession();
	if (error) return error

	const body = await request.json();
	const { calories, carbohydrates, description, fats, proteins, date } = body;

	if (!calories || !carbohydrates || !description || !fats || !proteins || !date) {
		return NextResponse.json(
			{ error: "Tous les champs sont requis!" },
			{ status: 400 }
		)
	}

	if (!isDateOnly(date)) {
		return NextResponse.json({ error: "La date fournie n'est pas valide" }, { status: 400 });
	}

	const parsedDate = parseDateOnly(date);

	try {
		const newNutrionManualEntry = await addManualEntry(session.user.id, {
			calories, carbohydrates, description, fats, proteins, date: parsedDate
		});

		return NextResponse.json(newNutrionManualEntry, {status: 201});
	} catch {
		return NextResponse.json({ error: "Les calories et macros n'ont pas pu être ajoutés correctement"}, {status: 500});
	}
}

export async function DELETE(request: NextRequest) {
	const { session, error } = await requireSession();
	if (error) return error

	const manualEntryId = request.nextUrl.searchParams.get("id");

	if(manualEntryId) {
		try {
			const deleted = await deleteManualEntry(manualEntryId, session.user.id);
			return NextResponse.json(deleted);
		} catch {
			return NextResponse.json({ error: "Donnée non trouvée" }, { status: 404 });
		}
	} else {
		return NextResponse.json({ error: "Aucune donnée n'a été spécifiée pour être supprimée"}, { status: 400 });
	}
}