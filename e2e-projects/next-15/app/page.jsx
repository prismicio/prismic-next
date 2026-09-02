import { PrismicNextImage } from "@prismicio/next"

const field = {
	url: "https://images.prismic.io/example/photo.png?auto=format,compress",
	alt: null,
	dimensions: { width: 800, height: 600 },
}

export default function Page() {
	return <PrismicNextImage field={field} fallbackAlt="" />
}
