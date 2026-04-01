import {defineType} from 'sanity'

export const fileBlock = defineType({
  name: 'fileBlock',
  title: 'File Block',
  type: 'object',
  fields: [
    {
      name: 'file',
      type: 'file',
      title: 'File',
      options: {
        accept: 'image/*,video/*,.gif,application/pdf',
      },
      description: 'Upload an image, GIF, or video file',
    },
    {
      name: 'height',
      title: 'Video Height',
      type: 'string',
      description:
        'If you want to set a specific height for the video here. Example: 5vw, 10vw, 15vw, etc.',
    },
    {
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'muted',
      title: 'Muted',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'videoTitle',
      title: 'Video Title (for SEO)',
      type: 'string',
      description: 'Optional: Video title for SEO indexing. Only shown when file is a video.',
    },
    {
      name: 'videoDescription',
      title: 'Video Description (for SEO)',
      type: 'string',
      description: 'Optional: Video description for SEO indexing. Only shown when file is a video.',
    },
    {
      name: 'videoThumbnail',
      title: 'Video Thumbnail (for SEO)',
      type: 'image',
      description: 'Optional: Thumbnail image for the video. Recommended for SEO.',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'videoDuration',
      title: 'Video Duration (seconds)',
      type: 'number',
      description: 'Optional: Video duration in seconds for SEO indexing.',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'videoUploadDate',
      title: 'Video Upload/Publish Date',
      type: 'date',
      description: 'Optional: Date when the video was published or uploaded.',
    },
    {
      name: 'videoUrl',
      title: 'External Video URL',
      type: 'url',
      description:
        'Optional: URL for external videos (e.g., YouTube, Vimeo). If provided, this will be used instead of the uploaded file.',
    },
  ],
})
