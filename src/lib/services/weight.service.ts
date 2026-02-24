import prisma from "../prisma";

export async function getWeightEntries(userId: string, limit?: number) {
	const entries = await prisma.weightEntry.findMany({
		where: { userId },
		orderBy: { date: "desc" },
		take: limit,
	});
	return entries;
}

export async function addWeightEntry(userId: string, weight: number, date: string, note?: string) {
	const [year, month, day] = date.split('-').map(Number);
	const localDate = new Date(year, month - 1, day, 12, 0, 0, 0);

	const entry = await prisma.weightEntry.create({
		data: {
			id: crypto.randomUUID(),
			userId,
			weight,
			date: localDate,
			note,
		},
	});
	return entry;
}

export async function deleteWeightEntry(entryId: string, userId: string) {
	const deletedEntry = await prisma.weightEntry.delete({
		where: {
			id: entryId,
			userId
		},
		select: {
			date: true,
			weight: true
		}
	});
	return deletedEntry;
}