import { defineType } from "sanity";

export const logosBlock = defineType({
    title: 'Logos Block',
    name: 'logosBlock',
    type: 'object',
    fields: [
        {
            name: 'images',
            type: 'array',
            title: 'Images',
            of: [
                {
                    type: 'image',
                    title: 'Image',
                    options: {
                        hotspot: true
                    }
                }
            ]
        },
    ],
}
)