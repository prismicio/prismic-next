import {
	RepositoriesManager,
	RepositoryManager,
} from "@prismicio/e2e-tests-utils";
import { randomUUID } from "node:crypto";

export type CoreApiDocument = Awaited<
	ReturnType<RepositoryManager["createDocument"]>
>;

export type Preview = { id: string; label: string; url: string };

export async function getPreviewSession(
	manager: RepositoriesManager,
	repository: RepositoryManager,
	documentId: string,
	versionId: string,
	previewId: string,
): Promise<{ preview_url: string; session_id: string }> {
	const token = await manager.getUserApiToken();
	const url = new URL("/core/previews/session/draft", repository.getBaseURL());
	url.searchParams.set("previewId", previewId);
	url.searchParams.set("documentId", documentId);
	url.searchParams.set("versionId", versionId);
	const res = await fetch(url, {
		headers: { authorization: `Bearer ${token}` },
	});
	return await res.json();
}

export async function createNewDraft(
	manager: RepositoriesManager,
	repository: RepositoryManager,
	document: CoreApiDocument,
	payload: string,
): Promise<CoreApiDocument> {
	const baseVersion = document.versions[0];

	const token = await manager.getUserApiToken();
	const url = new URL(
		`/core/documents/${document.id}/draft`,
		repository.getBaseURL(),
	);
	url.searchParams.set("base_version_id", baseVersion.version_id);
	const res = await fetch(url, {
		method: "put",
		headers: {
			authorization: `Bearer ${token}`,
			"content-type": "application/json",
		},
		body: JSON.stringify({
			data: createDocumentData(payload, baseVersion.uid),
			integration_field_ids: [],
			tags: [],
		}),
	});
	return await res.json();
}

export function createDocumentData(
	payload?: string,
	uid: string = randomUUID(),
) {
	return {
		uid,
		uid_TYPE: "UID",
		payload: payload ?? uid,
		payload_TYPE: "Text",
	};
}
