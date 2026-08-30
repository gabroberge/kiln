/**
 * Outcome of a handler. {@link writeCliResult} writes `stdout` (with a trailing newline if needed)
 * and sets `process.exitCode` from `exitCode`.
 */
export interface CliCommandResult {
	exitCode: 0 | 1;
	stdout?: string;
}

/** Applies a {@link CliCommandResult}: writes `stdout` and sets `process.exitCode`. */
export function writeCliResult(result: CliCommandResult): void {
	if (result.stdout !== undefined && result.stdout.length > 0) {
		let line = result.stdout;

		if (!line.endsWith("\n")) {
			line += "\n";
		}

		process.stdout.write(line);
	}

	process.exitCode = result.exitCode;
}
