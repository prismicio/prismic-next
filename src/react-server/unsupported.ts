// Exports in this file are unsupported in the react-server environment.
// All environments should export the same functions to maintian API compatability.

function buildErrorMessage(fnName: string) {
	return `${fnName} is currently incompatible with App Router. Preview Mode is not supported in App Router at this time. Please remove all uses of ${fnName}.`;
}

export function PrismicPreview(): JSX.Element {
	throw new Error(buildErrorMessage("<PrismicPreview>"));
}

export function enableAutoPreviews() {
	throw new Error(buildErrorMessage("enableAutoPreviews()"));
}

export function exitPreview() {
	throw new Error(buildErrorMessage("exitPreview()"));
}

export function redirectToPreviewURL() {
	throw new Error(buildErrorMessage("redirectToPreviewURL()"));
}

export function setPreviewData() {
	throw new Error(buildErrorMessage("setPreviewData()"));
}
