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
	const entry = await prisma.weightEntry.create({
		data: {
			id: crypto.randomUUID(),
			userId,
			weight,
			date: new Date(date),
			note,
		},
	});
	return entry;
}