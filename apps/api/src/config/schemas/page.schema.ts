import { ContentTypeDefinition } from '@cms/shared/interfaces';

export const pageSchema: ContentTypeDefinition = {
  name: 'page',
  title: 'Página',
  icon: 'description',
  description: 'Static pages',
  defaultVisibility: 'PUBLIC',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      required: true,
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      source: 'title',
      required: true,
    },
    {
      name: 'body',
      title: 'Conteúdo',
      type: 'richtext',
      required: true,
    },
    {
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      validation: { max: 60 },
    },
    {
      name: 'seoDescription',
      title: 'Descrição SEO',
      type: 'text',
      options: { rows: 2, maxLength: 160 },
    },
    {
      name: 'order',
      title: 'Ordem',
      type: 'number',
      validation: { min: 0 },
    },
  ],
  preview: {
    title: 'title',
    subtitle: 'slug',
  },
};
