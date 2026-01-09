import { exitPreview } from "@prismicio/next";

export function GET(): Promise<Response> {
	return exitPreview();
}
