export const GENERIC_ERROR = "Une erreur est survenue, veuillez réessayer.";
export const RATE_LIMIT_ERROR = "Trop de tentatives, réessayez dans quelques minutes.";

const OTP_ERRORS: Record<string, string> = {
	INVALID_OTP: "Le code de vérification est invalide.",
	OTP_EXPIRED: "Le code de vérification a expiré, renvoyez-en un nouveau.",
	TOO_MANY_ATTEMPTS: "Vous avez effectué trop de tentatives, renvoyez un nouveau code.",
};

type AuthError = {
	code?: string;
	status?: number;
};

export function getOtpErrorMessage(error: AuthError) {
	if (error.status === 429) return RATE_LIMIT_ERROR;
	return OTP_ERRORS[error.code ?? ""] ?? GENERIC_ERROR;
}
