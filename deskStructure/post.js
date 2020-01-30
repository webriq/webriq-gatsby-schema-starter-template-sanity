import S from "@sanity/desk-tool/structure-builder";
import {
	FaFile,
	FiEdit,
	FiInbox,
	FiDatabase,
	FiLayers,
	FiCheck
} from "react-icons/fi";

import IframePreview from "../components/previews/iframe/post";

// Determine Current URL
const remoteURL = "https://gatsby-sanity-preview-test.netlify.com";
const localURL = "http://localhost:8000";
const previewURL =
	window.location.hostname === "localhost" ? localURL : remoteURL;

export default S.listItem()
	.title("Blog posts")
	.child(
		S.list()
			.title("Status")
			.items([
				S.listItem()
					.title("Published (Including New Edits)")
					.icon(FiLayers)
					.schemaType("post")
					.child(
						S.documentTypeList("post")
							.title("Published (Including Edits)")
							.filter(
								"_type == $type && !(_id in path('drafts.**')) && defined(hasBeenPublished) && hasBeenPublished"
							)
							.params({
								type: "post"
							})
					),
				S.listItem()
					.title("Drafts (Never Published)")
					.icon(FiEdit)
					.schemaType("post")
					.child(
						S.documentTypeList("post")
							.title("Drafts (Never Published)")
							.filter(
								"_type == $type && _id in path('drafts.**') && !defined(hasBeenPublished)"
							)
							.params({
								type: "post",
								state: "drafts"
							})
					),
				S.listItem()
					.title("Unpublished (Previously Published)")
					.icon(FiInbox)
					.schemaType("post")
					.child(
						S.documentTypeList("post")
							.title("Unpublished (Previously Published)")
							.filter(
								"_type == $type && (_id in path('drafts.**')) && defined(hasBeenPublished) && !hasBeenPublished"
							)
							.params({
								type: "post",
								state: "drafts"
							})
					),
				S.listItem()
					.title("All Posts")
					.icon(FiDatabase)
					.schemaType("post")
					.child(
						S.documentTypeList("post")
							.title("All Posts")
							.filter("_type == $type")
							.params({
								type: "post"
							})
							.child(documentId =>
								S.document()
									.documentId(documentId)
									.schemaType("post")
									.views([
										S.view.form().icon(FaFile),
										S.view
											.component(IframePreview)
											.options({ previewURL, slug: "$slug" })
											.icon(FiDatabase)
											.title("Post Preview")
									])
							)
					)
			])
	);
