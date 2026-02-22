"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
			return;
		}

		router.push("/dashboard");
		router.refresh();
	};

	return (
		<div>
			<h1>Connexion</h1>

			<form onSubmit={handleSubmit}>
				{error && (
					<p>{error}</p>
				)}
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
				>{isLoading ? "Connexion en cours..." : "Se connecter"}</Button>
			</form>
		</div>
	)
}
export default LoginPage