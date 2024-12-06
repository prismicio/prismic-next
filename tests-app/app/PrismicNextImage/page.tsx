import { ImageFieldImage } from "@prismicio/client";
import { createValueMockFactory } from "@prismicio/mock";
import { PrismicNextImage } from "@prismicio/next";
import Image from "next/image";

export default function Page() {
	const mock = createValueMockFactory({ seed: "PrismicNextImage" });

	const filled = withDefaults(mock.image());
	const empty = mock.image({ state: "empty" });

	const withAlt = withDefaults(mock.image());
	withAlt.alt = "foo";
	const withoutAlt = withDefaults(mock.image());
	withoutAlt.alt = null;

	const withFit = withDefaults(mock.image());
	const _withFitURL = new URL(withFit.url);
	_withFitURL.searchParams.set("fit", "clamp");
	withFit.url = _withFitURL.toString();

	const withImgixParams = withDefaults(mock.image());
	const _withImgixParamsURL = new URL(withImgixParams.url);
	_withImgixParamsURL.searchParams.set("sat", "100");
	withImgixParams.url = _withImgixParamsURL.toString();

	return (
		<>
			<PrismicNextImage data-testid="filled" field={filled} />
			<PrismicNextImage data-testid="empty" field={empty} />

			<div data-testid="fallback">
				<PrismicNextImage field={empty} fallback="foo" />
			</div>

			<PrismicNextImage
				data-testid="explicit-width"
				field={filled}
				width={400}
			/>
			<PrismicNextImage
				data-testid="explicit-height"
				field={filled}
				height={300}
			/>
			<PrismicNextImage
				data-testid="explicit-width-height"
				field={filled}
				width={400}
				height={300}
			/>

			<PrismicNextImage
				data-testid="non-safenumber-width"
				field={filled}
				// @ts-expect-error - We are purposely providing an invalid value.
				width="NaN"
			/>
			<PrismicNextImage
				data-testid="non-safenumber-height"
				field={filled}
				// @ts-expect-error - We are purposely providing an invalid value.
				height="NaN"
			/>

			<PrismicNextImage
				data-testid="sizes"
				field={filled}
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			/>

			<PrismicNextImage data-testid="quality" field={filled} quality={10} />

			<PrismicNextImage data-testid="with-alt" field={withAlt} />
			<PrismicNextImage data-testid="without-alt" field={withoutAlt} />
			<PrismicNextImage
				data-testid="with-decorative-fallback-alt"
				field={withoutAlt}
				fallbackAlt=""
			/>
			<PrismicNextImage
				data-testid="with-decorative-alt"
				field={withAlt}
				alt=""
			/>

			<PrismicNextImage data-testid="fill" field={filled} fill />

			<PrismicNextImage
				data-testid="imgix"
				field={filled}
				imgixParams={{ sat: -100 }}
			/>
			<PrismicNextImage
				data-testid="imgix-override"
				field={withImgixParams}
				imgixParams={{ sat: -100 }}
			/>

			<PrismicNextImage data-testid="fit" field={withFit} />
			<PrismicNextImage
				data-testid="fit-override"
				field={filled}
				imgixParams={{ fit: "facearea" }}
			/>

			<PrismicNextImage
				data-testid="default-loader"
				field={filled}
				loader={null}
			/>
			<PrismicNextImage
				data-testid="default-loader-with-imgixParams"
				field={filled}
				loader={null}
				imgixParams={{ sat: -100 }}
			/>
		</>
	);
}

function withDefaults(
	image: ImageFieldImage<"filled">,
): ImageFieldImage<"filled"> {
	return {
		...image,
		url: "https://images.unsplash.com/photo-1472149110793-7aa262859995",
		dimensions: {
			width: 800,
			height: 600,
		},
	};
}
