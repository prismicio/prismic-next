const readValue = (value: string): string => {
	return value.replace(/%3B/g, ";");
};

/**
 * Returns the value of a cookie from a given cookie store.
 *
 * @param name - Name of the cookie.
 * @param cookieJar - The stringified cookie store from which to read the cookie.
 *
 * @returns The value of the cookie, if it exists.
 */
export const getCookie = (
	name: string,
	cookieJar: string,
): string | undefined => {
	const cookies = cookieJar.split("; ");

	for (const cookie of cookies) {
		const parts = cookie.split("=");
		const thisName = readValue(parts[0]).replace(/%3D/g, "=");

		if (thisName === name) {
			const value = parts.slice(1).join("=");

			return readValue(value);
		}
	}
};
