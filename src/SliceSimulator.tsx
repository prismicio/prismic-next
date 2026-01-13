"use client";

import { SliceSimulatorWrapper } from "./SliceSimulatorWrapper";
import { getSlices } from "./getSlices";
import {
	SimulatorManager,
	StateEventType,
	getDefaultMessage,
} from "@prismicio/simulator/kit";
import type { SliceSimulatorProps as BaseSliceSimulatorProps } from "@prismicio/simulator/kit";
import { compressToEncodedURIComponent } from "lz-string";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FC, ReactNode } from "react";

const STATE_PARAMS_KEY = "state";

const simulatorManager = new SimulatorManager();

/**
 * Parameters provided to the Slice Simulator page.
 */
export type SliceSimulatorParams = {
	searchParams: Promise<{
		state?: string;
	}>;
};

export type SliceSimulatorProps = BaseSliceSimulatorProps & {
	children: ReactNode;
	className?: string;
};

/**
 * Simulate slices in isolation. The slice simulator enables live slice
 * development in Slice Machine and live previews in the Page Builder.
 */
export const SliceSimulator: FC<SliceSimulatorProps> = ({
	children,
	background,
	zIndex,
	className,
}) => {
	const [message, setMessage] = useState(() => getDefaultMessage());
	const router = useRouter();

	const state =
		typeof window !== "undefined"
			? new URL(window.location.href).searchParams.get(STATE_PARAMS_KEY)
			: undefined;
	const hasSlices = getSlices(state).length > 0;

	useEffect(() => {
		simulatorManager.state.on(
			StateEventType.Slices,
			(newSlices) => {
				const url = new URL(window.location.href);
				url.searchParams.set(
					STATE_PARAMS_KEY,
					compressToEncodedURIComponent(JSON.stringify(newSlices)),
				);

				window.history.replaceState(null, "", url);
				// Wait until the next tick to prevent URL state race conditions.
				setTimeout(() => router.refresh(), 0);
			},
			"simulator-slices",
		);
		simulatorManager.state.on(
			StateEventType.Message,
			(newMessage) => setMessage(newMessage),
			"simulator-message",
		);

		simulatorManager.init();

		return () => {
			simulatorManager.state.off(StateEventType.Slices, "simulator-slices");

			simulatorManager.state.off(StateEventType.Message, "simulator-message");
		};
	}, [router]);

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
	);
};
