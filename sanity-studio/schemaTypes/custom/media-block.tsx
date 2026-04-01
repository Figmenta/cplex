import {defineType, defineField} from 'sanity'

export const mediaBlock = defineType({
  title: 'Media Block',
  name: 'mediaBlock',
  type: 'object',
  fields: [
    defineField({
      name: 'files',
      type: 'array',
      title: 'Files',
      of: [
        {
          type: 'object',
          name: 'mediaItem',
          title: 'Media Item',
          fields: [
            defineField({
              name: 'file',
              type: 'file',
              title: 'File',
              options: {
                accept: 'video/*,image/gif,image/*',
              },
            }),
            defineField({
              name: 'rounded',
              type: 'boolean',
              title: 'Rounded',
              initialValue: false,
            }),
            defineField({
              name: 'autoplay',
              type: 'boolean',
              title: 'Autoplay',
              initialValue: false,
            }),
            defineField({
              name: 'loop',
              type: 'boolean',
              title: 'Loop',
              initialValue: false,
            }),
            defineField({
              name: 'muted',
              type: 'boolean',
              title: 'Muted',
              initialValue: false,
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
        },
      ],
    }),
    defineField({
      name: 'width',
      type: 'string',
      title: 'Width',
      description: 'Width of the media in percentage (100% = full width)',
    }),
    defineField({
      name: 'height',
      type: 'string',
      title: 'Height',
      description: 'Height of the media in vw. Example: 10vw, 15vw, 20vw, etc.',
    }),
    defineField({
      name: 'gap',
      type: 'string',
      title: 'Gap',
      description: 'Gap between the media in vw. Example: 10vw, 15vw, 20vw, etc.',
    }),
    defineField({
      name: 'justifyContent',
      type: 'string',
      title: 'Justify Content',
      description:
        'Justify content of the media. Center means horizontally center and between means horizontally end',
      options: {
        list: [
          {title: 'Center', value: 'center'},
          {title: 'Between', value: 'between'},
        ],
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: {
      files: 'files',
    },
    prepare({files}) {
      return {
        title: `Media (${files?.length || 0} items)`,
        files: files?.[0],
      }
    },
  },
})
