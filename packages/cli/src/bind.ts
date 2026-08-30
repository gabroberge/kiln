import type { Command } from "commander";

import { resolveCwd } from "./context.js";
import type { CliCommandOptions } from "./options.js";
import type { CliCommandResult } from "./result.js";
import { writeCliResult } from "./result.js";

/**
 * Maps parsed CLI input to a {@link CliCommandResult}.
 * The CLI layer applies that value via {@link writeCliResult}.
 */
export type CommandHandler<T extends CliCommandOptions = CliCommandOptions> = (options: T) => Promise<CliCommandResult>;

/** Builds the `T` passed to a {@link CommandHandler} from a Commander `.action()` callback's arguments. */
export type ResolveOptions<T extends CliCommandOptions = CliCommandOptions> = (
	command: Command,
	...args: unknown[]
) => T;

/**
 * Wraps a {@link CommandHandler} for Commander `.action(...)`.
 *
 * Commander passes parsed positionals/options first, then the active `command` last.
 * `resolveOptions` gets that prefix (everything before the final `command` argument).
 *
 * @example
 * .action(bindAction(handler, (command, name) => ({
 *   ...withCwd(command),
 *   name: String(name),
 * })));
 */
export function bindAction<T extends CliCommandOptions>(
	handler: CommandHandler<T>,
	resolveOptions: ResolveOptions<T>
): (...args: unknown[]) => Promise<void> {
	return async (...args) => {
		const command = args.at(-1) as Command;
		await handler(resolveOptions(command, ...args.slice(0, -1))).then(writeCliResult);
	};
}

/** {@link CliCommandOptions} containing only `cwd`, resolved from the `.action()` `command`. */
export function withCwd(command: Command): CliCommandOptions {
	return {
		cwd: resolveCwd(command)
	};
}
