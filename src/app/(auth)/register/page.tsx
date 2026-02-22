"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
		<div>
			<h1>Créer un compte</h1>

			<form onSubmit={handleSubmit}>
				{error && (
					<p className="text-red-500">{error}</p>
				)}
				<div className="flex flex-col">
					<label htmlFor="name">Nom</label>
					<input
						id="name"
						type="name"
						value={name}
						placeholder="Votre nom"
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="email">Adresse mail</label>
					<input
						id="email"
						type="email"
						value={email}
						placeholder="Votre adresse mail"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className="flex flex-col">
					<label htmlFor="password">Mot de passe</label>
					<input
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
		</div>
	)
}
export default RegisterPage