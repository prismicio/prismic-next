import { getDefaultSlices } from "@prismicio/simulator/kit"
import type { StateEvents, StateEventType } from "@prismicio/simulator/kit"
import lzString from "lz-string"

export const getSlices = (state: string | null | undefined): StateEvents[StateEventType.Slices] => {
	return state ? JSON.parse(lzString.decompressFromEncodedURIComponent(state)) : getDefaultSlices()
}
