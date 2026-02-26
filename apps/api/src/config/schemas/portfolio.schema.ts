import { ContentTypeDefinition } from '@cms/shared/interfaces';

export const portfolioSchema: ContentTypeDefinition = {
  name: 'portfolio',
  title: 'Portfólio',
  icon: 'collections',
  description: 'Projetos e trabalhos com conteúdo rico',
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
      name: 'description',
      title: 'Descrição',
      type: 'text',
      required: true,
      options: { rows: 3, maxLength: 300 },
    },
    {
      name: 'body',
      title: 'Conteúdo Completo',
      type: 'richtext',
      description: 'Texto detalhado do projeto com formatação rica',
    },
    {
      name: 'cover',
      title: 'Imagem de Capa',
      type: 'image',
      required: true,
      options: { hotspot: true },
    },
    {
      name: 'gallery',
      title: 'Galeria de Imagens',
      type: 'gallery',
      description: 'Fotos e imagens do projeto',
      validation: { max: 30 },
    },
    {
      name: 'video',
      title: 'Vídeo',
      type: 'video',
      description: 'Vídeo do projeto (YouTube, Vimeo, ou upload)',
    },
    {
      name: 'client',
      title: 'Cliente',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'select',
      options: {
        list: [
          { title: 'Web Design', value: 'web-design' },
          { title: 'Branding', value: 'branding' },
          { title: 'Fotografia', value: 'photography' },
          { title: 'Vídeo', value: 'video' },
          { title: 'Social Media', value: 'social-media' },
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
      name: 'projectUrl',
      title: 'URL do Projeto',
      type: 'url',
    },
    {
      name: 'completedAt',
      title: 'Data de Conclusão',
      type: 'date',
    },
    {
      name: 'featured',
      title: 'Destaque',
      type: 'boolean',
    },
  ],
  preview: {
    title: 'title',
    subtitle: 'client',
    media: 'cover',
  },
};
