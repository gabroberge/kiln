import type { Command } from "commander";

import { writeCliResult } from "../../result.js";

/** Registers the `resource` command group and returns its nested `Command`. */
export function registerResourceCommands(program: Command): Command {
	const resource = program
		.command("resource")
		.description("Author resource schema files")
		.allowExcessArguments(false);

	resource.action((_, command: Command) => {
		writeCliResult({ exitCode: 1, stdout: command.helpInformation() });
	});

	return resource;
}
