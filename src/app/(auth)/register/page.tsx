"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const RegisterPage = () => {
	const router = useRouter();
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		setIsLoading(true);
		setError(null);

		const { error } = await authClient.signUp.email({
			name,
			email,
			password,
			callbackURL: "/dashboard",
		})

		if(error) {
			setError(error.message as string);
			setIsLoading(false);
			return;
		}

		router.push("/dashboard");
		router.refresh();
	};

	return (
		<div className="flex-1 flex items-center justify-center">
			<div className="w-full max-w-md flex flex-col gap-y-6">
				<h1 className="text-2xl font-bold text-center">Créer un compte</h1>

				<Card className="px-4">
					<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
						{error && (
							<p className="text-red-500">{error}</p>
						)}
						<div className="flex flex-col gap-y-2">
							<Label htmlFor="name">Nom</Label>
							<Input
								id="name"
								type="text"
								value={name}
								placeholder="Votre nom"
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
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
						>{isLoading ? "Création en cours..." : "S'enregistrer"}</Button>
					</form>
				</Card>
			</div>
		</div>
	)
}
export default RegisterPage