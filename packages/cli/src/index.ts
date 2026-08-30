import { normalizeErrorMessage } from "@kiln/core";
import { Command, CommanderError } from "commander";

import packageJson from "../package.json" with { type: "json" };
import { registerCommands } from "./commands/index.js";
import { writeCliResult } from "./result.js";

/**
 * Assembles the Commander program: name, global options, and command tree.
 * Returns a program ready for `parseAsync()`; callers supply argv when they parse.
 */
export function createProgram(): Command {
	const program = new Command();

	program
		.name("kiln")
		.description("Kiln CLI")
		.version(packageJson.version)
		.option("--cwd <path>", "directory to start Kiln from")
		.showHelpAfterError()
		.allowExcessArguments(false)
		.exitOverride();

	registerCommands(program);

	return program;
}

/**
 * Parses argv and sets `process.exitCode` from the outcome.
 * On bare invocation (no subcommand matched), prints root help and sets exit code 1.
 */
export async function run(argv: readonly string[] = process.argv): Promise<void> {
	const program = createProgram();
	const state = { invoked: false };

	program.hook("preAction", () => {
		state.invoked = true;
	});

	try {
		await program.parseAsync(argv);

		if (!state.invoked) {
			writeCliResult({
				exitCode: 1,
				stdout: program.helpInformation()
			});
		}
	} catch (error) {
		if (error instanceof CommanderError) {
			process.exitCode = error.exitCode;
			return;
		}

		process.stderr.write(`${normalizeErrorMessage(error)}\n`);
		process.exitCode = 1;
	}
}
