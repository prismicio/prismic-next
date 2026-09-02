import { PrismicNextImage } from "@prismicio/next"

const field = {
	id: "example",
	url: "https://images.prismic.io/example/photo.png?auto=format,compress",
	alt: null,
	copyright: null,
	dimensions: { width: 800, height: 600 },
	edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
}

export default function Page() {
	return <PrismicNextImage field={field} fallbackAlt="" />
}
