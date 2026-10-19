// Formato de um serviço. Cada serviço fica em um arquivo nesta pasta.

// Texto de um serviço em um idioma (card da home + página do serviço).
export type ServiceText = {
  title: string;
  shortDesc: string; // aparece no card da home
  subtitle: string; // frase de destaque no topo da página
  intro: string[]; // parágrafos de introdução
  benefits: string[]; // "Por que investir"
  includes: string[]; // "O que está incluso"
  faq: { question: string; answer: string }[];
};

export type ServiceContent = {
  id: number;
  slug: string; // endereço: /servicos/<slug>
  seoTitle: string; // título no Google (português)
  seoDescription: string; // descrição no Google (português)
  pt: ServiceText;
  en: ServiceText;
};
