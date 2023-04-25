import mri from "mri";
import path from "node:path";
import fs from "node:fs";
import tty from "node:tty";
import { Buffer } from "node:buffer";

import * as pkg from "../../package.json";

type Args = {
	help: boolean;
	version: boolean;
};

const args = mri<Args>(process.argv.slice(2), {
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

async function run() {
	switch (command) {
		case "clear-cache": {
			warn(
				"`prismic-next clear-cache` is an experimental and unstable utility. It is provided as a temporary convenience until a more conventional cache cleaing solution is developed.",
			);

			function getAppRootDir() {
				let currentDir = process.cwd();

				while (
					!fs.existsSync(path.join(currentDir, ".next")) ||
					!fs.existsSync(path.join(currentDir, "package.json"))
				) {
					currentDir = path.join(currentDir, "..");
				}

				if (
					fs.existsSync(path.join(currentDir, ".next")) ||
					fs.existsSync(path.join(currentDir, "package.json"))
				) {
					return currentDir;
				}
			}

			const appRootDir = getAppRootDir();

			if (!appRootDir) {
				warn(
					"Could not find the Next.js app root. Run `prismic-next clear-cache` in a Next.js project with a `.next` directory or `package.json` file.",
				);

				process.exit();
			}

			const fetchCacheDir = path.join(
				appRootDir,
				".next",
				"cache",
				"fetch-cache",
			);

			if (!fs.existsSync(fetchCacheDir)) {
				info("No Next.js fetch cache directory found. You are good to go!");

				process.exit();
			}

			const cacheEntries = fs.readdirSync(fetchCacheDir);

			await Promise.all(
				cacheEntries.map(async (entry) => {
					try {
						const contents = fs.readFileSync(
							path.join(fetchCacheDir, entry),
							"utf8",
						);
						const payload = JSON.parse(contents);
						const bodyPayload = JSON.parse(
							Buffer.from(payload.data.body, "base64").toString(),
						);

						// Delete `/api/v2` requests.
						if (/\.prismic\.io\/auth$/.test(bodyPayload.oauth_initiate)) {
							fs.unlinkSync(path.join(fetchCacheDir, entry));

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

			process.exit();
		}

		default: {
			if (command && (!args.version || !args.help)) {
				console.info("Invalid command.\n");
			}

			if (args.version) {
				console.info(pkg.version);

				process.exit();
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

			process.exit();
		}
	}
}

run();

/**
 * The following code was adapted from
 * https://github.com/sindresorhus/yoctocolors
 *
 * MIT License
 *
 * Copyright (c) Sindre Sorhus (https://sindresorhus.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
//
function color(color: "yellow" | "magenta", string: string) {
	const hasColors = tty.WriteStream.prototype.hasColors();

	const startCode = color === "yellow" ? 33 : 35;

	return hasColors
		? "\u001B[" + startCode + "m" + string + "\u001B[39m"
		: string;
}
function warn(string: string) {
	return console.warn(`${color("yellow", "warn")}  - ${string}`);
}
function info(string: string) {
	return console.info(`${color("magenta", "info")}  - ${string}`);
}
