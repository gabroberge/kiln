import type { UserConfig } from "tsdown";
import { defineConfig } from "tsdown";

const config: UserConfig = defineConfig({
	banner: {
		js: "#!/usr/bin/env node"
	},
	clean: true,
	dts: true,
	entry: ["src/cli.ts"],
	format: ["esm"],
	platform: "node"
});

export default config;
