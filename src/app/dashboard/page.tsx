import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import WeightCalendar from "@/components/shared/weight/WeightCalendar";
import WeightForm from "@/components/shared/weight/WeightForm";
import WeightLastEntries from "@/components/shared/weight/WeightLastEntries";

const Dashboard = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}
	
	return (
		<div>
			Bonjour {session.user.name!}
			
			<div className="grid grid-cols-5 gap-5">
				<div>
					<h2 className="text-2xl font-semibold mb-4">Poids</h2>
					<div className="flex flex-col gap-4 text-sm">
						<p>Si on a un objectif de prise de masse ou de perte de poids, il faut se peser régulièrement.</p>
						<p>Une seule pesée ne veut rien dire : notre poids varie chaque jour (eau, sel, digestion, repas plus riche…). Se peser une fois par mois peut nous tromper — surtout si ça tombe juste après un écart — alors que notre progression était bonne.</p>
						<p>En se pesant souvent, on fais une moyenne sur la semaine et on observes la vraie tendance, pas les fluctuations.</p>
					</div>
				</div>

				<div></div>

				<div>
				</div>

				<div>
					<WeightForm />
				</div>

				<div className="flex flex-col gap-4">
					<WeightCalendar />
					<WeightLastEntries />
				</div>
			</div>
		</div>
	)
}
export default Dashboard;