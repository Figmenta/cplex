import { defineType } from "sanity";

export const textImageBlock = defineType({
  title: 'Image + Text Block',
  name: 'textImageBlock',
  type: 'object',
  fields: [
    {
      name: 'layout',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' }
        ],
        layout: 'radio'
      }
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image'
    },
    {
      name: "height",
      title: "Height",
      type: "string",
      description: "Example: 10vw, 12vw, 15vw etc."
    },
    {
      name: 'text',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'content',
              type: 'string',
              title: 'Text'
            },
            {
              name: 'tag',
              type: 'string',
              title: 'HTML Tag',
              options: {
                list: [
                  { title: 'Paragraph', value: 'p' },
                  { title: 'Heading 1', value: 'h1' },
                  { title: 'Heading 2', value: 'h2' },
                  { title: 'Heading 3', value: 'h3' },
                  { title: 'Heading 4', value: 'h4' },
                  { title: 'Heading 5', value: 'h5' },
                  { title: 'Heading 6', value: 'h6' },
                  { title: '1st List', value: 'FirstLi' },
                  { title: 'List', value: 'li' }
                ],
                layout: 'dropdown'
              }
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'layout',
      media: 'image'
    },
    prepare({ title, media }) {
      return {
        title: `Image + Text (${title})`,
        media
      }
    }
  }
}
)