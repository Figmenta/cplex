import { defineType } from "sanity";

export const twoImagesBlock = defineType({
    title: 'Two Images Block',
    name: 'twoImagesBlock',
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