/** Base fields on every handler's options object. Extend with command-specific fields as needed. */
export interface CliCommandOptions {
	cwd: string;
}

/** Root global flags from Commander; {@link CliCommandOptions} after defaults are applied. */
export type CliGlobalOptions = Partial<CliCommandOptions>;
