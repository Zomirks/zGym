import { describe, it, expect } from "vitest";
import { getOtpErrorMessage, GENERIC_ERROR, RATE_LIMIT_ERROR, INVALID_OTP_ERROR, OTP_EXPIRED_ERROR, TOO_MANY_ATTEMPTS_ERROR } from "@/lib/auth-errors";

describe("getOtpErrorMessage", () => {
	it("returns the rate limit message when status is 429, even with a known code", () => {
		expect(getOtpErrorMessage({ status: 429, code: "INVALID_OTP" })).toBe(RATE_LIMIT_ERROR);
	});

	it("returns the generic message when there is no code", () => {
		expect(getOtpErrorMessage({})).toBe(GENERIC_ERROR);
	});

	it("returns the generic message when code is unknown", () => {
		expect(getOtpErrorMessage({ code: "FOO" })).toBe(GENERIC_ERROR);
	});

	it.each([
		{ code: "INVALID_OTP", expected: INVALID_OTP_ERROR },
		{ code: "OTP_EXPIRED", expected: OTP_EXPIRED_ERROR },
		{ code: "TOO_MANY_ATTEMPTS", expected: TOO_MANY_ATTEMPTS_ERROR },
	])("returns the matching message when code is $code", ({ code, expected }) => {
		expect(getOtpErrorMessage({ code })).toBe(expected);
	});
});