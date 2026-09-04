import { cookie as prismicCookie } from "@prismicio/client"
import { getPreviewRef, redirectToPreviewURL } from "@prismicio/next"
import { cookies, draftMode } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest): Promise<NextResponse> {
	const mode = request.nextUrl.searchParams.get("mode")
	const previewCookie = request.nextUrl.searchParams.get("previewCookie")
	if (mode === "bootstrap") {
		return await redirectToPreviewURL({
			client: {
				resolvePreviewURL: async () =>
					request.nextUrl.searchParams.has("client")
						? "/preview-client-test"
						: "/api/get-preview-ref-test",
			},
			request,
		})
	}

	if (previewCookie !== null) {
		const cookieJar = await cookies()
		cookieJar.set(prismicCookie.preview, previewCookie, { path: "/" })
	}

	if (mode === "enable") {
		;(await draftMode()).enable()
	}
	if (mode === "disable") {
		;(await draftMode()).disable()
	}

	const draft = await draftMode()

	return NextResponse.json({
		draftModeEnabled: draft.isEnabled,
		previewRef: (await getPreviewRef()) ?? null,
	})
}
