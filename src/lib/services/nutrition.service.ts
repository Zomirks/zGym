import prisma from "@/lib/prisma"

import { CreateManualEntryInput, SyncedNutritionData } from "@/types/nutrition";

export async function getOrCreateNutritionDay(userId: string, date: Date) {
	const nutritionDay = await prisma.nutritionDay.upsert({
		where: {userId_date: {userId, date}},
		create: {userId, date},
		update: {}
	});

	return nutritionDay;
}

export async function addManualEntry(userId: string, input: CreateManualEntryInput) {
	const nutritionDay = await getOrCreateNutritionDay(userId, input.date)
	const nutritionManualEntry = await prisma.nutritionManualEntry.create({
		data: { 
			nutritionDayId: nutritionDay.id,
			calories: input.calories,
			carbohydrates: input.carbohydrates,
			description: input.description,
			fats: input.fats,
			proteins: input.proteins,
		},
	});

	return nutritionManualEntry;
}

export async function deleteManualEntry(entryId: string, userId: string) {
	const deletedEntry = await prisma.nutritionManualEntry.deleteMany({
		where: {
			id: entryId,
			nutritionDay: {
				userId: userId
			}
		}
	});

	if(deletedEntry.count === 0) {
		throw new Error("Entrée non trouvée ou non autorisée");
	}

	return deletedEntry;
}

export async function getDaySummary(userId: string, date: Date) {
	const daySummary = await prisma.nutritionDay.findUnique({
		where: { userId_date: { userId, date } },
		include: {manualEntries: true}
	});
	
	return daySummary;
}

export async function updateSyncedData(userId: string, date: Date, data: SyncedNutritionData) {
	const syncedNutritionDay = await prisma.nutritionDay.upsert({
		where: { userId_date: { userId, date } },
		create: {
			userId,
			syncedCalories: data.calories,
			carbohydrates: data.carbohydrates,
			fats: data.fats,
			proteins: data.proteins,
			date
		},
		update: {
			syncedCalories: data.calories,
			carbohydrates: data.carbohydrates,
			fats: data.fats,
			proteins: data.proteins,
		}
	});

	return syncedNutritionDay;
}