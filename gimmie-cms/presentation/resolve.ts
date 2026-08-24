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
    caseStudy: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title ?? 'Case Study',
            href: doc?.slug ? `/case-studies/${doc.slug}` : '/case-studies',
          },
          { title: 'All Case Studies', href: '/case-studies' },
        ],
      }),
    }),
  },
}
