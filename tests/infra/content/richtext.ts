export const model = {
	format: "custom",
	id: "rich_text_test",
	label: "Rich Text Test",
	repeatable: false,
	status: true,
	json: {
		Main: {
			hyperlink_internal: {
				type: "StructuredText",
				config: {
					label: "Hyperlink Internal",
					multi: "hyperlink",
				},
			},
			hyperlink_external: {
				type: "StructuredText",
				config: {
					label: "Hyperlink External",
					multi: "hyperlink",
				},
			},
		},
	},
} as const;

export function content() {
	return {
		hyperlink_internal: [
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
		hyperlink_external: [
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
								url: "https://example.com",
								target: "_self",
							},
						},
					],
				},
				direction: "ltr",
			},
		],
		hyperlink_internal_TYPE: "StructuredText",
		hyperlink_external_TYPE: "StructuredText",
	};
}
