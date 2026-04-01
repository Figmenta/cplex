import { defineType } from "sanity";

export const centerTextBlock = defineType({
    name: 'centerTextBlock',
    title: 'Center Text Block',
    type: 'object',
    fields: [
        {
            name: 'text',
            type: 'string',
            title: 'Text'
        },
        {
            name: 'isItalic',
            type: 'boolean',
            title: 'Is Italic',
            description: 'If true, the text will be italic',
            initialValue: false
        }
    ],
}
)