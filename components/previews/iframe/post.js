import S from "@sanity/desk-tool/structure-builder";
import React from "react";

// Simple example of web preview
const url = "https://gatsby-sanity-preview-test.netlify.com/";

const WebPreview = ({ document, options }) => {
	const { previewURL } = options;
	const { slug } = document.displayed;

	console.log(url);

	return (
		<iframe
			src={`${url}/${slug.current}`}
			frameBorder={0}
			style={{ width: "100%", height: "100%" }}
		/>
	);
};

export default WebPreview;
