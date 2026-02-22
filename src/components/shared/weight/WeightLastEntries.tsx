import { Card } from "@/components/ui/card";
import { Info as InfoIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverTitle, PopoverHeader, PopoverContent } from "@/components/ui/popover";
import { getWeightEntries } from "@/lib/services/weight.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const WeightLastEntries = async () => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) return <p className="text-red-500">Non autorisé</p>;

	const entries = await getWeightEntries(session.user.id, 7);

	if (entries.length === 0) return <p className="text-muted-foreground text-sm">Aucune entrée enregistrée.</p>;

	return (
		<Card className="flex flex-col gap-2 py-3 px-4">
			<h3 className="font-semibold">Dernière données enregistrées</h3>
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
								<Popover>
									<PopoverTrigger asChild>
										<InfoIcon size={14} />
									</PopoverTrigger>
									<PopoverContent>
										<PopoverHeader>
											<PopoverTitle>{entry.note}</PopoverTitle>
										</PopoverHeader>
									</PopoverContent>
								</Popover>
							)}
						</div>

						<span className="font-semibold">{entry.weight} kg</span>
					</div>
				</div>
			))}
		</Card>
	);
};

export default WeightLastEntries;
