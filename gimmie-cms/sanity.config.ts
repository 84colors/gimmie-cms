import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {resolve} from './presentation/resolve'

const PREVIEW_ORIGIN = process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:4321'

export default defineConfig({
  name: 'default',
  title: 'Gimmie CMS',

  projectId: 'wkio95xy',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Homepage')
              .id('homepage')
              .child(
                S.document()
                  .schemaType('homepage')
                  .documentId('homepage')
              ),
            S.divider(),
            S.documentTypeListItem('video').title('Videos'),
            S.documentTypeListItem('category').title('Categories'),
          ]),
    }),
    presentationTool({
      resolve,
      previewUrl: {
        origin: PREVIEW_ORIGIN,
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
