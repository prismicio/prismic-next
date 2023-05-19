export function argv(...args: string[]): string[] {
	return ["/node", "./prismic-next", ...args];
}
