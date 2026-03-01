import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// COMPONENT - UI
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { Card } from "@/components/ui/card";

// COMPONENT - SHARED
import ManualEntriesForm from "@/components/shared/nutrition/ManualEntryForm";
import NutritionDaySummary from "@/components/shared/nutrition/NutritionDaySummary";
import WeightCalendar from "@/components/shared/weight/WeightCalendar";
import WeightChart from "@/components/shared/weight/WeightChart";
import WeightForm from "@/components/shared/weight/WeightForm";
import WeightLastEntries from "@/components/shared/weight/WeightLastEntries";

// LIB
import { getWeightEntries } from "@/lib/services/weight.service";

// TYPES
import { WeightDataPoint } from "@/types/weight";

const Dashboard = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	const entries = await getWeightEntries(session.user.id, 7);
	const chartData: WeightDataPoint[] = entries
		.map((entry) => ({
			date: entry.date.toLocaleDateString("fr-FR", {
				day: "numeric",
				month: "short",
			}),
			weight: entry.weight,
		}))
		.reverse();

	return (
		<div>
			Bonjour {session.user.name!}
			
			<div className="grid grid-cols-5 gap-5">
				<div></div>

				<div></div>
				
				<Tabs defaultValue="weight" className="col-span-3">
					<TabsList className="self-end">
						<TabsTrigger value="weight">Poids</TabsTrigger>
						<TabsTrigger value="calories">Calories</TabsTrigger>
					</TabsList>
					<TabsContent value="weight" className="grid grid-cols-6 gap-5 bg-zgym-focus rounded-xl p-4">
						<div className="flex flex-col gap-4 col-span-4">
							<Card className="p-6">
								<h2 className="text-4xl text-primary font-poster font-semibold">Poids</h2>
								<div className="flex flex-col gap-4 text-sm">
									<p>Si on a un objectif de prise de masse ou de perte de poids, il faut se peser régulièrement.</p>
									<p>Une seule pesée ne veut rien dire : notre poids varie chaque jour (eau, sel, digestion, repas plus riche…). Se peser une fois par mois peut nous tromper — surtout si ça tombe juste après un écart — alors que notre progression était bonne.</p>
									<p>En se pesant souvent, on fais une moyenne sur la semaine et on observes la vraie tendance, pas les fluctuations.</p>
								</div>
							</Card>
							<WeightChart data={chartData} />
						</div>

						<div className="flex flex-col gap-4 col-span-2">
							<WeightForm />
							<WeightLastEntries />
							<WeightCalendar />
						</div>
					</TabsContent>

					<TabsContent value="calories" className="grid grid-cols-6 gap-5 bg-zgym-focus rounded-xl p-4">
						<div className="col-span-4">
							<NutritionDaySummary date={new Date()} />
						</div>
						<div className="col-span-2">
							<ManualEntriesForm />
						</div>
					</TabsContent>
				</Tabs>

			</div>
		</div>
	)
}
export default Dashboard;