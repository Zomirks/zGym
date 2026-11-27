export const GENERIC_ERROR = "Une erreur est survenue, veuillez réessayer.";
export const RATE_LIMIT_ERROR = "Trop de tentatives, réessayez dans quelques minutes.";
export const INVALID_OTP_ERROR = "Le code de vérification est invalide.";
export const OTP_EXPIRED_ERROR = "Le code de vérification a expiré, renvoyez-en un nouveau.";
export const TOO_MANY_ATTEMPTS_ERROR = "Vous avez effectué trop de tentatives, renvoyez un nouveau code.";

const OTP_ERRORS: Record<string, string> = {
	INVALID_OTP: INVALID_OTP_ERROR,
	OTP_EXPIRED: OTP_EXPIRED_ERROR,
	TOO_MANY_ATTEMPTS: TOO_MANY_ATTEMPTS_ERROR,
};

type AuthError = {
	code?: string;
	status?: number;
};

export function getOtpErrorMessage(error: AuthError) {
	if (error.status === 429) return RATE_LIMIT_ERROR;
	return OTP_ERRORS[error.code ?? ""] ?? GENERIC_ERROR;
}
