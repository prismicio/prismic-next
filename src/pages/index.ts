export { PrismicImage, PrismicNextImage } from "../PrismicImage";
export type { PrismicImageProps, PrismicNextImageProps } from "../PrismicImage";

export { PrismicLink, PrismicNextLink } from "../PrismicLink";
export type { PrismicLinkProps, PrismicNextLinkProps } from "../PrismicLink";

export { PrismicRichText } from "../PrismicRichText";
export type { PrismicRichTextProps } from "../PrismicRichText";

export { PrismicTable } from "../PrismicTable";
export type { PrismicTableProps } from "@prismicio/react";

export { SliceSimulator } from "./SliceSimulator";
export type {
	SliceSimulatorProps,
	SliceSimulatorSliceZoneProps,
} from "./SliceSimulator";

export { imgixLoader } from "../imgixLoader";

export { PrismicPreview } from "./PrismicPreview";
export type { PrismicPreviewProps } from "./PrismicPreview";

export { enableAutoPreviews } from "./enableAutoPreviews";
export type { EnableAutoPreviewsConfig } from "./enableAutoPreviews";

export { redirectToPreviewURL } from "./redirectToPreviewURL";
export type { RedirectToPreviewURLConfig } from "./redirectToPreviewURL";

export { exitPreview } from "./exitPreview";
export type { ExitPreviewAPIRouteConfig } from "./exitPreview";

export { setPreviewData } from "./setPreviewData";
export type { SetPreviewDataConfig } from "./setPreviewData";

export type { CreateClientConfig } from "./types";

export { createLocaleRedirect } from "../createLocaleRedirect";
export type { CreateLocaleRedirectConfig } from "../createLocaleRedirect";

// Re-exports from @prismicio/react
export { PrismicText, SliceZone, TODOSliceComponent } from "@prismicio/react";
export type {
	SliceComponentProps,
	SliceComponentType,
	SliceZoneProps,
	RichTextComponents,
	PrismicTextProps,
} from "@prismicio/react";
