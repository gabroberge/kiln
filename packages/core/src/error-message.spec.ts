import { describe, expect, it } from "vitest";

import { normalizeErrorMessage } from "./error-message";

describe(normalizeErrorMessage, () => {
	it("returns the message from an Error", () => {
		expect.assertions(1);

		expect(normalizeErrorMessage(new Error("boom"))).toBe("boom");
	});

	it("stringifies non-Error values", () => {
		expect.assertions(1);

		expect(normalizeErrorMessage("plain")).toBe("plain");
	});
});
