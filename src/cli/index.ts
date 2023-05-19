import mri from "mri";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as tty from "node:tty";
import { Buffer } from "node:buffer";

import * as pkg from "../../package.json";

async function pathExists(filePath: string) {
	try {
		await fs.access(filePath);

		return true;
	} catch {
		return false;
	}
}

function color(colorCode: number, string: string) {
	return tty.WriteStream.prototype.hasColors()
		? "\u001B[" + colorCode + "m" + string + "\u001B[39m"
		: string;
}

function warn(string: string) {
	// Yellow
	return console.warn(`${color(33, "warn")}  - ${string}`);
}

function info(string: string) {
	// Magenta
	return console.info(`${color(35, "info")}  - ${string}`);
}

type Args = {
	help: boolean;
	version: boolean;
};

export async function run(argv: string[]) {
	const args = mri<Args>(argv.slice(2), {
		boolean: ["help", "version"],
		alias: {
			help: "h",
			version: "v",
		},
		default: {
			help: false,
			version: false,
		},
	});

	const command = args._[0];

	switch (command) {
		case "clear-cache": {
			warn(
				"`prismic-next clear-cache` is an experimental utility. It may be replaced with a different solution in the future.",
			);

			async function getAppRootDir() {
				let currentDir = process.cwd();

				while (
					!(await pathExists(path.join(currentDir, ".next"))) &&
					!(await pathExists(path.join(currentDir, "package.json")))
				) {
					if (currentDir === path.resolve("/")) {
						break;
					}

					currentDir = path.join(currentDir, "..");
				}

				if (
					(await pathExists(path.join(currentDir, ".next"))) ||
					(await pathExists(path.join(currentDir, "package.json")))
				) {
					return currentDir;
				}
			}

			const appRootDir = await getAppRootDir();

			if (!appRootDir) {
				warn(
					"Could not find the Next.js app root. Run `prismic-next clear-cache` in a Next.js project with a `.next` directory or `package.json` file.",
				);

				return;
			}

			const fetchCacheDir = path.join(
				appRootDir,
				".next",
				"cache",
				"fetch-cache",
			);

			if (!(await pathExists(fetchCacheDir))) {
				info("No Next.js fetch cache directory found. You are good to go!");

				return;
			}

			const cacheEntries = await fs.readdir(fetchCacheDir);

			await Promise.all(
				cacheEntries.map(async (entry) => {
					try {
						const contents = await fs.readFile(
							path.join(fetchCacheDir, entry),
							"utf8",
						);
						const payload = JSON.parse(contents);

						if (payload.kind !== "FETCH") {
							return;
						}

						const bodyPayload = JSON.parse(
							Buffer.from(payload.data.body, "base64").toString(),
						);

						// Delete `/api/v2` requests.
						if (/\.prismic\.io\/auth$/.test(bodyPayload.oauth_initiate)) {
							await fs.unlink(path.join(fetchCacheDir, entry));

							info(`Prismic /api/v2 request cache cleared: ${entry}`);
						}
					} catch (e) {
						// noop
					}
				}),
			);

			info(
				"The Prismic request cache has been cleared. Uncached requests will begin on the next Next.js server start-up.",
			);

			return;
		}

		default: {
			if (command && (!args.version || !args.help)) {
				warn("Invalid command.\n");
			}

			if (args.version) {
				console.info(pkg.version);

				return;
			}

			console.info(
				`
Usage:
    prismic-next <command> [options...]
Available commands:
    clear-cache
Options:
    --help, -h     Show help text
    --version, -v  Show version
`.trim(),
			);
		}
	}
}
