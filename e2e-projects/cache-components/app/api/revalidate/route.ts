import type { WebhookBody } from "@prismicio/client"
import { revalidatePrismicPages } from "@prismicio/next"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
	const body: WebhookBody = await request.json()
	if (body.type === "api-update") {
		revalidatePrismicPages(body.documents)
	}

	return NextResponse.json({ revalidated: true })
}
