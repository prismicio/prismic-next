#!/usr/bin/env node

import("../dist/cli.cjs").then((mod) => mod.run(process.argv));
