import { PrismicNextImage } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
import assert from "assert";

import { createClient } from "@/prismicio";

export default async function Page() {
	const client = createClient();
	const { data: tests } = await client.getSingle("image_test");

	assert(
		isFilled.image(tests.with_alt_text) && tests.with_alt_text.alt !== null,
	);
	assert(
		isFilled.image(tests.without_alt_text) &&
			tests.without_alt_text.alt === null,
	);
	assert(isFilled.image(tests.filled));
	assert(!isFilled.image(tests.empty));
	assert(
		isFilled.image(tests.with_crop) &&
			new URL(tests.with_crop.url).searchParams.get("rect") !== null,
	);

	return (
		<>
			<PrismicNextImage data-testid="filled" field={tests.filled} />
			<PrismicNextImage data-testid="empty" field={tests.empty} />

			<div data-testid="fallback">
				<PrismicNextImage field={tests.empty} fallback="foo" />
			</div>

			<PrismicNextImage
				data-testid="explicit-width"
				field={tests.filled}
				width={400}
			/>
			<PrismicNextImage
				data-testid="explicit-height"
				field={tests.filled}
				height={300}
			/>
			<PrismicNextImage
				data-testid="explicit-width-height"
				field={tests.filled}
				width={400}
				height={300}
			/>

			<PrismicNextImage
				data-testid="non-safenumber-width"
				field={tests.filled}
				// @ts-expect-error - We are purposely providing an invalid value.
				width="NaN"
			/>
			<PrismicNextImage
				data-testid="non-safenumber-height"
				field={tests.filled}
				// @ts-expect-error - We are purposely providing an invalid value.
				height="NaN"
			/>

			<PrismicNextImage
				data-testid="sizes"
				field={tests.filled}
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			/>

			<PrismicNextImage
				data-testid="quality"
				field={tests.filled}
				quality={10}
			/>

			<PrismicNextImage data-testid="with-alt" field={tests.with_alt_text} />
			<PrismicNextImage
				data-testid="without-alt"
				field={tests.without_alt_text}
			/>
			<PrismicNextImage
				data-testid="with-decorative-fallback-alt"
				field={tests.without_alt_text}
				fallbackAlt=""
			/>
			<PrismicNextImage
				data-testid="with-decorative-alt"
				field={tests.without_alt_text}
				alt=""
			/>

			<PrismicNextImage data-testid="fill" field={tests.filled} fill />

			<PrismicNextImage
				data-testid="imgix"
				field={tests.filled}
				imgixParams={{ sat: -100 }}
			/>
			<PrismicNextImage
				data-testid="imgix-override"
				field={tests.with_crop}
				imgixParams={{ rect: [0, 0, 100, 100] }}
			/>

			<PrismicNextImage
				data-testid="default-loader"
				field={tests.filled}
				loader={null}
			/>
			<PrismicNextImage
				data-testid="default-loader-with-imgixParams"
				field={tests.filled}
				loader={null}
				imgixParams={{ sat: -100 }}
			/>
		</>
	);
}
