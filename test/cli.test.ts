import { it, expect, vi, beforeAll } from "vitest";

import { argv } from "./__testutils__/argv";

import { run } from "../src/cli";
import { version } from "../package.json";

beforeAll(() => {
	vi.spyOn(console, "info").mockImplementation(() => void 0);
	vi.spyOn(console, "warn").mockImplementation(() => void 0);
});

it("prints help text when no arguments are given", async () => {
	await run(argv());

	expect(console.info).toHaveBeenCalledTimes(1);
	expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/^Usage:\n/));
});

it("prints help text when --help is given", async () => {
	await run(argv("--help"));

	expect(console.info).toHaveBeenCalledTimes(1);
	expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/^Usage:\n/));
});

it("prints the current version when --version is given", async () => {
	await run(argv("--version"));

	expect(console.info).toHaveBeenCalledTimes(1);
	expect(console.info).toHaveBeenCalledWith(version);
});

it("prints warning when an unknown command is given", async () => {
	await run(argv("__invalid_command__"));

	expect(console.warn).toHaveBeenCalledTimes(1);
	expect(console.warn).toHaveBeenCalledWith(
		expect.stringMatching(/invalid command/i),
	);

	expect(console.info).toHaveBeenCalledTimes(1);
	expect(console.info).toHaveBeenCalledWith(expect.stringMatching(/^Usage:\n/));
});
