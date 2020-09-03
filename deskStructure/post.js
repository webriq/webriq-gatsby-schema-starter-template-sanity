import S from "@sanity/desk-tool/structure-builder";
import {
  FaFile,
  FiEdit,
  FiInbox,
  FiDatabase,
  FiLayers,
  FiCheck,
} from "react-icons/fi";

import SeoPreview from "../src/components/previews/seo/SeoPreviews";
import IframePreview from "../src/components/previews/iframe/IframePreviewDebug";

console.log("process.env", process.env);
console.log("SANITY_STUDIO_TEST", process.env.SANITY_STUDIO_TEST);

export default S.listItem()
  .title("Blog posts")
  .child(
    S.list()
      .title("Status")
      .items([
        S.listItem()
          .title("Published (including new edits)")
          .icon(FiLayers)
          .schemaType("post")
          .child(
            S.documentTypeList("post")
              .title("Published (including new edits)")
              .filter("_type == $type && !(_id in path('drafts.**'))")
              .params({
                type: "post",
              })
              .child((documentId) =>
                S.document()
                  .documentId(documentId)
                  .schemaType("post")
                  .views([
                    S.view.form().icon(FaFile),
                    S.view
                      .component(IframePreview)
                      .icon(FiDatabase)
                      .title("Post Preview"),
                  ])
              )
          ),
        S.listItem()
          .title("Drafts (never published)")
          .icon(FiEdit)
          .schemaType("post")
          .child(
            S.documentTypeList("post")
              .title("Drafts (never published)")
              .filter(
                "_type == $type && _id in path('drafts.**') && !defined(hasBeenPublished)"
              )
              .params({
                type: "post",
                state: "drafts",
              })
              .child((documentId) =>
                S.document()
                  .documentId(documentId)
                  .schemaType("post")
                  .views([
                    S.view.form().icon(FaFile),
                    S.view
                      .component(IframePreview)
                      .icon(FiDatabase)
                      .title("Post Preview"),
                  ])
              )
          ),
        S.listItem()
          .title("Unpublished (previously published)")
          .icon(FiInbox)
          .schemaType("post")
          .child(
            S.documentTypeList("post")
              .title("Unpublished (previously published)")
              .filter(
                "_type == $type && (_id in path('drafts.**')) && defined(hasBeenPublished) && !hasBeenPublished"
              )
              .params({
                type: "post",
                state: "drafts",
              })
              .child((documentId) =>
                S.document()
                  .documentId(documentId)
                  .schemaType("post")
                  .views([
                    S.view.form().icon(FaFile),
                    S.view
                      .component(IframePreview)
                      .icon(FiDatabase)
                      .title("Post Preview"),
                  ])
              )
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
                type: "post",
              })
              .child((documentId) =>
                S.document()
                  .documentId(documentId)
                  .schemaType("post")
                  .views([
                    S.view.form().icon(FaFile),
                    S.view
                      .component(IframePreview)
                      .icon(FiDatabase)
                      .title("Post Preview"),
                  ])
              )
          ),
      ])
  );
