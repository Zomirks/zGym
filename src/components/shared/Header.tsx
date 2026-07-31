'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
	const today:Date = new Date();
	const router = useRouter();
	const { data: session } = useSession();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const name = session?.user.name;

	const handleSignOut = async () => {
		setIsSigningOut(true);

		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
					router.refresh();
				},
				onError: () => {
					setIsSigningOut(false);
				},
			},
		});
	};

	return (
		<header className="h-11 flex items-center px-4">
			<div className="flex flex-1 gap-4">
				<p className="capitalize">{today.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
			</div>
			<div className="text-2xl font-semibold">zGym</div>
			<div className="flex flex-1 items-center justify-end gap-4">
				{session && (
					<>
						<p>Profile : {name}</p>
					</>
				)}

				{session && (
					<Button onClick={handleSignOut} disabled={isSigningOut} aria-label="Se déconnecter">
						<Power />
					</Button>
				)}
			</div>
		</header>

	)
}
export default Header