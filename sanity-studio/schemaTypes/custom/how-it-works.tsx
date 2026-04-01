import { defineType } from "sanity";

export const howItWorks = defineType({
    name: 'howItWorks',
    title: 'How It Works',
    type: 'object',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Main heading for the How It Works section'
        },
        {
            name: 'paragraph',
            title: 'Paragraph',
            type: 'text',
            description: 'Introductory paragraph explaining the process'
        },
        {
            name: 'steps',
            title: 'Steps',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'title',
                            title: 'Title',
                            type: 'string'
                        },
                        {
                            name: 'description',
                            title: 'Description',
                            type: 'text'
                        },
                        {
                            name: 'points',
                            title: 'Points',
                            type: 'array',
                            of: [{ type: 'string' }]
                        }
                    ]
                }
            ]
        },
    ],
}
)