"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SectionTag } from "@/components/ui/section-tag";
import { Divider } from "@/components/ui/divider";

// Icons
import { UserPlus as UserPlusIcon, ShieldCheck as ShieldCheckIcon } from "lucide-react";

const RegisterPage = () => {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [step, setStep] = useState<"register" | "verify-otp">("register");
	const [otp, setOtp] = useState("");

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const { error } = await authClient.signUp.email({
			name,
			email,
			password,
			callbackURL: "/dashboard",
		});

		if (error) {
			setError(error.message as string);
			setIsLoading(false);
			return;
		}

		const { error: otpError } = await authClient.emailOtp.sendVerificationOtp({
			email,
			type: "email-verification",
		});

		if (otpError) {
			setError(otpError.message as string);
			setIsLoading(false);
			return;
		}

		setStep("verify-otp");
		setIsLoading(false);
	};

	const handleVerifyOTP = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const { error } = await authClient.emailOtp.verifyEmail({ email, otp });

		if (error) {
			setError(error.message as string);
			setIsLoading(false);
			return;
		}

		router.push("/dashboard");
		router.refresh();
	};

	return (
		<div className="flex-1 flex items-center justify-center">
			<div className="w-full max-w-md">
				<Card className="px-6 pb-6 flex flex-col gap-y-5">
					<div>
						<SectionTag>
							{step === "register" ? "Inscription" : "Vérification"}
						</SectionTag>
						<div className="flex items-center gap-3">
							<h3 className="font-display text-3xl tracking-[0.06em] uppercase leading-none text-foreground">
								{step === "register"
									? "Créer un compte"
									: "Vérifiez votre email"}
							</h3>
							{step === "register" ? (
								<UserPlusIcon
									className="text-primary/60 mb-0.5 shrink-0"
									size={20}
									strokeWidth={1.5}
								/>
							) : (
								<ShieldCheckIcon
									className="text-primary/60 mb-0.5 shrink-0"
									size={20}
									strokeWidth={1.5}
								/>
							)}
						</div>
					</div>

					<Divider />

					{error && (
						<div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2.5">
							<span className="font-data text-xs mt-0.5 shrink-0">◆</span>
							<span className="font-serif text-sm italic leading-snug">
								{error}
							</span>
						</div>
					)}

					{step === "register" && (
						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-y-4"
						>
							<div className="flex flex-col gap-y-2">
								<Label htmlFor="name">Nom</Label>
								<Input
									id="name"
									type="text"
									value={name}
									placeholder="Votre nom"
									onChange={(e) => setName(e.target.value)}
									required
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
										Création en cours…
									</span>
								) : (
									"S'enregistrer"
								)}
							</Button>
						</form>
					)}

					{step === "verify-otp" && (
						<form
							onSubmit={handleVerifyOTP}
							className="flex flex-col gap-y-4"
						>
							<p className="font-serif text-sm text-muted-foreground italic leading-snug">
								Un code de vérification a été envoyé à {" "}
								<span className="text-foreground font-medium not-italic">
									{email}
								</span>
							</p>

							<div className="flex justify-center">
								<InputOTP maxLength={6} value={otp} onChange={setOtp}>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
									</InputOTPGroup>
									<InputOTPSeparator />
									<InputOTPGroup>
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
							</div>

							<Button
								type="submit"
								disabled={isLoading || otp.length < 6}
								className="w-full mt-1 text-xs tracking-[0.2em]"
							>
								{isLoading ? (
									<span className="flex items-center gap-2">
										<span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
										Vérification en cours…
									</span>
								) : (
									"Vérifier"
								)}
							</Button>
						</form>
					)}
				</Card>
			</div>
		</div>
	);
};
export default RegisterPage;
