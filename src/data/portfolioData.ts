/// <reference types="vite/client" />
import lattesGenerated from './lattesData.json';
import projectImagesManifest from './projectImages.json';

export type Language = 'en' | 'pt';
export type ProjectFolder = 'projeto1' | 'projeto2' | 'projeto3' | 'projeto4';

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
  titleEn?: string;
  descriptionEn?: string;
}

export interface SkillColumn {
  title: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  category: 'ia-pesquisa' | 'backend-rag' | 'web';
  folder: ProjectFolder;
  meta: { en: string; pt: string };
  title: string;
  description: { en: string; pt: string };
  stackLine: { en: string; pt: string };
  deployUrl: string;
  repoUrl?: string;
  imageUrl?: string;
  images?: string[];
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

export const SOCIAL_LINKS: SocialLinks = {
  github: {
    handle: 'LHLobato',
    url: 'https://github.com/LHLobato',
  },
  linkedin: {
    handle: 'lhs-lobato',
    url: 'https://www.linkedin.com/in/lhs-lobato/',
  },
  instagram: {
    handle: 'lhs.lobato',
    url: 'https://www.instagram.com/lhs.lobato/',
  },
  lattes: {
    urls: [
      'https://busca-cv-lattes.cnpq.br/curriculo/1684938289854546',
      'http://lattes.cnpq.br/1684938289854546',
    ],
  },
};

export interface LocalizedProfileContent {
  kicker: string;
  heroTitle: string;
  heroLead: string;
  ctaProjects: string;
  ctaArticles: string;
  lattesLabel: string;
  lattesChecking: string;
  nav: {
    about: string;
    skills: string;
    projects: string;
    articles: string;
  };
  themeToggle: {
    light: string;
    dark: string;
    aria: string;
  };
  sections: {
    aboutIndex: string;
    aboutTitle: string;
    skillsIndex: string;
    skillsTitle: string;
    projectsIndex: string;
    projectsTitle: string;
    articlesIndex: string;
    articlesTitle: string;
  };
  filters: {
    todos: string;
    'backend-rag': string;
    'ia-pesquisa': string;
    web: string;
  };
  projectCta: {
    deploy: string;
    repo: string;
  };
  aboutParagraphs: string[];
  defaultExperiences: ExperienceRow[];
  skillsLead: string;
  skillColumns: SkillColumn[];
}

export const PROFILE_META = {
  name: 'Luís Henrique Salomão Lobato',
  fullName: 'Luís Henrique Salomão Lobato',
  shortName: 'L. H. S. Lobato',
  avatarUrl: './assets/perfil.jpg',
  socials: SOCIAL_LINKS,
};

export const LOCALIZED_CONTENT: Record<Language, LocalizedProfileContent> = {
  en: {
    kicker: 'UNESP • LIPAI • SOFTWARE ENGINEERING & AI',
    heroTitle: 'Applied AI research and software engineering for real-world solutions.',
    heroLead:
      "I'm Luís Henrique, a Computer Science student at UNESP and an Artificial Intelligence researcher at LIPAI. My focus lies at the intersection of applied research and software engineering: I enjoy taking Machine Learning and Deep Learning models off the paper and turning them into real APIs and production solutions.",
    ctaProjects: 'Explore projects',
    ctaArticles: 'Read published papers',
    lattesLabel: 'Lattes CV',
    lattesChecking: 'Checking Lattes...',
    nav: {
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      articles: 'Publications',
    },
    themeToggle: {
      light: 'Light',
      dark: 'Dark',
      aria: 'Toggle between light and dark mode',
    },
    sections: {
      aboutIndex: '01 / ABOUT ME',
      aboutTitle: 'Background & Research',
      skillsIndex: '02 / SKILLS',
      skillsTitle: 'Specializations',
      projectsIndex: '03 / PROJECTS',
      projectsTitle: 'Selected works',
      articlesIndex: '04 / SCIENTIFIC ARTICLES',
      articlesTitle: 'Publications',
    },
    filters: {
      todos: 'All',
      'backend-rag': 'Backend & RAG',
      'ia-pesquisa': 'AI & Models',
      web: 'Web & Systems',
    },
    projectCta: {
      deploy: 'View live deployment',
      repo: 'Repository',
    },
    aboutParagraphs: [
      "I'm Luís Henrique, a Computer Science student at UNESP and an Artificial Intelligence researcher at LIPAI. My focus lies at the intersection of applied research and software engineering: I enjoy taking Machine Learning and Deep Learning models off the paper and turning them into real APIs and production solutions.",
      'In research, I have developed knowledge and specializations in Computer Vision, NLP, and Data Science, with papers published in relevant international conferences.',
      'In development, I focus on backend engineering — with an emphasis on RAG systems, recommender systems, and AI-integrated solutions, whether generative, agentic, or custom model development, depending on the problem to be solved. I also have experience with databases and web development.',
    ],
    defaultExperiences: [
      {
        period: '08/2025 - 08/2026',
        title: 'Undergraduate Research Fellow · UNESP / LIPAI',
        description:
          'Integrated Use of BERT, Reshaping, and Vision Transformers for Malicious Domain and HTTP Request Detection.',
      },
      {
        period: '08/2024 - 08/2025',
        title: 'Undergraduate Research Fellow · UNESP / LIPAI',
        description:
          'Malware investigation using BERT and Vision Transformer techniques.',
      },
    ],
    skillsLead:
      'I work primarily with Python, PyTorch, FastAPI, PostgreSQL (pgvector), and Docker, always focusing on rigorous metrics, computational efficiency, and production-ready code beyond the notebook.',
    skillColumns: [
      {
        title: 'Artificial Intelligence & Research',
        items: [
          'Python & PyTorch (Machine Learning / Deep Learning)',
          'Computer Vision, NLP & Data Science',
          'RAG Systems & Vector Search (PostgreSQL / pgvector)',
          'LLM & Agent Orchestration (LangChain, Gemini API)',
          'Recommender Systems & Rigorous Metrics Evaluation',
        ],
      },
      {
        title: 'Software & Backend Engineering',
        items: [
          'Production APIs & Microservices (FastAPI)',
          'Relational & Vector Databases (PostgreSQL, SQL)',
          'Containers & Runtime Environments (Docker, Linux, Bash)',
          'Modern Web Development (TypeScript, React, JavaScript)',
          'Object-Oriented Programming & Systems (Java)',
        ],
      },
    ],
  },
  pt: {
    kicker: 'UNESP • LIPAI • ENGENHARIA DE SOFTWARE & IA',
    heroTitle: 'Pesquisa aplicada em IA e engenharia de software para soluções reais.',
    heroLead:
      'Sou Luís Henrique, estudante de Ciência da Computação na UNESP e pesquisador em Inteligência Artificial no LIPAI. Meu foco está na interseção entre pesquisa aplicada e engenharia de software: gosto de tirar modelos de Machine Learning e Deep Learning do papel e transformá-los em APIs e soluções reais.',
    ctaProjects: 'Explorar projetos',
    ctaArticles: 'Ler artigos publicados',
    lattesLabel: 'Currículo Lattes',
    lattesChecking: 'Verificando Lattes...',
    nav: {
      about: 'Sobre mim',
      skills: 'Skills',
      projects: 'Projetos',
      articles: 'Artigos',
    },
    themeToggle: {
      light: 'Claro',
      dark: 'Escuro',
      aria: 'Alternar entre modo claro e escuro',
    },
    sections: {
      aboutIndex: '01 / SOBRE MIM',
      aboutTitle: 'Trajetória & Pesquisa',
      skillsIndex: '02 / SKILLS',
      skillsTitle: 'Especialidades',
      projectsIndex: '03 / PROJETOS',
      projectsTitle: 'Trabalhos selecionados',
      articlesIndex: '04 / ARTIGOS CIENTÍFICOS',
      articlesTitle: 'Publicações',
    },
    filters: {
      todos: 'Todos',
      'backend-rag': 'Backend & RAG',
      'ia-pesquisa': 'IA & Modelos',
      web: 'Web & Sistemas',
    },
    projectCta: {
      deploy: 'Acessar projeto em deploy',
      repo: 'Repositório',
    },
    aboutParagraphs: [
      'Sou Luís Henrique, estudante de Ciência da Computação na UNESP e pesquisador em Inteligência Artificial no LIPAI. Meu foco está na interseção entre pesquisa aplicada e engenharia de software: gosto de tirar modelos de Machine Learning e Deep Learning do papel e transformá-los em APIs e soluções reais.',
      'Na pesquisa, desenvolvi conhecimentos e especializações nas áreas de Visão Computacional, NLP e ciência de dados, com trabalhos publicados em eventos internacionais relevantes.',
      'No desenvolvimento, foco em backends, com foco em sistemas de RAG, sistemas de recomendação e soluções com integração de inteligência artificial — seja generativa, agêntica ou desenvolvimento dos próprios modelos, a depender do problema a ser solucionado. Tenho experiência com banco de dados e desenvolvimento web.',
    ],
    defaultExperiences: [
      {
        period: '08/2025 - 08/2026',
        title: 'Bolsista de Iniciação Científica · UNESP / LIPAI',
        description:
          'Uso Integrado de BERT, Reshaping e Vision Transformers para Detecção de Domínios Maliciosos e requisições HTTP',
      },
      {
        period: '08/2024 - 08/2025',
        title: 'Bolsista de Iniciação Científica · UNESP / LIPAI',
        description:
          'Investigação de malware com técnicas BERT e Vision Transformers',
      },
    ],
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
    ],
  },
};

