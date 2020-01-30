import S from "@sanity/desk-tool/structure-builder";
import React from "react";

// Simple example of web preview
const url = "http://localhost:8000";

const WebPreview = ({ document, options }) => {
	const { previewURL } = options;
	const { slug } = document.displayed;

	console.log(previewURL);

	return (
		<iframe
			src={`${previewURL}/${slug.current}`}
			frameBorder={0}
			style={{ width: "100%", height: "100%" }}
		/>
	);
};

export default WebPreview;
