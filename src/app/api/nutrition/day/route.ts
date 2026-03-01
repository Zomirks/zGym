import { NextRequest, NextResponse } from "next/server";

// LIB
import { requireSession } from "@/lib/api-utils";
import { getDaySummary, updateSyncedData } from "@/lib/services/nutrition.service";

export async function GET(request: NextRequest) {
	const { session , error } = await requireSession();
	if (error) return error

	const date = request.nextUrl.searchParams.get("date");

	if (!date) {
		return NextResponse.json({ error: "Une date est requise" }, { status: 400 });
	}

	const daySummary = await getDaySummary(session.user.id, new Date(date));
	return NextResponse.json(daySummary);
}

export async function PATCH(request: NextRequest) {
	const { session, error } = await requireSession();
	if (error) return error
	
	const body = await request.json();
	const { calories, carbohydrates, fats, proteins, date } = body;

	if (!calories || !carbohydrates || !fats || !proteins || !date) {
		return NextResponse.json(
			{ error: "Tous les champs sont requis!" },
			{ status: 400 }
		)
	}
	
	try {
		const newSyncNutrionDay = await updateSyncedData(session.user.id, new Date(date), {
			calories, carbohydrates, fats, proteins
		});

		return NextResponse.json(newSyncNutrionDay, {status: 200});
	} catch {
		return NextResponse.json({ error: "Les calories et macros n'ont pas pu être ajoutés correctement"}, {status: 500});
	}
}