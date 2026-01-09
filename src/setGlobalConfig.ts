import Link from "next/link";

// @ts-expect-error - Property doesn't exist on global
globalThis[
	Symbol.for("@prismicio/react/PrismicLink/defaultInternalComponent")
] = Link;
