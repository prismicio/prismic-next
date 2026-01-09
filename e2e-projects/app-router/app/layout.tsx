import type { JSX, ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
