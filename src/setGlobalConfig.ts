import { HTMLAttributeAnchorTarget, ReactNode } from "react";
import Link from "next/link";

const globalConfigKey = Symbol.for("@prismicio/react/config");

type GlobalThis = {
	[globalConfigKey]?: {
		internalLinkComponent?: React.ComponentType<{
			href: string;
			target?: HTMLAttributeAnchorTarget;
			rel?: string;
			children?: ReactNode;
		}>;
	};
};

(globalThis as GlobalThis)[globalConfigKey] = {
	...(globalThis as GlobalThis)[globalConfigKey],
	internalLinkComponent: Link,
};
