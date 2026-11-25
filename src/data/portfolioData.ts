export interface SocialLinks {
  github: { handle: string; url: string };
  linkedin: { handle: string; url: string };
  instagram: { handle: string; url: string };
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  context: string;
  description: string;
  deployUrl: string;
  repoUrl?: string;
  stack: string[];
  year: string;
}

export interface ScientificArticle {
  id: string;
  title: string;
  event: string;
  year: string;
  area?: string;
  link?: string;
}

export const PROFILE_DATA = {
  name: 'Luís Henrique Lobato',
  shortName: 'L. H. Lobato',
  headline: 'Ciência da Computação @ UNESP · Pesquisador em IA @ LIPAI',
  subheadline: 'Engenharia de Software, Backend & Inteligência Artificial Aplicada',
  avatarUrl: './assets/perfil.jpg',
  aboutMe: [
    'Sou Luís Henrique, estudante de Ciência da Computação na UNESP e pesquisador em Inteligência Artificial no LIPAI. Meu foco está na interseção entre pesquisa aplicada e engenharia de software: gosto de tirar modelos de Machine Learning e Deep Learning do papel e transformá-los em APIs e soluções reais.',
    'Na pesquisa, desenvolvi conhecimentos e especializações nas áreas de Visão Computacional, NLP e Ciência de Dados, com trabalhos publicados em eventos internacionais relevantes.',
    'No desenvolvimento, foco em backend — com ênfase em sistemas de RAG, sistemas de recomendação e soluções com integração de inteligência artificial, seja generativa, agêntica ou no desenvolvimento dos próprios modelos, a depender do problema a ser solucionado. Também tenho experiência sólida com bancos de dados e desenvolvimento web.',
  ],
  skillsNote:
    'Trabalho principalmente com Python, PyTorch, FastAPI, PostgreSQL (pgvector) e Docker, sempre com atenção a métricas rigorosas, eficiência computacional e código pronto para rodar fora do notebook.',
  skillGroups: [
    {
      category: 'Core & Produção',
      items: ['Python', 'PyTorch', 'FastAPI', 'PostgreSQL (pgvector)', 'Docker'],
    },
    {
      category: 'IA, Dados & Pesquisa',
      items: ['Machine Learning', 'Deep Learning', 'Visão Computacional', 'NLP', 'RAG', 'LangChain', 'Gemini API', 'Sistemas de Recomendação'],
    },
    {
      category: 'Engenharia, Web & Sistemas',
      items: ['Linux', 'Bash', 'SQL', 'TypeScript', 'React', 'JavaScript', 'Java'],
    },
  ] as SkillGroup[],
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
  } as SocialLinks,
};

/**
 * Projetos — edite este array para atualizar facilmente seus projetos e links de deploy.
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Pipeline de RAG & Busca Vetorial',
    context: 'Backend & IA Aplicada',
    description:
      'API para recuperação e geração aumentada utilizando indexação vetorial em PostgreSQL (pgvector), orquestração com LangChain/LLM e serviço assíncrono em FastAPI.',
    deployUrl: 'https://github.com/LHLobato',
    repoUrl: 'https://github.com/LHLobato',
    stack: ['Python', 'FastAPI', 'pgvector', 'LangChain', 'Docker'],
    year: '2025',
  },
  {
    id: 'proj-2',
    title: 'Inferência em Visão Computacional / Deep Learning',
    context: 'Pesquisa Aplicada & Engenharia',
    description:
      'Treinamento, avaliação rigorosa de métricas e empacotamento de modelo em PyTorch para execução reprodutível via container e consumo por serviço REST.',
    deployUrl: 'https://github.com/LHLobato',
    repoUrl: 'https://github.com/LHLobato',
    stack: ['PyTorch', 'Python', 'FastAPI', 'Linux'],
    year: '2025',
  },
  {
    id: 'proj-3',
    title: 'Sistema de Recomendação & Agentes',
    context: 'Engenharia de Software',
    description:
      'Arquitetura de recomendação e integração agêntica com persistência relacional e interface web para inspeção de resultados.',
    deployUrl: 'https://github.com/LHLobato',
    repoUrl: 'https://github.com/LHLobato',
    stack: ['Python', 'Gemini API', 'SQL', 'TypeScript', 'React'],
    year: '2024',
  },
];

/**
 * Artigos Científicos — atualize com o título oficial do artigo e o evento onde foi publicado.
 */
export const SCIENTIFIC_ARTICLES: ScientificArticle[] = [
  {
    id: 'art-1',
    title: 'Título do Artigo Científico I (Substitua pelo título oficial da publicação)',
    event: 'Conferência / Evento Internacional (Substitua pelo nome do evento)',
    year: '2025',
    area: 'Visão Computacional / Deep Learning',
    link: '#',
  },
  {
    id: 'art-2',
    title: 'Título do Artigo Científico II (Substitua pelo título oficial da publicação)',
    event: 'Conferência / Simpósio Internacional (Substitua pelo nome do evento)',
    year: '2024',
    area: 'NLP / Ciência de Dados',
    link: '#',
  },
];
