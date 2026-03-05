// NEXT
import { headers } from "next/headers";
import { redirect } from "next/navigation"

// COMPONENTS
import MacroCard from "./MacroCard";

// COMPONENTS - UI
import { SectionTag } from "@/components/ui/section-tag";

// LIB
import { auth } from "@/lib/auth";
import { getDaySummary } from "@/lib/services/nutrition.service";

interface Props {
	date: Date
}

export default async function NutritionDaySummary({ date }: Props) {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) redirect("/login")

	const summary = await getDaySummary(session.user.id, date);
	const entries = summary?.manualEntries ?? [];
	const syncedCalories = summary?.syncedCalories ?? 0;
	const syncedFats = summary?.fats ?? 0;
	const syncedCarbohydrates = summary?.carbohydrates ?? 0;
	const syncedProteins = summary?.proteins ?? 0;

	const totalCalories = syncedCalories + entries.reduce((acc, e) => acc + e.calories, 0);
	const totalFats = syncedFats + entries.reduce((acc, e) => acc + e.fats, 0);
	const totalCarbohydrates = syncedCarbohydrates + entries.reduce((acc, e) => acc + e.carbohydrates, 0);
	const totalProteins = syncedProteins + entries.reduce((acc, e) => acc + e.proteins, 0);

	const isEmpty = totalCalories === 0 && totalProteins === 0 && totalCarbohydrates === 0 && totalFats === 0;

	if (isEmpty) {
		return (
			<div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-surface px-6 py-10 text-center h-full self-stretch">
				<SectionTag>Journée</SectionTag>
				<span className="font-display text-3xl tracking-[0.06em] uppercase leading-none text-foreground">
					Aucune donnée
				</span>
				<p className="font-serif text-sm italic text-secondary">
					Aucun repas enregistré pour cette journée.
				</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4 h-full self-stretch">
			<div className="flex flex-col items-center gap-1 rounded-xl bg-surface py-6 px-4">
				<SectionTag>Calories</SectionTag>
				<div className="flex items-baseline gap-2">
					<span className="font-data text-5xl tabular-nums text-foreground">
						{Math.round(totalCalories)}
					</span>
					<span className="font-data text-[10px] tracking-widest uppercase text-muted-foreground">kcal</span>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<MacroCard
					label="Protéines"
					value={totalProteins}
					unit="g"
					colorBg="bg-card-effort"
					colorAccent="text-accent-brick"
				/>
				<MacroCard
					label="Glucides"
					value={totalCarbohydrates}
					unit="g"
					colorBg="bg-card-energy"
					colorAccent="text-accent-gold"
				/>
				<MacroCard
					label="Lipides"
					value={totalFats}
					unit="g"
					colorBg="bg-card-strength"
					colorAccent="text-accent-moss"
				/>
			</div>
		</div>
	)
}