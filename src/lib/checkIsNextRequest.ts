import { NextApiRequestLike, NextRequestLike } from "../types";

export function checkIsNextRequest(
	request: NextRequestLike | NextApiRequestLike,
): request is NextRequestLike {
	return "nextUrl" in request;
}
