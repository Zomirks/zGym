'use client';
import { useSession, signOut } from "@/lib/auth-client";
import { Power } from "lucide-react";
import { Button } from "../ui/button";

const Header = () => {
	const today:Date = new Date();
	const currentObjectiv: string = 'Cutting';
	const { data: session } = useSession();
	const name = session?.user.name;

	console.log("session", session);

	return (
		<header className="h-11 flex items-center px-4">
			<div className="flex flex-1 gap-4">
				<p className="capitalize">{today.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

				{session && (
					<>
						<p>|</p>
						<p>Body status : {currentObjectiv}</p>
					</>
				)}
			</div>
			<div className="text-2xl font-semibold">zGym</div>
			<div className="flex flex-1 items-center justify-end gap-4">
				{session && (
					<>
						<p>Profile : {name}</p>
						<p>|</p>
						<p>Tendance : {currentObjectiv == 'Cutting' ? '↓ FAT' : '↑ MUSCLE'}</p>
						<p>|</p>
					</>
				)}
				<p>SYNC: <span className="animate-pulse">{session ? 'ACTIVE' : 'INACTIVE'}</span></p>

				{session && (
					<Button onClick={() => signOut()}>
						<Power />
					</Button>
				)}
			</div>
		</header>

	)
}
export default Header