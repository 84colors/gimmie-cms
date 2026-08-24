import { defineType, defineField, defineArrayMember } from 'sanity'
import { HomeIcon } from '@sanity/icons/Home'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'about', title: 'About' },
    { name: 'process', title: 'Process' },
    { name: 'faq', title: 'FAQ' },
    { name: 'awards', title: 'Awards' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    // ── Hero ─────────────────────────────────────────────────────────────
    defineField({
      name: 'heroHeading',
      title: 'Heading',
      type: 'string',
      group: 'hero',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroBullets',
      title: 'Bullet Points',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'hero',
    }),
    defineField({
      name: 'heroReelUrl',
      title: 'Showreel Vimeo URL',
      type: 'url',
      group: 'hero',
    }),

    // ── About ─────────────────────────────────────────────────────────────
    defineField({
      name: 'aboutHeading',
      title: 'Heading',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutBody',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      group: 'about',
    }),

    // ── Process ───────────────────────────────────────────────────────────
    defineField({
      name: 'processHeading',
      title: 'Heading',
      type: 'string',
      group: 'process',
    }),
    defineField({
      name: 'processIntro',
      title: 'Intro Text',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      group: 'process',
    }),
    defineField({
      name: 'processSteps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'number', title: 'Number', type: 'string' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({
              name: 'variant',
              title: 'Card Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Default (cream)', value: 'default' },
                  { title: 'Dark', value: 'dark' },
                  { title: 'White', value: 'white' },
                  { title: 'Grey', value: 'grey' },
                ],
                layout: 'radio',
              },
              initialValue: 'default',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'number' },
          },
        }),
      ],
      group: 'process',
    }),

    // ── FAQ ───────────────────────────────────────────────────────────────
    defineField({
      name: 'faqHeading',
      title: 'Heading',
      type: 'string',
      group: 'faq',
    }),
    defineField({
      name: 'faqItems',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4 }),
          ],
          preview: {
            select: { title: 'question' },
          },
        }),
      ],
      group: 'faq',
    }),

    // ── Awards ────────────────────────────────────────────────────────────
    defineField({
      name: 'awardsHeading',
      title: 'Heading',
      type: 'string',
      group: 'awards',
    }),

    // ── Footer ────────────────────────────────────────────────────────────
    defineField({
      name: 'footerTagline',
      title: 'Tagline',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerPhone',
      title: 'Phone',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerEmail',
      title: 'Email',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerLocation',
      title: 'Location',
      type: 'string',
      group: 'footer',
    }),
  ],
})
