export const model = {
	format: "custom",
	id: "image_test",
	label: "Image Test",
	repeatable: false,
	status: true,
	json: {
		Main: {
			empty: {
				type: "Image",
				config: {
					label: "Empty",
					constraint: {},
					thumbnails: [],
				},
			},
			filled: {
				type: "Image",
				config: {
					label: "Filled",
					constraint: {},
					thumbnails: [],
				},
			},
			with_alt_text: {
				type: "Image",
				config: {
					label: "With Alt Text",
					constraint: {},
					thumbnails: [],
				},
			},
			without_alt_text: {
				type: "Image",
				config: {
					label: "Without Alt Text",
					constraint: {},
					thumbnails: [],
				},
			},
			with_crop: {
				type: "Image",
				config: {
					label: "With Crop",
					constraint: {},
					thumbnails: [],
				},
			},
		},
	},
} as const;

export function content() {
	return {
		filled: {
			edit: {
				background: "transparent",
				zoom: 1,
				crop: {
					x: 0,
					y: 0,
				},
			},
			height: 600,
			origin: {
				id: "Z1evSZbqstJ98PkD",
				url: "https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress",
				width: 800,
				height: 600,
			},
			width: 800,
			alt: "alt text",
			provider: "imgix",
			thumbnails: {},
			url: "https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress",
		},
		with_alt_text: {
			edit: {
				background: "transparent",
				zoom: 1,
				crop: {
					x: 0,
					y: 0,
				},
			},
			height: 600,
			origin: {
				id: "Z1evSZbqstJ98PkD",
				url: "https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress",
				width: 800,
				height: 600,
			},
			width: 800,
			alt: "alt text",
			provider: "imgix",
			thumbnails: {},
			url: "https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress",
		},
		without_alt_text: {
			edit: {
				background: "transparent",
				zoom: 1,
				crop: {
					x: 0,
					y: 0,
				},
			},
			height: 600,
			origin: {
				id: "Z1evSZbqstJ98PkD",
				url: "https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress",
				width: 800,
				height: 600,
			},
			width: 800,
			provider: "imgix",
			thumbnails: {},
			url: "https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress",
		},
		with_crop: {
			edit: {
				background: "transparent",
				zoom: 1,
				crop: {
					x: 175,
					y: 0,
				},
			},
			height: 400,
			origin: {
				id: "Z1evSZbqstJ98PkD",
				url: "https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress",
				width: 800,
				height: 600,
			},
			width: 300,
			alt: "alt text",
			provider: "imgix",
			thumbnails: {},
			url: "https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&rect=175%2C0%2C450%2C600&w=300&h=400",
		},
		empty_TYPE: "Image",
		filled_TYPE: "Image",
		with_alt_text_TYPE: "Image",
		without_alt_text_TYPE: "Image",
		with_crop_TYPE: "Image",
	};
}
