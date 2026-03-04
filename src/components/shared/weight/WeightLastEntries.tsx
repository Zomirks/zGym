// Next
import { headers } from "next/headers";

// Components
import DeleteWeightButton from "./DeleteWeightButton";

// Components - UI
import { Card } from "@/components/ui/card";

// Lib
import { auth } from "@/lib/auth";
import { getWeightEntries } from "@/lib/services/weight.service";

const WeightLastEntries = async () => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) return (
		<p className="font-data text-xs tracking-widest uppercase text-destructive/80">
			◆ Non autorisé
		</p>
	);

	const entries = await getWeightEntries(session.user.id, 7);

	if (entries.length === 0) return (
		<p className="font-serif text-sm italic text-muted-foreground">
			Aucune entrée enregistrée.
		</p>
	);

	return (
		<Card className="flex flex-col gap-0 py-6 px-6">
			<div className="mb-5">
				<div className="flex items-center gap-2 font-data text-[10px] text-primary/85 tracking-[0.25em] uppercase mb-2">
					<span className="inline-block w-6 h-px bg-primary/50" />
					7 dernières données
				</div>
				<h3 className="font-display text-3xl tracking-[0.06em] uppercase leading-none text-foreground">
					Historique
				</h3>
			</div>

			<div className="flex flex-col">
				{entries.map((entry, i) => (
					<div
						key={entry.id}
						className={`
							flex items-center justify-between py-3
							${i < entries.length - 1 ? "border-b border-border" : ""}
						`}
					>
						<div className="flex flex-col gap-0.5">
							<span className="font-data text-xs tracking-[0.15em] uppercase text-secondary">
								{entry.date.toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "short",
								})}
							</span>
							{entry.note && (
								<span className="font-serif text-xs italic text-muted-foreground leading-snug max-w-60 truncate">
									{entry.note}
								</span>
							)}
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-baseline gap-1">
								<span className="font-data text-2xl text-foreground tabular-nums">
									{entry.weight}
								</span>
								<span className="font-data text-[10px] tracking-widest uppercase text-muted-foreground">
									kg
								</span>
							</div>
							<DeleteWeightButton entryId={entry.id} />
						</div>
					</div>
				))}
			</div>
		</Card>
	);
};

export default WeightLastEntries;