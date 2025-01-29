export const model = {
	format: "page",
	id: "page",
	label: "Page",
	repeatable: true,
	status: true,
	json: {
		Main: {
			uid: {
				type: "UID",
				config: {
					label: "UID",
				},
			},
			payload: {
				type: "Text",
				config: {
					label: "Payload",
					placeholder: "",
				},
			},
		},
	},
} as const;

export function content(args: { payload?: string; uid?: string } = {}) {
	const { payload, uid } = args;

	return {
		...(uid ? { uid } : {}),
		uid_TYPE: "UID",
		payload: payload ?? uid,
		payload_TYPE: "Text",
	};
}
