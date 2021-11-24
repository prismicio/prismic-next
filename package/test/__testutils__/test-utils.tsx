import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { PrismicPreview } from "../../src";

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: PrismicPreview, ...options });

export * from "@testing-library/react";
export { customRender as render };
