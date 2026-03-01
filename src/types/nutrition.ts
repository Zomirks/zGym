export type CreateManualEntryInput = {
	calories: number,
	carbohydrates: number,
	description: string,
	fats: number,
	proteins: number,
	date: Date
}

export type SyncedNutritionData = {
	calories: number,
	carbohydrates: number,
	fats: number,
	proteins: number
}