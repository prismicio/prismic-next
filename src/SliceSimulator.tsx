"use client"

import { SimulatorManager, StateEventType, getDefaultMessage } from "@prismicio/simulator/kit"
import type { SliceSimulatorProps as BaseSliceSimulatorProps } from "@prismicio/simulator/kit"
import lzString from "lz-string"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { FC, ReactNode } from "react"

import { getSlices } from "./getSlices"
import { SliceSimulatorWrapper } from "./SliceSimulatorWrapper"

const STATE_PARAMS_KEY = "state"

const simulatorManager = new SimulatorManager()

/** Parameters provided to the Slice Simulator page. */
export type SliceSimulatorParams = {
	searchParams: Promise<{
		state?: string
	}>
}

export type SliceSimulatorProps = BaseSliceSimulatorProps & {
	children: ReactNode
	className?: string
}

/**
 * Simulate slices in isolation. The slice simulator enables live slice development in Slice Machine
 * and live previews in the Page Builder.
 */
export const SliceSimulator: FC<SliceSimulatorProps> = ({
	children,
	background,
	zIndex,
	className,
}) => {
	const [message, setMessage] = useState(() => getDefaultMessage())
	const [trustedState, setTrustedState] = useState<string | null>(null)
	const router = useRouter()

	const state =
		typeof window !== "undefined"
			? new URL(window.location.href).searchParams.get(STATE_PARAMS_KEY)
			: undefined
	// Only render state this page received from Slice Machine or the Page
	// Builder. The `state` URL parameter on its own can be set by anyone.
	const hasSlices = state != null && state === trustedState && getSlices(state).length > 0

	useEffect(() => {
		// `@prismicio/simulator` accepts messages from any origin in development,
		// so the URL is as trustworthy as a message there. Trusting it keeps
		// slices visible when the dev server fully reloads the page. It is set
		// after hydration so the first render matches the server.
		if (process.env.NODE_ENV === "development") {
			// oxlint-disable-next-line react/set-state-in-effect
			setTrustedState(new URL(window.location.href).searchParams.get(STATE_PARAMS_KEY))
		}
	}, [])

	useEffect(() => {
		simulatorManager.state.on(
			StateEventType.Slices,
			(newSlices) => {
				const nextState = lzString.compressToEncodedURIComponent(JSON.stringify(newSlices))
				const url = new URL(window.location.href)
				url.searchParams.set(STATE_PARAMS_KEY, nextState)

				window.history.replaceState(null, "", url)
				setTrustedState(nextState)
				// Wait until the next tick to prevent URL state race conditions.
				setTimeout(() => router.refresh(), 0)
			},
			"simulator-slices",
		)
		simulatorManager.state.on(
			StateEventType.Message,
			(newMessage) => setMessage(newMessage),
			"simulator-message",
		)

		simulatorManager.init()

		return () => {
			simulatorManager.state.off(StateEventType.Slices, "simulator-slices")

			simulatorManager.state.off(StateEventType.Message, "simulator-message")
		}
	}, [router])

	return (
		<SliceSimulatorWrapper
			message={message}
			hasSlices={hasSlices}
			background={background}
			zIndex={zIndex}
			className={className}
		>
			{children}
		</SliceSimulatorWrapper>
	)
}
