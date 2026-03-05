"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SectionTag } from "@/components/ui/section-tag";
import { Divider } from "@/components/ui/divider";

// Icons
import { LogIn as LogInIcon } from "lucide-react";

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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
		});

		if (error) {
			setError("Email ou mot de passe incorrect");
			setIsLoading(false);
		} else {
			router.push("/dashboard");
			router.refresh();
		}
	};

	return (
		<div className="flex-1 flex items-center justify-center">
			<div className="w-full max-w-md">
				<Card className="px-6 pb-6 flex flex-col gap-y-5">
					<div>
						<SectionTag>Authentification</SectionTag>
						<div className="flex items-center gap-3">
							<h3 className="font-display text-3xl tracking-[0.06em] uppercase leading-none text-foreground">
								Connexion
							</h3>
							<LogInIcon
								className="text-primary/60 mb-0.5 shrink-0"
								size={20}
								strokeWidth={1.5}
							/>
						</div>
					</div>

					<Divider />

					{error && (
						<div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2.5">
							<span className="font-data text-xs mt-0.5 shrink-0">◆</span>
							<span className="font-serif text-sm italic leading-snug">{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
						<div className="flex flex-col gap-y-2">
							<Label htmlFor="email">Adresse mail</Label>
							<Input
								id="email"
								type="email"
								value={email}
								placeholder="Votre adresse mail"
								onChange={(e) => setEmail(e.target.value)}
								required
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
								required
							/>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full mt-1 text-xs tracking-[0.2em]"
						>
							{isLoading ? (
								<span className="flex items-center gap-2">
									<span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
									Connexion en cours…
								</span>
							) : (
								"Se connecter"
							)}
						</Button>
					</form>
				</Card>
				<div className="mt-4 block text-center">
					<Link href="/forgot-password" className="text-secondary hover:text-primary text-sm">Mot de passe oublié ?</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
