import { fileURLToPath } from "node:url"

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
	cacheComponents: true,
}

export default nextConfig
