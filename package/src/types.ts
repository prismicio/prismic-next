import { PreviewData, NextApiRequest } from "next";

export type NextContextLike<TPreviewData extends PreviewData = PreviewData> = {
	previewData?: TPreviewData;
};

export type CreateClientConfig = {
	context?: NextContextLike;
	req?: NextApiRequest;
};