const BUNDLED_PROJECT_IMAGES: Record<ProjectFolder, string[]> = {
  projeto1: [],
  projeto2: [],
  projeto3: [],
  projeto4: [],
};

const rawGlobModules = import.meta.glob(
  [
    '../../assets/projeto1/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP,GIF,SVG,AVIF}',
    '../../assets/projeto2/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP,GIF,SVG,AVIF}',
    '../../assets/projeto3/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP,GIF,SVG,AVIF}',
    '../../assets/projeto4/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP,GIF,SVG,AVIF}',
    '../../projeto1/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP,GIF,SVG,AVIF}',
    '../../projeto2/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP,GIF,SVG,AVIF}',
    '../../projeto3/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP,GIF,SVG,AVIF}',
    '../../projeto4/*.{png,jpg,jpeg,webp,gif,svg,avif,PNG,JPG,JPEG,WEBP,GIF,SVG,AVIF}',
  ],
  { eager: true, import: 'default' }
) as Record<string, string>;

Object.keys(rawGlobModules)
  .sort()
  .forEach((filePath) => {
    const url = rawGlobModules[filePath];
    (
      ['projeto1', 'projeto2', 'projeto3', 'projeto4'] as ProjectFolder[]
    ).forEach((folder) => {
      if (
        filePath.includes(`/${folder}/`) &&
        !BUNDLED_PROJECT_IMAGES[folder].includes(url)
      ) {
        BUNDLED_PROJECT_IMAGES[folder].push(url);
      }
    });
  });

