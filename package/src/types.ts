import { PreviewData, NextApiRequest } from "next";

export type NextContextLike = {
	previewData?: PreviewData;
};

export type CreateClientConfig = {
	context?: NextContextLike;
	req?: NextApiRequest;
};
