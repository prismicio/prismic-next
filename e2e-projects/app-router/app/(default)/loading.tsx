import type { JSX } from "react"

// Streams the page, so a `notFound()` is sent with status 200.
export default function Loading(): JSX.Element {
	return <p>Loading</p>
}