const manifestRecord = projectImagesManifest as Record<ProjectFolder, string[]>;

export function getProjectImages(
  folder: ProjectFolder,
  fallbackImages?: string[],
  fallbackSingle?: string
): string[] {
  const fromManifest = manifestRecord?.[folder] ?? [];
  if (fromManifest.length > 0) {
    return fromManifest;
  }
  const fromGlob = BUNDLED_PROJECT_IMAGES[folder] ?? [];
  if (fromGlob.length > 0) {
    return fromGlob;
  }
  if (fallbackImages && fallbackImages.length > 0) {
    return fallbackImages;
  }
  if (fallbackSingle) {
    return [fallbackSingle];
  }
  return [];
}

/**
 * PROJETOS
 * As imagens de cada card são carregadas automaticamente dos diretórios:
 * "projeto1", "projeto2", "projeto3" e "projeto4" (dentro de /assets ou /public/assets).
 */
export const PROJECTS: ProjectItem[] = [
  {
    id: 'animeletron',
    category: 'ia-pesquisa',
    folder: 'projeto1',
    meta: {
      en: 'COMPUTER VISION • EFFICIENTNET • ONNX WEB INFERENCE',
      pt: 'VISÃO COMPUTACIONAL • EFFICIENTNET • ONNX WEB INFERENCE',
    },
    title: 'Animeletron',
    description: {
      en: 'An EfficientNet model trained on images extracted from Pinterest and optimized via ONNX (running directly in the browser) to classify which anime a user-uploaded character belongs to.',
      pt: 'Um modelo EfficientNet foi treinado com imagens extraídas do Pinterest e otimizado via ONNX (para rodar diretamente no navegador) para classificar a qual anime pertence o personagem enviado pelo usuário.',
    },
    stackLine: {
      en: 'Python · PyTorch · EfficientNet · ONNX Runtime Web · Computer Vision',
      pt: 'Python · PyTorch · EfficientNet · ONNX Runtime Web · Visão Computacional',
    },
    deployUrl: 'https://lhlobato.github.io/what_anime_is_it_from/',
    repoUrl: 'https://github.com/LHLobato/what_anime_is_it_from',
    imageUrl: './assets/projeto1/01-animeletron-home.png',
    architectureNote:
      'Pinterest Dataset ➔ EfficientNet Training ➔ ONNX Quantization/Export ➔ In-Browser Inference',
  },
  {
    id: 'rag-chat',
    category: 'backend-rag',
    folder: 'projeto2',
    meta: {
      en: 'RAG SYSTEM • FAISS & RRF • GEMINI 3.5-FLASH-LITE',
      pt: 'SISTEMA RAG • FAISS & RRF • GEMINI 3.5-FLASH-LITE',
    },
    title: 'RAG Chat',
    description: {
      en: 'A Retrieval-Augmented Generation platform powered by Gemini 3.5-flash-lite. The platform ingests documents, splits them into chunks, generates embeddings for both the chunks and the user query using Google Embeddings, applies cosine similarity and Reciprocal Rank Fusion (RRF) via FAISS to retrieve the top 5 most similar chunks, and sends them along with the question to Gemini.',
      pt: 'Plataforma de RAG utilizando o modelo Gemini 3.5-flash-lite, onde o sistema recebe documentos, divide em chunks, gera embeddings para as chunks e para a pergunta do usuário com Google Embeddings, aplica similaridade de cosseno e RRF (Reciprocal Rank Fusion) para recuperar as top 5 chunks mais similares e as envia junto com a pergunta para o Gemini.',
    },
    stackLine: {
      en: 'FAISS · Google Embeddings · Gemini API (Gemini 3.5-flash-lite) · React + TypeScript',
      pt: 'FAISS · Google Embeddings · Gemini API (Gemini 3.5-flash-lite) · React + TypeScript',
    },
    deployUrl: 'https://github.com/LHLobato',
    repoUrl: 'https://github.com/LHLobato',
    imageUrl: './assets/projeto2/01-rag-chat-dashboard.png',
    architectureNote:
      'Document Chunking ➔ Google Embeddings ➔ FAISS + Cosine Similarity & RRF (Top-5) ➔ Gemini 3.5-flash-lite',
  },
  {
    id: 'pullsegym',
    category: 'web',
    folder: 'projeto4',
    meta: {
      en: 'RESPONSIVE LANDING PAGE • CLOUDFLARE WORKERS • WEB',
      pt: 'LANDING PAGE RESPONSIVA • CLOUDFLARE WORKERS • WEB',
    },
    title: 'Pulse Fitness (PullseGym)',
    description: {
      en: 'Responsive landing page for a fictional gym featuring membership plan comparisons, photo gallery, operating hours, interactive Google Maps location, and direct WhatsApp contact integration, optimized for both desktop and mobile devices.',
      pt: 'Landing page responsiva (desktop e mobile) para uma academia fictícia, com apresentação e comparativo de planos, galeria do espaço, quadro de horários, localização integrada ao Google Maps e contato direto via WhatsApp.',
    },
    stackLine: {
      en: 'Responsive Web Design · Mobile-First · Google Maps · WhatsApp Integration · Cloudflare Workers',
      pt: 'Design Responsivo (Mobile & Desktop) · Google Maps · Integração WhatsApp · Cloudflare Workers',
    },
    deployUrl: 'https://pullsegym.luislobato35.workers.dev/',
    repoUrl: 'https://github.com/LHLobato/pullsegym',
    imageUrl: './assets/projeto4/01-pullsegym-hero.png',
    architectureNote:
      'Responsive UI (Desktop & Mobile) ➔ Plan Comparison & Gallery ➔ Maps & WhatsApp CTA ➔ Cloudflare Workers Edge Deploy',
  },
];

/**
 * ARTIGOS CIENTÍFICOS
 * Carregados automaticamente a partir do PDF do Lattes colocado em /assets.
 */
export const SCIENTIFIC_ARTICLES: ScientificArticle[] =
  INITIAL_LATTES_DATA.articles;
