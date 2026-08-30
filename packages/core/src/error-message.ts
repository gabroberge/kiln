/** Normalizes `unknown` to a string message: `error.message` for `Error` instances, otherwise `String(error)`. */
export function normalizeErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}
