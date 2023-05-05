export { setPreviewData } from "./unsupported";

// These exports do not have RSC-specific implementations.
// They are aliases for the root-level exports.
export {
	PrismicNextImage,
	PrismicNextLink,
	PrismicPreview,
	imgixLoader,
	enableAutoPreviews,
	exitPreview,
	redirectToPreviewURL,
} from "..";
