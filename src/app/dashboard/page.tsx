import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import WeightForm from "@/components/shared/weight/WeightForm";

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
			
			<div className="grid grid-cols-4">
				<WeightForm />
			</div>
		</div>
	)
}
export default Dashboard;