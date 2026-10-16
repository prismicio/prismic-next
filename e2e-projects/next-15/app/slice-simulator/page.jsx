import { SliceSimulator, getSlices } from "@prismicio/next"

export default async function SliceSimulatorPage({ searchParams }) {
	const { state } = await searchParams

	return (
		<SliceSimulator>
			{getSlices(state).map((slice) => (
				<p key={slice.id}>{slice.slice_type}</p>
			))}
		</SliceSimulator>
	)
}
