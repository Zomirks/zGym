import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Dashboard = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}
	
	return (
		<div>Bonjour {session.user.name!}</div>
	)
}
export default Dashboard;