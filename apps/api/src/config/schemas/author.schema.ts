import { ContentTypeDefinition } from '@cms/shared/interfaces';

export const authorSchema: ContentTypeDefinition = {
  name: 'author',
  title: 'Autor',
  icon: 'person',
  description: 'Authors of content',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      required: true,
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      source: 'name',
      required: true,
    },
    {
      name: 'email',
      title: 'Email',
      type: 'email',
    },
    {
      name: 'bio',
      title: 'Biografia',
      type: 'text',
      options: { rows: 4 },
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
    },
  ],
  preview: {
    title: 'name',
    subtitle: 'email',
    media: 'avatar',
  },
};
