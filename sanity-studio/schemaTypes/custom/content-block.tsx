import { defineType } from "sanity";

export const contentBlock = defineType({
    name: 'content',
    title: 'Content',
    type: 'object',
    fields: [
        {
            name: "en",
            title: "English",
            description: "English content",
            type: "array",
            of: [
                { type: "block" },
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                },
                { type: "titleBlock" },
                { type: "centerTextBlock" },
                { type: "textImageBlock" },
                { type: "twoImagesBlock" },
                { type: "imageCarouselBlock" },
                { type: "logosBlock" },
                { type: "fileBlock" },
                { type: "mediaBlock" },
            ],
        },
        {
            name: "it",
            title: "Italian",
            description: "Italian content",
            type: "array",
            of: [
                { type: "block" },
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                },
                { type: "titleBlock" },
                { type: "centerTextBlock" },
                { type: "textImageBlock" },
                { type: "twoImagesBlock" },
                { type: "imageCarouselBlock" },
                { type: "logosBlock" },
                { type: "fileBlock" },
                { type: "mediaBlock" },
            ],
        },
        {
            name: "es",
            title: "Spanish",
            description: "Spanish content",
            type: "array",
            of: [
                { type: "block" },
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                },
                { type: "titleBlock" },
                { type: "centerTextBlock" },
                { type: "textImageBlock" },
                { type: "twoImagesBlock" },
                { type: "imageCarouselBlock" },
                { type: "logosBlock" },
                { type: "fileBlock" },
                { type: "mediaBlock" },
            ],
        },
        {
            name: "zh",
            title: "Chinese",
            description: "Chinese content",
            type: "array",
            of: [
                { type: "block" },
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                },
                { type: "titleBlock" },
                { type: "centerTextBlock" },
                { type: "textImageBlock" },
                { type: "twoImagesBlock" },
                { type: "imageCarouselBlock" },
                { type: "logosBlock" },
                { type: "fileBlock" },
                { type: "mediaBlock" },
            ],
        },
    ],
});