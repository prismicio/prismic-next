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

export type SliceSimulatorProps = BaseSliceSimulatorProps & {
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
	className?: string;
};

/**
 * Simulate slices in isolation. The slice simulator enables live slice
 * development in Slice Machine and live previews in the Page Builder.
 */
export const SliceSimulator: FC<SliceSimulatorProps> = ({
	background,
	zIndex,
	className,
	sliceZone: SliceZoneComp,
}) => {
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
