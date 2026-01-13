import { SliceSimulatorWrapper } from "../SliceSimulatorWrapper";
import {
	SimulatorManager,
	StateEventType,
	getDefaultMessage,
	getDefaultSlices,
} from "@prismicio/simulator/kit";
import type {
	SliceSimulatorProps as BaseSliceSimulatorProps,
	SliceSimulatorState,
} from "@prismicio/simulator/kit";
import { useEffect, useState } from "react";
import type { ComponentType, FC } from "react";

const simulatorManager = new SimulatorManager();

export type SliceSimulatorSliceZoneProps = {
	slices: SliceSimulatorState["slices"];
};

export type SliceSimulatorProps = {
	className?: string;
} & Omit<BaseSliceSimulatorProps, "state"> &
	(
		| {
				/**
				 * React component to render simulated Slices.
				 *
				 * @example
				 *
				 * ```tsx
				 * import { SliceSimulator } from "@slicemachine/adapter-next/simulator";
				 * import { SliceZone } from "@prismicio/react";
				 *
				 * import { components } from "../slices";
				 *
				 * <SliceSimulator
				 * 	sliceZone={({ slices }) => (
				 * 		<SliceZone slices={slices} components={components} />
				 * 	)}
				 * />;
				 * ```
				 */
				sliceZone: ComponentType<SliceSimulatorSliceZoneProps>;
		  }
		| {
				children: React.ReactNode;
		  }
	);

/**
 * Simulate slices in isolation. The slice simulator enables live slice
 * development in Slice Machine and live previews in the Page Builder.
 */
export const SliceSimulator: FC<SliceSimulatorProps> = ({
	background,
	zIndex,
	className,
	...restProps
}) => {
	if (!("sliceZone" in restProps)) {
		throw new Error(
			"A sliceZone prop must be provided when <SliceZone> is rendered in a Client Component. Add a sliceZone prop or convert your simulator to a Server Component with the getSlices helper.",
		);
	}

	const [slices, setSlices] = useState(() => getDefaultSlices());
	const [message, setMessage] = useState(() => getDefaultMessage());

	useEffect(() => {
		simulatorManager.state.on(
			StateEventType.Slices,
			(_slices) => {
				setSlices(_slices);
			},
			"simulator-slices",
		);
		simulatorManager.state.on(
			StateEventType.Message,
			(_message) => {
				setMessage(_message);
			},
			"simulator-message",
		);

		simulatorManager.init();

		return () => {
			simulatorManager.state.off(StateEventType.Slices, "simulator-slices");

			simulatorManager.state.off(StateEventType.Message, "simulator-message");
		};
	}, []);

	const SliceZoneComp = restProps.sliceZone;

	return (
		<SliceSimulatorWrapper
			message={message}
			hasSlices={slices.length > 0}
			background={background}
			zIndex={zIndex}
			className={className}
		>
			<SliceZoneComp slices={slices} />
		</SliceSimulatorWrapper>
	);
};
