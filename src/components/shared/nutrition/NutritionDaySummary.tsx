// NEXT
import { headers } from "next/headers";
import { redirect } from "next/navigation"

// COMPONENTS - UI
import { SectionTag } from "@/components/ui/section-tag";

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
	const int = Math.floor(value);
	const dec = value.toFixed(1).split(".")[1];
	return (
		<div className={`flex flex-col gap-1 rounded-md py-3 ${colorBg}`}>
			<div className="border-b pb-2">
				<span className={`px-4 font-serif text-xs tracking-widest uppercase ${colorAccent}`}>{label}</span>
				<span style={{ width: 5, height: 5, borderRadius: "50%", background: "red", opacity: 0.7 }} />
			</div>

			<div className="flex flex-col flex-1 justify-end px-4">
				<div className="font-data text-6xl font-bold tracking-tighter">
					{int}
					<span style={{ fontSize: 22, opacity: 0.4, fontWeight: 400 }}>.{dec}</span>

					<span className="text-2xl ml-2">{unit}</span>

				</div>
				<div className="text-[8px] font-serif self-end text-secondary tracking-wider uppercase">
					/ journée
				</div>
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
    //   <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: "3rem" }}>
    //     {macros.map(({ label, value, unit, accent, bg }) => {
    //       const int = Math.floor(value);
    //       const dec = value.toFixed(1).split(".")[1];
    //       return (
    //         <div key={label} style={{
    //           background: bg, borderRadius: 10,
    //           overflow: "hidden", position: "relative",
    //           display: "flex", flexDirection: "column",
    //         }}>
    //           <Grain />
    //           {/* Header */}
    //           <div style={{
    //             padding: "9px 13px 8px",
    //             display: "flex", alignItems: "center", justifyContent: "space-between",
    //             borderBottom: "1px solid rgba(237,232,220,0.07)",
    //           }}>
    //             <span style={{
    //               fontFamily: "'Courier New', monospace", fontSize: 8,
    //               letterSpacing: "0.28em", textTransform: "uppercase", color: accent,
    //             }}>{label}</span>
    //             <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, opacity: 0.7 }} />
    //           </div>
    //           {/* Body */}
    //           <div style={{ flex: 1, padding: "12px 13px 16px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
    //             <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 54, lineHeight: 1, color: "#EDE8DC", letterSpacing: "-0.03em" }}>
    //               {int}
    //               <span style={{ fontSize: 22, opacity: 0.4, fontWeight: 400 }}>.{dec}</span>
    //             </div>
    //             <div style={{ fontFamily: "'Courier New', monospace", fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase", color: "#5C5448", marginTop: 6 }}>
    //               {unit} / journée
    //             </div>
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>