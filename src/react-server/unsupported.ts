// Exports in this file are unsupported in the react-server environment.
// All environments should export the same functions to maintian API compatability.

function buildIncompatiblePreviewModeError(fnName: string) {
	return `${fnName} is currently incompatible with App Router. Preview Mode is not supported in App Router at this time. Please remove all uses of ${fnName}.`;
}

export function PrismicPreview(): JSX.Element {
	throw new Error(buildIncompatiblePreviewModeError("<PrismicPreview>"));
}

export function enableAutoPreviews() {
	throw new Error(buildIncompatiblePreviewModeError("enableAutoPreviews()"));
}

export function exitPreview() {
	throw new Error(buildIncompatiblePreviewModeError("exitPreview()"));
}

export function redirectToPreviewURL() {
	throw new Error(buildIncompatiblePreviewModeError("redirectToPreviewURL()"));
}

export function setPreviewData() {
	throw new Error(buildIncompatiblePreviewModeError("setPreviewData()"));
}
