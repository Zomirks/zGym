"use client";
import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
import { Asterisk as AsteriskIcon } from "lucide-react";

const RESEND_COOLDOWN = 60;

const ForgotPasswordPage = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [step, setStep] = useState<"email" | "otp" | "new-password">("email");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [resendCountdown, setResendCountdown] = useState(0);

	useEffect(() => {
		if (resendCountdown <= 0) return;

		const timer = setInterval(() => {
			setResendCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [resendCountdown]);

	const sendOtp = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const { error } = await authClient.emailOtp.sendVerificationOtp({
			email,
			type: "forget-password",
		});

		if (error) {
			setError(error.message as string);
			setIsLoading(false);
			return false;
		}

		setResendCountdown(RESEND_COOLDOWN);
		setIsLoading(false);
		return true;
	}, [email]);

	const handleSendOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		const success = await sendOtp();
		if (success) setStep("otp");
	};

	const handleResendOtp = async () => {
		await sendOtp();
	};

	const handleVerifyOTP = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStep("new-password");
	};

	const handleResetPassword = async (
		e: React.SyntheticEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const { error } = await authClient.emailOtp.resetPassword({
			email,
			otp,
			password,
		});

		if (error) {
			if (error.code === "INVALID_OTP") {
				setError("Le code de vérification est invalide ou a expiré");
				setStep("otp");
				setResendCountdown(0);
				setOtp("");
			} else {
				setError(error.message as string);
			}
			setIsLoading(false);
		} else {
			router.push("/login");
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
								Mot de passe oublié
							</h3>
							<AsteriskIcon
								className="text-primary/60 mb-0.5 shrink-0"
								size={20}
								strokeWidth={1.5}
							/>
						</div>
					</div>

					<Divider />

					{error && (
						<div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2.5">
							<span className="font-data text-xs mt-0.5 shrink-0">
								◆
							</span>
							<span className="font-serif text-sm italic leading-snug">
								{error}
							</span>
						</div>
					)}

					{step === "email" && (
						<>
							<p className="font-serif text-sm text-muted-foreground italic leading-snug">
								Indiquez votre adresse e-mail pour
								réinitialiser votre mot de passe. Un code
								unique vous sera envoyé.
							</p>

							<form
								onSubmit={handleSendOtp}
								className="flex flex-col gap-y-4"
							>
								<div className="flex flex-col gap-y-2">
									<Label htmlFor="email">Adresse mail</Label>
									<Input
										id="email"
										type="email"
										value={email}
										placeholder="Votre adresse mail"
										onChange={(e) =>
											setEmail(e.target.value)
										}
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
											Envoi en cours…
										</span>
									) : (
										"Demander un code"
									)}
								</Button>
							</form>
						</>
					)}

					{step === "otp" && (
						<form
							onSubmit={handleVerifyOTP}
							className="flex flex-col gap-y-4"
						>
							<p className="font-serif text-sm text-muted-foreground italic leading-snug">
								Un code de vérification a été envoyé à{" "}
								<span className="text-foreground font-medium not-italic">
									{email}
								</span>
							</p>

							<div className="flex justify-center">
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

							<div className="flex items-center justify-between text-xs">
								<button
									type="button"
									onClick={() => {
										setStep("email");
										setOtp("");
										setError(null);
									}}
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Changer d&apos;email
								</button>
								<button
									type="button"
									onClick={handleResendOtp}
									disabled={
										resendCountdown > 0 || isLoading
									}
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
								className="w-full mt-1 text-xs tracking-[0.2em]"
							>
								{isLoading ? (
									<span className="flex items-center gap-2">
										<span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
										Vérification en cours…
									</span>
								) : (
									"Continuer"
								)}
							</Button>
						</form>
					)}

					{step === "new-password" && (
						<form
							onSubmit={handleResetPassword}
							className="flex flex-col gap-y-4"
						>
							<div className="flex flex-col gap-y-2">
								<Label htmlFor="password">
									Nouveau mot de passe
								</Label>
								<Input
									id="password"
									type="password"
									value={password}
									placeholder="Votre nouveau mot de passe"
									onChange={(e) =>
										setPassword(e.target.value)
									}
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
										Modification en cours…
									</span>
								) : (
									"Réinitialiser le mot de passe"
								)}
							</Button>
						</form>
					)}
				</Card>

				<div className="mt-4 block text-center">
					<Link
						href="/login"
						className="text-secondary hover:text-primary text-sm"
					>
						Retour à la connexion
					</Link>
				</div>
			</div>
		</div>
	);
};
export default ForgotPasswordPage;
