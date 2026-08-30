import type { Command } from "commander";
import path from "node:path";

import type { CliGlobalOptions } from "./options.js";

/**
 * Directory Kiln treats as the project root for this invocation.
 * Honors the root program's global `--cwd` when set; otherwise `process.cwd()`.
 * Pass the `command` from `.action()` so `optsWithGlobals()` includes global flags.
 */
export function resolveCwd(command: Command): string {
	const { cwd = "" } = command.optsWithGlobals<CliGlobalOptions>();

	if (cwd.length === 0) {
		return path.resolve(process.cwd());
	}

	return path.resolve(cwd);
}
