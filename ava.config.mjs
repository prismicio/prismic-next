export default {
	extensions: ["ts", "tsx"],
	files: ["./test/**/*.test.ts", "./test/**/*.test.tsx"],
	require: ["ts-eager/register", "./test/__testutils__/setup.ts"],
	verbose: true,
};
