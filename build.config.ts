import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	failOnWarn: false,
	hooks: {
		"rollup:options": (_ctx, options) => {
			const outputOptions = Array.isArray(options.output)
				? options.output
				: [options.output];

			options.output = outputOptions.map((options) => {
				return {
					...options,
					preserveModules: true,
					preserveModulesRoot: "src",
					sourcemap: true,
				};
			});
		},
	},
});
