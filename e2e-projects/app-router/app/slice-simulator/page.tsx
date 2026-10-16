import { SliceSimulator, getSlices } from "@prismicio/next"
import type { SliceSimulatorParams } from "@prismicio/next"
import type { JSX } from "react"

export default async function SliceSimulatorPage({
	searchParams,
}: SliceSimulatorParams): Promise<JSX.Element> {
	const { state } = await searchParams

	return (
		<SliceSimulator>
			{getSlices(state).map((slice) => (
				<p key={slice.id}>{slice.slice_type}</p>
			))}
		</SliceSimulator>
	)
}
