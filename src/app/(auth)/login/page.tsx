"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { getOtpErrorMessage, GENERIC_ERROR } from "@/lib/auth-errors";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
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
import { Field, FieldLabel } from "@/components/ui/field";

// Icons
import { LogIn as LogInIcon, ShieldCheck as ShieldCheckIcon, EyeIcon, EyeOffIcon } from "lucide-react";

const RESEND_COOLDOWN = 60;

const LoginPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [step, setStep] = useState<"credentials" | "verify-otp">("credentials");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [resendCountdown, setResendCountdown] = useState(0);

	useEffect(() => {
		if (resendCountdown <= 0) return;

		const timer = setInterval(() => {
			setResendCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [resendCountdown]);

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
			// Le mot de passe est bon, seule la vérification de l'adresse manque :
			// `emailVerification.sendOnSignIn` vient d'envoyer un code, on enchaîne
			// dessus plutôt que de prétendre que les identifiants sont faux.
			if (error.code === "EMAIL_NOT_VERIFIED") {
				setResendCountdown(RESEND_COOLDOWN);
				setStep("verify-otp");
			} else {
				setError("Email ou mot de passe incorrect");
			}
			setIsLoading(false);
			return;
		}

		router.push("/dashboard");
		router.refresh();
	};

	const resendOtp = async () => {
		setIsLoading(true);
		setError(null);

		const { error } = await authClient.emailOtp.sendVerificationOtp({
			email,
			type: "email-verification",
		});

		if (error) {
			const message = getOtpErrorMessage(error);
			if (message === GENERIC_ERROR) console.error(error);

			setError(message);
			setIsLoading(false);
			return;
		}

		setResendCountdown(RESEND_COOLDOWN);
		setIsLoading(false);
	};

	const handleVerifyOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const { error } = await authClient.emailOtp.verifyEmail({ email, otp });

		if (error) {
			const message = getOtpErrorMessage(error);
			if (message === GENERIC_ERROR) console.error(error);

			if (error.code === "OTP_EXPIRED" || error.code === "TOO_MANY_ATTEMPTS") {
				setResendCountdown(0);
			}

			setOtp("");
			setError(message);
			setIsLoading(false);
			return;
		}

		router.push("/dashboard");
		router.refresh();
	};

	const showPassword = () => {
		setIsPasswordVisible((prev) => !prev);
	}

	return (
		<div className="flex-1 flex items-center justify-center">
			<div className="w-full max-w-md">
				<Card className="px-6 pb-6 flex flex-col gap-y-5">
					<div>
						<SectionTag>
							{step === "credentials" ? "Authentification" : "Vérification"}
						</SectionTag>
						<div className="flex items-center gap-3">
							<h3 className="font-display text-3xl tracking-[0.06em] uppercase leading-none text-foreground">
								{step === "credentials"
									? "Connexion"
									: "Vérifiez votre email"}
							</h3>
							{step === "credentials" ? (
								<LogInIcon
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
							<span className="font-serif text-sm italic leading-snug">{error}</span>
						</div>
					)}

					{step === "credentials" && (
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

							<Field>
								<FieldLabel htmlFor="password">Mot de passe</FieldLabel>
								<InputGroup>
									<InputGroupInput
										id="password"
										type={isPasswordVisible ? "text" : "password"}
										value={password}
										placeholder="Votre mot de passe"
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									<InputGroupButton
										type="button"
										onClick={showPassword}
										aria-label={isPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
									>
										{isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
									</InputGroupButton>
								</InputGroup>
							</Field>

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
					)}

					{step === "verify-otp" && (
						<form onSubmit={handleVerifyOtp} className="flex flex-col">
							<p className="font-serif text-sm text-muted-foreground italic leading-snug">
								Votre adresse n&apos;a jamais été vérifiée. Un code vient d&apos;être envoyé à{" "}
								<span className="text-foreground font-medium not-italic">
									{email}
								</span>
								.
							</p>

							<div className="flex justify-center mt-4">
								<InputOTP
									maxLength={6}
									value={otp}
									onChange={(value) => {
										setOtp(value);
										setError(null);
									}}
								>
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

							<div className="flex items-center justify-between text-xs mt-6">
								<button
									type="button"
									onClick={() => {
										setStep("credentials");
										setOtp("");
										setError(null);
									}}
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Retour
								</button>
								<button
									type="button"
									onClick={resendOtp}
									disabled={resendCountdown > 0 || isLoading}
									className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{resendCountdown > 0
										? `Renvoyer le code (${resendCountdown}s)`
										: "Renvoyer le code"}
								</button>
							</div>

							<Button
								type="submit"
								disabled={isLoading || otp.length < 6}
								className="w-full text-xs tracking-[0.2em] mt-2"
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
				{step === "credentials" && (
					<div className="mt-4 block text-center">
						<Link href="/forgot-password" className="text-secondary hover:text-primary text-sm">Mot de passe oublié ?</Link>
					</div>
				)}
			</div>
		</div>
	);
};
export default LoginPage;
