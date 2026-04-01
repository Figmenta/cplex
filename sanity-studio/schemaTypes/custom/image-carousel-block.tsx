import {defineType, defineField} from 'sanity'

export const imageCarouselBlock = defineType({
  title: 'Media Carousel Block',
  name: 'imageCarouselBlock',
  type: 'object',
  fields: [
    {
      name: 'media',
      type: 'array',
      title: 'Media Items',
      of: [
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
        },
        {
          type: 'object',
          name: 'carouselMediaItem',
          title: 'Video or GIF with Metadata',
          fields: [
            defineField({
              name: 'file',
              type: 'file',
              title: 'Video or GIF File',
              options: {
                accept: 'video/*,image/gif',
              },
            }),
            defineField({
              name: 'videoTitle',
              type: 'string',
              title: 'Video Title (for SEO)',
              description:
                'Optional: Video title for SEO indexing. Only shown when file is a video.',
            }),
            defineField({
              name: 'videoDescription',
              type: 'string',
              title: 'Video Description (for SEO)',
              description:
                'Optional: Video description for SEO indexing. Only shown when file is a video.',
            }),
            defineField({
              name: 'videoThumbnail',
              type: 'image',
              title: 'Video Thumbnail (for SEO)',
              description: 'Optional: Thumbnail image for the video. Recommended for SEO.',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'videoDuration',
              type: 'number',
              title: 'Video Duration (seconds)',
              description: 'Optional: Video duration in seconds for SEO indexing.',
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: 'videoUploadDate',
              type: 'date',
              title: 'Video Upload/Publish Date',
              description: 'Optional: Date when the video was published or uploaded.',
            }),
            defineField({
              name: 'videoUrl',
              type: 'url',
              title: 'External Video URL',
              description:
                'Optional: URL for external videos (e.g., YouTube, Vimeo). If provided, this will be used instead of the uploaded file.',
            }),
          ],
          preview: {
            select: {
              title: 'videoTitle',
              media: 'file',
            },
            prepare({title, media}) {
              return {
                title: title || 'Video/GIF',
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required().min(2).error('At least 2 media items are required for a carousel'),
    },
  ],
  preview: {
    select: {
      media: 'media',
    },
    prepare({media}) {
      return {
        title: `Media Carousel (${media?.length || 0} items)`,
        media: media?.[0],
      }
    },
  },
})
