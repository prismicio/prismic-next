export const model = {
	format: "custom",
	id: "rich_text_test",
	label: "Rich Text Test",
	repeatable: false,
	status: true,
	json: {
		Main: {
			uid: {
				type: "UID",
				config: {
					label: "UID",
				},
			},
			empty: {
				type: "StructuredText",
				config: {
					label: "Empty",
					multi: "paragraph",
				},
			},
			with_image: {
				type: "StructuredText",
				config: {
					label: "With Image",
					multi: "paragraph,image",
				},
			},
			with_link: {
				type: "StructuredText",
				config: {
					label: "With Link",
					multi: "paragraph,hyperlink",
				},
			},
			with_linked_image: {
				type: "StructuredText",
				config: {
					label: "With Linked Image",
					multi: "paragraph,image,hyperlink",
				},
			},
		},
	},
} as const;

export function content() {
	return {
		uid: "richtext-test",
		empty: [],
		with_image: [
			{
				type: "image",
				data: {
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
			},
		],
		with_link: [
			{
				type: "paragraph",
				content: {
					text: "foo",
					spans: [
						{
							type: "hyperlink",
							start: 0,
							end: 3,
							data: {
								url: "/foo",
								target: "_self",
							},
						},
					],
				},
				direction: "ltr",
			},
		],
		with_linked_image: [
			{
				type: "image",
				data: {
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
					linkTo: {
						url: "/foo",
					},
				},
			},
		],
		uid_TYPE: "UID",
		empty_TYPE: "StructuredText",
		with_image_TYPE: "StructuredText",
		with_link_TYPE: "StructuredText",
		with_linked_image_TYPE: "StructuredText",
	};
}
