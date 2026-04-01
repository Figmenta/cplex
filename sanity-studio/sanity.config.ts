import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import {copyPastePlugin} from '@superside-oss/sanity-plugin-copy-paste'

export default defineConfig({
  name: 'default',
  title: 'figmenta',
  projectId: "gm701ez7",
  dataset: "production",

  plugins: [
    deskTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            // Orderable Case Studies
            orderableDocumentListDeskItem({
              type: 'caseStudy',
              title: 'Case Studies',
              S,
              context,
            }),
            // All other types (excluding caseStudy to avoid duplication)
            ...S.documentTypeListItems().filter(
              (item: any) => item.getId() !== 'caseStudy'
            ),
          ])
    }),
    visionTool(),
    copyPastePlugin(),
  ],

  schema: {
    types: schemaTypes,
  },
})
