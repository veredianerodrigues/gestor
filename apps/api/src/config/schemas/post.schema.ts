import { ContentTypeDefinition } from '@cms/shared/interfaces';

export const postSchema: ContentTypeDefinition = {
  name: 'post',
  title: 'Post',
  icon: 'article',
  description: 'Blog posts and articles',
  defaultVisibility: 'PUBLIC',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      required: true,
      validation: { min: 3, max: 200 },
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      source: 'title',
      required: true,
    },
    {
      name: 'excerpt',
      title: 'Resumo',
      type: 'text',
      options: { rows: 3, maxLength: 200 },
    },
    {
      name: 'body',
      title: 'Conteúdo',
      type: 'richtext',
      required: true,
    },
    {
      name: 'cover',
      title: 'Imagem de Capa',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'gallery',
      title: 'Galeria de Imagens',
      type: 'gallery',
      description: 'Galeria de fotos do post',
      validation: { max: 20 },
    },
    {
      name: 'video',
      title: 'Vídeo',
      type: 'video',
      description: 'URL do vídeo (YouTube, Vimeo, ou arquivo)',
    },
    {
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: 'author',
      required: true,
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'select',
      options: {
        list: [
          { title: 'Tecnologia', value: 'tech' },
          { title: 'Design', value: 'design' },
          { title: 'Negócios', value: 'business' },
        ],
        layout: 'dropdown',
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ name: 'tag', title: 'Tag', type: 'string' }],
    },
    {
      name: 'featured',
      title: 'Destaque',
      type: 'boolean',
    },
    {
      name: 'publishedAt',
      title: 'Data de Publicação',
      type: 'datetime',
    },
  ],
  preview: {
    title: 'title',
    subtitle: 'category',
    media: 'cover',
  },
};
