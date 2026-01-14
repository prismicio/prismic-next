export { exitPreview } from "./exitPreview";

export { PrismicPreview } from "./PrismicPreview";
export type { PrismicPreviewProps } from "./PrismicPreview";

// New names
export { PrismicImage } from "./PrismicImage";
export type { PrismicImageProps } from "./PrismicImage";

export { PrismicLink } from "./PrismicLink";
export type { PrismicLinkProps } from "./PrismicLink";

// Deprecated aliases
export { PrismicNextImage, PrismicNextLink } from "./deprecated";
export type { PrismicNextImageProps, PrismicNextLinkProps } from "./deprecated";

export { enableAutoPreviews } from "./enableAutoPreviews";
export type { EnableAutoPreviewsConfig } from "./enableAutoPreviews";

export { redirectToPreviewURL } from "./redirectToPreviewURL";
export type { RedirectToPreviewURLConfig } from "./redirectToPreviewURL";

export { SliceSimulator } from "./SliceSimulator";
export type {
	SliceSimulatorProps,
	SliceSimulatorParams,
} from "./SliceSimulator";

export { getSlices } from "./getSlices";

export { imgixLoader } from "./imgixLoader";

export type { CreateClientConfig } from "./types";

export { createLocaleRedirect } from "./createLocaleRedirect";
export type { CreateLocaleRedirectConfig } from "./createLocaleRedirect";

// Re-exports from @prismicio/react
export { PrismicText } from "@prismicio/react";
export type { PrismicTextProps } from "@prismicio/react";

export { SliceZone, TODOSliceComponent } from "@prismicio/react";
export type {
	SliceComponentProps,
	SliceComponentType,
	SliceLike,
	SliceLikeGraphQL,
	SliceLikeRestV2,
	SliceZoneLike,
	SliceZoneProps,
} from "@prismicio/react";

// Next.js-specific PrismicRichText and PrismicTable
export { PrismicRichText, defaultComponents } from "./PrismicRichText";
export type { PrismicRichTextProps, RichTextComponents } from "./PrismicRichText";

export { PrismicTable } from "./PrismicTable";
export type { PrismicTableProps, TableComponents } from "./PrismicTable";
