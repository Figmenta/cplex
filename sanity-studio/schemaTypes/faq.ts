import {defineField, defineType} from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'This will not show on the website. Just for reference.',
    }),
    defineField({
      name: 'faqs',
      type: 'array',
      title: 'FAQs',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              type: 'object',
              title: 'Question',
              fields: [
                {
                  name: 'en',
                  type: 'string',
                  title: 'English',
                },
                {
                  name: 'it',
                  type: 'string',
                  title: 'Italian',
                },
                {
                  name: 'es',
                  type: 'string',
                  title: 'Spanish',
                },
                {
                  name: 'zh',
                  type: 'string',
                  title: 'Chinese',
                },
              ],
            },
            {
              name: 'answer',
              type: 'object',
              title: 'Answer',
              fields: [
                {
                  name: 'en',
                  type: 'text',
                  title: 'English',
                },
                {
                  name: 'it',
                  type: 'text',
                  title: 'Italian',
                },
                {
                  name: 'es',
                  type: 'text',
                  title: 'Spanish',
                },
                {
                  name: 'zh',
                  type: 'text',
                  title: 'Chinese',
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
})
