// NEXT
import { headers } from "next/headers";
import { redirect } from "next/navigation"

// LIB
import { auth } from "@/lib/auth";
import { getDaySummary } from "@/lib/services/nutrition.service";

interface Props {
	date: Date
}

interface MacroCardProps {
	label: string
	value: number
	unit: string
	colorBg: string
	colorAccent: string
}

function MacroCard({ label, value, unit, colorBg, colorAccent }: MacroCardProps) {
	return (
		<div className={`flex flex-col gap-1 rounded-md px-4 py-3 ${colorBg}`}>
			<span className={`font-poster text-sm tracking-widest ${colorAccent}`}>{label}</span>
			<div className="flex items-baseline gap-1">
				<span className="font-data text-2xl font-semibold text-zgym-text-1">
					{value.toFixed(1)}
				</span>
				<span className="font-data text-xs text-zgym-text-3">{unit}</span>
			</div>
		</div>
	)
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
			<div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-zgym-surface px-6 py-8 text-center  h-full self-stretch">
				<span className="font-poster text-3xl tracking-widest text-zgym-text-3">AUCUNE DONNÉE</span>
				<p className="font-body text-sm text-zgym-text-3">Aucun repas enregistré pour cette journée.</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4 h-full self-stretch">
			<div className="flex flex-col items-center gap-1 rounded-lg bg-zgym-surface py-6">
				<span className="font-poster text-sm tracking-[0.3em] text-zgym-text-3">CALORIES</span>
				<div className="flex items-baseline gap-2">
					<span className="font-data text-5xl font-semibold text-zgym-text-1">
						{Math.round(totalCalories)}
					</span>
					<span className="font-data text-base text-zgym-text-3">kcal</span>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<MacroCard
					label="PROTÉINES"
					value={totalProteins}
					unit="g"
					colorBg="bg-zgym-effort"
					colorAccent="text-zgym-brick"
				/>
				<MacroCard
					label="GLUCIDES"
					value={totalCarbohydrates}
					unit="g"
					colorBg="bg-zgym-energy"
					colorAccent="text-zgym-gold"
				/>
				<MacroCard
					label="LIPIDES"
					value={totalFats}
					unit="g"
					colorBg="bg-zgym-strength"
					colorAccent="text-zgym-sienna"
				/>
			</div>
		</div>
	)
}
