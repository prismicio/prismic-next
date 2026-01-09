import type { NextRequest } from "next/server";
import { redirectToPreviewURL } from "@prismicio/next";

import { createClient } from "@/prismicio";

export async function GET(request: NextRequest) {
	const client = await createClient({
		routes: [{ type: "page", path: "/:uid" }],
	});

	return await redirectToPreviewURL({ client, request });
}
