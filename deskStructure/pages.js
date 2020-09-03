import S from "@sanity/desk-tool/structure-builder";
import { FaFile } from "react-icons/fi";

import EditIcon from "part:@sanity/base/edit-icon";
import EyeIcon from "part:@sanity/base/eye-icon";
import SeoPreview from "../src/components/previews/seo/SeoPreviews";
import IframePreview from "../src/components/previews/iframe/IframePreview";

export default S.listItem()
  .title("Pages")
  .child(
    S.list()
      .title("Pages")
      .items([
        S.listItem()
          .title("About")
          .child(
            S.editor()
              .id("aboutPage")
              .schemaType("page")
              .documentId("about")
              .views([
                S.view.form().icon(EditIcon),
                S.view
                  .component(IframePreview)
                  .icon(EyeIcon)
                  .title("Web Preview"),
                // S.view
                // 	.component(SeoPreview)
                // 	.icon(EyeIcon)
                // 	.title('SEO Preview'),
              ])
          )
          .icon(FaFile),
        S.listItem()
          .title("Contact")
          .child(
            S.editor()
              .id("contactPage")
              .schemaType("page")
              .documentId("contact")
              .views([
                S.view.form().icon(EditIcon),
                S.view
                  .component(IframePreview)
                  .icon(EyeIcon)
                  .title("Web Preview"),
                S.view
                  .component(SeoPreview)
                  .icon(EyeIcon)
                  .title("SEO Preview"),
              ])
          )
          .icon(FaFile),
      ])
  );
