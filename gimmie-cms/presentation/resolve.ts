import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homepage: defineLocations({
      select: { title: 'heroHeading' },
      resolve: () => ({
        locations: [{ title: 'Homepage', href: '/' }],
      }),
    }),
    video: defineLocations({
      select: { title: 'title' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title ?? 'Video', href: '/#work' },
        ],
      }),
    }),
  },
}
