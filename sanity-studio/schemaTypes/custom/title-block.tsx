import { defineType } from "sanity";

export const titleBlock = defineType({
  name: 'titleBlock',
  title: 'Title Block',
  type: 'object',
  fields: [
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' }
        ],
        layout: 'dropdown'
      }
    },
    {
      name: 'text',
      type: 'object',
      fields: [
        {
          name: 'content',
          title: 'Text',
          type: 'string'
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
              { title: 'Heading 6', value: 'h6' }
            ],
            layout: 'dropdown'
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({ text }) {
      return {
        title: `Title (${text.content})`,
      }
    }
  }
}
)