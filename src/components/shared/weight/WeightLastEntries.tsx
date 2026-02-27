// Next
import { headers } from "next/headers";

// Components
import DeleteWeightButton from "./DeleteWeightButton";

// Components - UI
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Icons
import { Info as InfoIcon } from "lucide-react";

// Lib
import { auth } from "@/lib/auth";
import { getWeightEntries } from "@/lib/services/weight.service";

const WeightLastEntries = async () => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) return <p className="text-red-500">Non autorisé</p>;

	const entries = await getWeightEntries(session.user.id, 7);

	if (entries.length === 0) return <p className="text-muted-foreground text-sm">Aucune entrée enregistrée.</p>;

	return (
		<Card className="flex flex-col gap-2 py-3 px-4">
			<h3 className="font-poster text-lg">Dernière données enregistrées</h3>
			{entries.map((entry) => (
				<div key={entry.id}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							{entry.date.toLocaleDateString("fr-FR", {
								day: "numeric",
								month: "numeric",
								year: "numeric",
							})}

							{entry.note && (
								<Tooltip>
									<TooltipTrigger>
										<InfoIcon size={14} />
									</TooltipTrigger>
									<TooltipContent>
										{entry.note}
									</TooltipContent>
								</Tooltip>
							)}
						</div>

						<div>
							<span className="font-data font-semibold">{entry.weight} kg</span>
							<DeleteWeightButton entryId={entry.id}/>
						</div>
					</div>
				</div>
			))}
		</Card>
	);
};

export default WeightLastEntries;
