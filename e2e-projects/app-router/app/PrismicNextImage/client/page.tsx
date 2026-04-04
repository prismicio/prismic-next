import assert from "assert"

import { isFilled } from "@prismicio/client"
import type { JSX } from "react"

import { createClient } from "@/prismicio"

import { ClientTest } from "./ClientTest"

export default async function Page(): Promise<JSX.Element> {
	const client = await createClient()
	const { data: tests } = await client.getSingle("image_test")

	assert(isFilled.image(tests.filled))

	return <ClientTest field={tests.filled} />
}
