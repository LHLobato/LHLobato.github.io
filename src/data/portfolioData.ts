import lattesGenerated from './lattesData.json';

export interface SocialLinks {
  github: { handle: string; url: string };
  linkedin: { handle: string; url: string };
  instagram: { handle: string; url: string };
  lattes: { urls: string[] };
}

export interface ExperienceRow {
  period: string;
  title: string;
  description: string;
}

export interface SkillColumn {
  title: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  category: 'ia-pesquisa' | 'backend-rag' | 'web';
  categoryLabel: string;
  meta: string;
  title: string;
  description: string;
  stackLine: string;
  deployUrl: string;
  repoUrl?: string;
  imageUrl?: string;
  architectureNote?: string;
}

export interface ScientificArticle {
  id: string;
  title: string;
  event: string;
  year: string;
  authors?: string;
  link?: string;
}

export interface LattesPayload {
  sourceFile: string;
  lattesId: string;
  lattesUrl: string;
  lastUpdated: string;
  articles: ScientificArticle[];
  experiences: ExperienceRow[];
}

export const INITIAL_LATTES_DATA: LattesPayload = lattesGenerated as LattesPayload;

export const PROFILE_DATA = {
  name: 'Luís Henrique Lobato',
  fullName: 'Luís Henrique Salomão Lobato',
  shortName: 'L. H. Lobato',
  kicker: 'UNESP • LIPAI • ENGENHARIA DE SOFTWARE & IA',
  heroTitle: 'Pesquisa aplicada em IA e engenharia de software para soluções reais.',
  heroLead:
    'Sou Luís Henrique, estudante de Ciência da Computação na UNESP e pesquisador em Inteligência Artificial no LIPAI. Meu foco está na interseção entre pesquisa aplicada e engenharia de software: gosto de tirar modelos de Machine Learning e Deep Learning do papel e transformá-los em APIs e soluções reais.',
  avatarUrl: './assets/perfil.jpg',
  aboutParagraphs: [
    'Sou Luís Henrique, estudante de Ciência da Computação na UNESP e pesquisador em Inteligência Artificial no LIPAI. Meu foco está na interseção entre pesquisa aplicada e engenharia de software: gosto de tirar modelos de Machine Learning e Deep Learning do papel e transformá-los em APIs e soluções reais.',
    'Na pesquisa, desenvolvi conhecimentos e especializações nas áreas de Visão Computacional, NLP e ciência de dados, com trabalhos publicados em eventos internacionais relevantes.',
    'No desenvolvimento, foco em backends, com foco em sistemas de RAG, sistemas de recomendação e soluções com integração de inteligência artificial — seja generativa, agêntica ou desenvolvimento dos próprios modelos, a depender do problema a ser solucionado. Tenho experiência com banco de dados e desenvolvimento web.',
  ],
  experiences:
    INITIAL_LATTES_DATA.experiences && INITIAL_LATTES_DATA.experiences.length > 0
      ? INITIAL_LATTES_DATA.experiences
      : ([
          {
            period: 'Atual — Pesquisa',
            title: 'Pesquisador em Inteligência Artificial · LIPAI / UNESP',
            description:
              'Pesquisa aplicada e desenvolvimento de modelos em Visão Computacional, Processamento de Linguagem Natural (NLP) e Ciência de Dados, com publicações em eventos internacionais.',
          },
          {
            period: 'Atual — Engenharia',
            title: 'Desenvolvimento Backend & Sistemas de IA',
            description:
              'Arquitetura de APIs, sistemas de RAG com busca vetorial, sistemas de recomendação, soluções agênticas/generativas e integração com bancos de dados e aplicações web.',
          },
        ] as ExperienceRow[]),
  skillsLead:
    'Trabalho principalmente com Python, PyTorch, FastAPI, PostgreSQL (pgvector) e Docker, sempre com atenção a métricas rigorosas, eficiência computacional e código pronto para rodar fora do notebook.',
  skillColumns: [
    {
      title: 'Inteligência Artificial & Pesquisa',
      items: [
        'Python & PyTorch (Machine Learning / Deep Learning)',
        'Visão Computacional, NLP & Ciência de Dados',
        'Sistemas de RAG & Busca Vetorial (PostgreSQL / pgvector)',
        'Orquestração de LLMs & Agentes (LangChain, Gemini API)',
        'Sistemas de Recomendação & Avaliação de Métricas',
      ],
    },
    {
      title: 'Engenharia de Software & Backend',
      items: [
        'APIs de Produção & Microsserviços (FastAPI)',
        'Bancos de Dados Relacionais & Vetoriais (PostgreSQL, SQL)',
        'Containers & Ambiente de Execução (Docker, Linux, Bash)',
        'Desenvolvimento Web Moderno (TypeScript, React, JavaScript)',
        'Programação Orientada a Objetos & Sistemas (Java)',
      ],
    },
  ] as SkillColumn[],
  socials: {
    github: {
      handle: 'LHLobato',
      url: 'https://github.com/LHLobato',
    },
    linkedin: {
      handle: 'lhs-lobato',
      url: 'https://www.linkedin.com/in/lhs-lobato/',
    },
    instagram: {
      handle: 'lhslobato',
      url: 'https://www.instagram.com/lhslobato/',
    },
    lattes: {
      urls: [
        'https://busca-cv-lattes.cnpq.br/curriculo/1684938289854546',
        'http://lattes.cnpq.br/1684938289854546',
      ],
    },
  } as SocialLinks,
};

/**
 * PROJETOS
 * Adicione novos objetos a este array para publicar mais projetos no portfólio.
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: 'animeletron',
    category: 'ia-pesquisa',
    categoryLabel: 'IA & Modelos',
    meta: 'VISÃO COMPUTACIONAL • EFFICIENTNET • ONNX WEB INFERENCE',
    title: 'Animeletron',
    description:
      'Um modelo EfficientNet foi treinado com imagens extraídas do Pinterest e otimizado via ONNX (para rodar diretamente no navegador) para classificar a qual anime pertence o personagem enviado pelo usuário.',
    stackLine: 'Python · PyTorch · EfficientNet · ONNX Runtime Web · Visão Computacional',
    deployUrl: 'https://lhlobato.github.io/what_anime_is_it_from/',
    repoUrl: 'https://github.com/LHLobato/what_anime_is_it_from',
    architectureNote: 'Pinterest Dataset ➔ EfficientNet Training ➔ ONNX Quantization/Export ➔ In-Browser Inference',
  },
];

/**
 * ARTIGOS CIENTÍFICOS
 * Carregados automaticamente a partir do PDF do Lattes colocado em /assets.
 */
export const SCIENTIFIC_ARTICLES: ScientificArticle[] =
  INITIAL_LATTES_DATA.articles;
