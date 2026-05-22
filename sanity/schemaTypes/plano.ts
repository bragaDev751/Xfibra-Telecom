import { defineField, defineType } from 'sanity'

export const planoType = defineType({
  name: 'plano',
  title: 'Planos de Internet',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome do Plano',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'preco',
      title: 'Preço Mensal (R$)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'velocidade',
      title: 'Velocidade (Ex: 500 Mega)',
      type: 'string',
    }),
    defineField({
      name: 'destaque',
      title: 'Plano em Destaque?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'beneficios',
      title: 'Benefícios (um por linha)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL do Vídeo (YouTube ou Vimeo)',
      type: 'url',
    }),
    defineField({
      name: 'cidades',
      title: 'Cidades Atendidas por este Plano',
      description: 'Selecione em quais cidades este plano deve aparecer no site',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1).error('Selecione pelo menos uma cidade.'),
      options: {
        list: [
          { title: 'Banabuiú', value: 'Banabuiú' },
          { title: 'Juatama', value: 'Juatama' },
          { title: 'Choró', value: 'Choró' },
        ],
        layout: 'grid', 
      },
    }),
  ],
})