const pkg = require("./package.json");

module.exports = [
	...new Set(
		Object.values(pkg.exports).flatMap((exportTypes) => {
			if (typeof exportTypes === "string") {
				return exportTypes;
			} else {
				return Object.values(exportTypes);
			}
		}),
	),
]
	.filter(Boolean)
	.map((path) => {
		return { path };
	});
