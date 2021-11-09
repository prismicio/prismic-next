import React, { createContext, useContext } from "react";

export const PreviewContext = createContext({});

type PreviewProviderConfig = {
	repoName: string;
	children: React.ReactChild[] | React.ReactChild;
};

export function PreviewProvider({ repoName, children }: PreviewProviderConfig) {
	return (
		<PreviewContext.Provider value={repoName}>
			<script
				async
				defer
				src={`https://static.cdn.prismic.io/prismic.js?new=true&repo=${repoName}`}
			></script>
			{children}
		</PreviewContext.Provider>
	);
}
