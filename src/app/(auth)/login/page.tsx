"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const { error } = await authClient.signIn.email({
			email,
			password,
			callbackURL: "/dashboard",
		})

		if(error) {
			setError("Email ou mot de passe incorrect");
			setIsLoading(false);
		} else {
			router.push("/dashboard");
			router.refresh();
		}
	};

	return (
		<div className="flex-1 flex items-center justify-center">
			<div className="w-full max-w-md flex flex-col gap-y-6">
			<h1 className="text-2xl font-bold text-center">Connexion</h1>

			<Card className="px-4 max-w-xl">
				<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
					{error && (
						<p>{error}</p>
					)}
					<div className="flex flex-col gap-y-2">
						<Label htmlFor="email">Adresse mail</Label>
						<Input
							id="email"
							type="email"
							value={email}
							placeholder="Votre adresse mail"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="flex flex-col gap-y-2">
						<Label htmlFor="password">Mot de passe</Label>
						<Input
							id="password"
							type="password"
							value={password}
							placeholder="Votre mot de passe"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<Button
						type="submit"
						disabled={isLoading}
					>{isLoading ? "Connexion en cours..." : "Se connecter"}</Button>
				</form>
			</Card>
			</div>
		</div>
	)
}
export default LoginPage