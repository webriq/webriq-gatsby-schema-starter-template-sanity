export default {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "firstname",
      title: "First Name",
      type: "string"
    },
    {
      name: "lastname",
      title: "Last Name",
      type: "string"
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96
      }
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true
      }
    },
    {
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: []
        }
      ]
    },
    {
      name: "facebook",
      title: "Facebook",
      type: "url"
    },
    {
      name: "twitter",
      title: "Twitter",
      type: "url"
    },
    {
      name: "instagram",
      title: "Instagram",
      type: "url"
    },
    {
      name: "linkedin",
      title: "Linkedin",
      type: "url"
    }
  ],
  preview: {
    select: {
      title: "name",
      media: "image"
    }
  }
};
