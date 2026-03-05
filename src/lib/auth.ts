import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        minPasswordLength: 8,
    },
	plugins: [
		emailOTP({
			async sendVerificationOTP({email, otp, type}) {
				if (type === "sign-in") {
					const { data, error } = await resend.emails.send({
						from: 'zGym <noreply@zgym.cyril-fischer.fr>',
						to: email,
						subject: 'Votre code de connexion',
						html: `<p>Votre code de connexion est le suivant : ${otp}</p>`
					});

					if (error) {
						console.log("Resend sign-in:", { data, error });
					}
				} else if (type === "email-verification") {
					const { data, error } = await resend.emails.send({
						from: 'zGym <noreply@zgym.cyril-fischer.fr>',
						to: email,
						subject: 'Vérification de votre adresse mail',
						html: `<p>Votre code de vérification est le suivant : ${otp}</p>`
					});

					if(error) {
						console.log("Resend Email-verification:", {data, error});
					}
				} else if (type === "forget-password") {
					const { data, error } = await resend.emails.send({
						from: 'zGym <noreply@zgym.cyril-fischer.fr>',
						to: email,
						subject: 'Mot de passe oublié',
						html: `<p>Votre code pour changer de mot de passe est le suivant : ${otp}</p>`
					});

					if (error) {
						console.log("Resend default:", { data, error });
					}
				}
			}
		})
	]
});