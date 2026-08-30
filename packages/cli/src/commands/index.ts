import type { Command } from "commander";

import { registerResourceCommands } from "./resource/index.js";

/** Attaches each top-level command group to the root program. */
export function registerCommands(program: Command): void {
	registerResourceCommands(program);
}
