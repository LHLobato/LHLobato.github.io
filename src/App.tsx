import React, { useEffect, useState } from 'react';
import {
  Github,
  Linkedin,
  Instagram,
  Sun,
  Moon,
  ArrowRight,
  ArrowUpRight,
  Activity,
  X,
  Terminal,
  FileText,
  Languages,
  ChevronLeft,
  ChevronRight,
  Globe,
  Code2,
  BrainCircuit,
  BarChart3,
  Database,
  Server,
} from 'lucide-react';
import {
  PROFILE_META,
  LOCALIZED_CONTENT,
  PROJECTS,
  INITIAL_LATTES_DATA,
  LattesPayload,
  Language,
  ExperienceRow,
  ProjectItem,
  ProjectFolder,
  SkillIconKey,
  getProjectImages,
} from './data/portfolioData';

type ThemeMode = 'dark' | 'light';
type VitalityState = 'FINE' | 'CAUTION' | 'DANGER';
type FilterCategory = 'todos' | 'backend-rag' | 'ia-pesquisa' | 'web';

const TARDIS_QUOTES: Record<Language, string[]> = {
  en: [
    '“People assume that time is a strict progression of cause to effect, but actually, from a non-linear, non-subjective viewpoint, it is more like a big ball of wibbly-wobbly, timey-wimey... stuff.”',
    '“Allons-y! Every well-designed AI architecture is bigger on the inside than it looks on the diagram.”',
    '“Never cruel or cowardly. Never give up, never give in.” (12th Doctor · Gallifrey 10-0-11-0-0 by 0-2)',
  ],
  pt: [
    '“People assume that time is a strict progression of cause to effect, but actually, from a non-linear, non-subjective viewpoint, it is more like a big ball of wibbly-wobbly, timey-wimey... stuff.”',
    '“Allons-y! Toda arquitetura de IA bem projetada é maior por dentro do que parece no diagrama.”',
    '“Never cruel or cowardly. Never give up, never give in.” (12th Doctor · Coordenadas: Gallifrey 10-0-11-0-0 by 0-2)',
  ],
};

const LATTES_CANDIDATE_URLS = PROFILE_META.socials.lattes.urls;

async function isUrlReachable(url: string, timeoutMs = 3500): Promise<boolean> {
  if (window.location.protocol === 'https:' && url.startsWith('http://')) {
    return false;
  }
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

async function resolveOnlineLattesUrl(): Promise<string> {
  for (const candidate of LATTES_CANDIDATE_URLS) {
    const online = await isUrlReachable(candidate);
    if (online) {
      return candidate;
    }
  }
  return LATTES_CANDIDATE_URLS[0];
}

function localizeExperience(exp: ExperienceRow, lang: Language): ExperienceRow {
  if (lang === 'pt') return exp;
  const title = exp.title.replace(
    'Bolsista de Iniciação Científica',
    'Undergraduate Research Fellow'
  );
  let description = exp.description;
  if (description.includes('Uso Integrado de BERT')) {
    description =
      'Integrated Use of BERT, Reshaping, and Vision Transformers for Malicious Domain and HTTP Request Detection';
  } else if (description.includes('Investigação de malware')) {
    description =
      'Malware investigation using BERT and Vision Transformer techniques';
  }
  return { ...exp, title, description };
}

function renderSkillIcon(icon: SkillIconKey) {
  switch (icon) {
    case 'web':
      return <Globe size={20} />;
    case 'software':
      return <Code2 size={20} />;
    case 'ai':
      return <BrainCircuit size={20} />;
    case 'data':
      return <BarChart3 size={20} />;
    case 'database':
      return <Database size={20} />;
    case 'devops':
      return <Server size={20} />;
  }
}

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lhlobato-lang') as Language | null;
    if (saved === 'en' || saved === 'pt') return saved;
    return 'en';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('lhlobato-theme') as ThemeMode | null;
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('todos');
  const [lattesData, setLattesData] = useState<LattesPayload>(INITIAL_LATTES_DATA);
  const [checkingLattes, setCheckingLattes] = useState<boolean>(false);
  const [projectImagesMap, setProjectImagesMap] = useState<
    Partial<Record<ProjectFolder, string[]>>
  >({});
  const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Minimalist Easter Egg State
  const [vitality, setVitality] = useState<VitalityState>('FINE');
  const [inkRibbons, setInkRibbons] = useState<number>(3);
  const [starsModalOpen, setStarsModalOpen] = useState<boolean>(false);
  const [starsSavedOnce, setStarsSavedOnce] = useState<boolean>(false);

  const [tardisModalOpen, setTardisModalOpen] = useState<boolean>(false);
  const [tardisQuoteIdx, setTardisQuoteIdx] = useState<number>(0);
  const [tardisMaterializing, setTardisMaterializing] = useState<boolean>(false);

  const [quickBanner, setQuickBanner] = useState<{
    type: 'RE' | 'DW';
    title: string;
    message: string;
  } | null>(null);

  const content = LOCALIZED_CONTENT[lang];

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    localStorage.setItem('lhlobato-lang', lang);
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lhlobato-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('./lattes.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LattesPayload | null) => {
        if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setLattesData(data);
        }
      })
      .catch(() => {});

    fetch('./projectImages.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Partial<Record<ProjectFolder, string[]>> | null) => {
        if (data && typeof data === 'object') {
          setProjectImagesMap(data);
        }
      })
      .catch(() => {});
  }, []);

  const resolveGalleryForProject = (
    project: ProjectItem,
    index: number
  ): string[] => {
    const folder: ProjectFolder =
      project.folder || (`projeto${(index % 4) + 1}` as ProjectFolder);
    const dynamicFromFetch = projectImagesMap[folder];
    const baseList =
      dynamicFromFetch && dynamicFromFetch.length > 0
        ? dynamicFromFetch
        : getProjectImages(folder, project.images, project.imageUrl);

    return baseList.filter((src) => !failedImages[src]);
  };

  const handleSlideStep = (
    e: React.MouseEvent,
    projectId: string,
    total: number,
    delta: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (total <= 1) return;
    setSlideIndices((prev) => {
      const current = prev[projectId] ?? 0;
      const next = (current + delta + total) % total;
      return { ...prev, [projectId]: next };
    });
  };

  const handleSlideSelect = (
    e: React.MouseEvent,
    projectId: string,
    targetIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSlideIndices((prev) => ({ ...prev, [projectId]: targetIndex }));
  };

  // Secret keyboard commands: "tardis", "stars", "herb"
  useEffect(() => {
    let buffer = '';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTardisModalOpen(false);
        setStarsModalOpen(false);
        return;
      }
      if (e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-10);
        if (buffer.endsWith('tardis')) {
          triggerTardisEffect();
          setTardisModalOpen(true);
          buffer = '';
        } else if (buffer.endsWith('stars')) {
          setStarsModalOpen(true);
          buffer = '';
        } else if (buffer.endsWith('herb')) {
          setVitality('FINE');
          setQuickBanner({
            type: 'RE',
            title: 'STATUS: FINE',
            message:
              lang === 'en'
                ? 'Green Herb applied. Vital condition restored.'
                : 'Green Herb utilizada. Condição vital restaurada.',
          });
          buffer = '';
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lang]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'pt' : 'en'));
  };

  const triggerTardisEffect = () => {
    setTardisMaterializing(true);
    setTimeout(() => setTardisMaterializing(false), 1200);
  };

  const handleLattesRedirect = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    if (checkingLattes) return;

    setCheckingLattes(true);
    const targetTab = window.open('about:blank', '_blank');
    try {
      const targetUrl = await resolveOnlineLattesUrl();
      if (targetTab && !targetTab.closed) {
        targetTab.location.replace(targetUrl);
      } else {
        window.location.href = targetUrl;
      }
    } finally {
      setCheckingLattes(false);
    }
  };

  const cycleVitality = () => {
    if (vitality === 'FINE') {
      setVitality('CAUTION');
    } else if (vitality === 'CAUTION') {
      setVitality('DANGER');
    } else {
      setVitality('FINE');
    }
  };

  const handleUseInkRibbon = () => {
    setVitality('FINE');
    setStarsSavedOnce(true);
    if (inkRibbons > 0) {
      setInkRibbons(inkRibbons - 1);
    } else {
      setInkRibbons(3);
    }
  };

  const handleCycleSonic = () => {
    triggerTardisEffect();
    setTardisQuoteIdx((prev) => (prev + 1) % TARDIS_QUOTES[lang].length);
  };

  const filteredProjects =
    activeFilter === 'todos'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  const ecgClass =
    vitality === 'FINE'
      ? 'ecg-fine'
      : vitality === 'CAUTION'
      ? 'ecg-caution'
      : 'ecg-danger';

  const rawExperiences =
    lattesData.experiences && lattesData.experiences.length > 0
      ? lattesData.experiences
      : content.defaultExperiences;

  const experiencesToDisplay = rawExperiences.map((exp) =>
    localizeExperience(exp, lang)
  );

  const starsModalText = !starsSavedOnce
    ? lang === 'en'
      ? 'Spencer Mansion Save Room. An old typewriter sits on the desk next to the PyTorch inference server.'
      : 'Save Room da Mansão Spencer. Há uma máquina de escrever sobre a mesa ao lado do servidor PyTorch.'
    : lang === 'en'
    ? `Session saved on the typewriter. (Ink Ribbons left: 0${inkRibbons})`
    : `Sessão gravada na máquina de escrever. (Ink Ribbons restantes: 0${inkRibbons})`;

  return (
    <div
      className={`page-wrapper ${tardisMaterializing ? 'tardis-vworp' : ''}`}
    >
      {/* Minimalist Sticky Header */}
      <header className="site-header">
        <div className="max-container header-inner">
          <a href="#topo" className="font-headline text-title-lg brand-link">
            {PROFILE_META.name}
          </a>

          <div className="header-right">
            <nav aria-label="Main navigation" className="main-nav">
              <a href="#sobre" className="font-body text-label-lg nav-link">
                {content.nav.about}
              </a>
              <a href="#skills" className="font-body text-label-lg nav-link">
                {content.nav.skills}
              </a>
              <a href="#projetos" className="font-body text-label-lg nav-link">
                {content.nav.projects}
              </a>
              <a href="#artigos" className="font-body text-label-lg nav-link">
                {content.nav.articles}
              </a>
            </nav>

            <div className="header-controls">
              {/* Minimalist ECG status pill */}
              <button
                type="button"
                onClick={cycleVitality}
                className={`ecg-btn font-label text-label-md ${ecgClass}`}
                title={`Status: ${vitality}`}
                aria-label={`Vitality status: ${vitality}`}
              >
                <span className="ecg-dot" />
                <Activity size={13} />
                <span className="ecg-label">{vitality}</span>
              </button>

              {/* Language Switcher EN / PT */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="theme-btn font-label text-label-md"
                aria-label={
                  lang === 'en'
                    ? 'Switch language to Portuguese'
                    : 'Mudar idioma para Inglês'
                }
                title={
                  lang === 'en'
                    ? 'Mudar idioma para Português (PT)'
                    : 'Switch language to English (EN)'
                }
              >
                <Languages size={15} />
                <span>
                  <strong
                    style={{
                      color:
                        lang === 'en'
                          ? 'var(--primary)'
                          : 'var(--on-surface-variant)',
                    }}
                  >
                    EN
                  </strong>
                  {' / '}
                  <strong
                    style={{
                      color:
                        lang === 'pt'
                          ? 'var(--accent-green)'
                          : 'var(--on-surface-variant)',
                    }}
                  >
                    PT
                  </strong>
                </span>
              </button>

              {/* Light / Dark Mode Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={content.themeToggle.aria}
                className="theme-btn font-label text-label-md"
                title={content.themeToggle.aria}
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                <span>
                  {theme === 'dark'
                    ? content.themeToggle.light
                    : content.themeToggle.dark}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="topo" className="max-container main-content">
        {quickBanner && (
          <div
            className={`telemetry-banner ${
              quickBanner.type === 'RE' ? 're-banner' : ''
            }`}
            role="status"
          >
            <div className="telemetry-inline">
              <span
                className="font-label text-label-md"
                style={{
                  color:
                    quickBanner.type === 'RE'
                      ? 'var(--re-fine)'
                      : 'var(--primary)',
                }}
              >
                {quickBanner.title}
              </span>
              <span
                className="font-body text-body-md"
                style={{ color: 'var(--on-surface)' }}
              >
                {quickBanner.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setQuickBanner(null)}
              className="telemetry-close font-label text-label-md"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        {/* Asymmetric Split Landing Hero */}
        <section aria-labelledby="hero-title" className="hero-grid">
          <div className="hero-left">
            <p className="font-label text-label-md hero-kicker">
              <span className="kicker-dot" />
              {content.kicker}
            </p>
            <h1 id="hero-title" className="font-display text-display-lg">
              {content.heroTitle}
            </h1>
            <p className="font-body text-body-lg hero-lead">
              {content.heroLead}
            </p>

            <div className="hero-actions">
              <a
                href="#projetos"
                className="btn-primary font-body text-label-lg"
              >
                <span>{content.ctaProjects}</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#artigos"
                className="btn-secondary font-body text-label-lg"
              >
                <span>{content.ctaArticles}</span>
              </a>
            </div>

            {/* Social profiles */}
            <div className="social-links-row font-label">
              <a
                href={PROFILE_META.socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-anchor"
              >
                <Github size={16} />
                <span>GitHub</span>
                <span className="social-handle">
                  @{PROFILE_META.socials.github.handle}
                </span>
              </a>

              <a
                href={PROFILE_META.socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-anchor"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
                <span className="social-handle">
                  /{PROFILE_META.socials.linkedin.handle}
                </span>
              </a>

              <a
                href={PROFILE_META.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-anchor"
              >
                <Instagram size={16} />
                <span>Instagram</span>
                <span className="social-handle">
                  @{PROFILE_META.socials.instagram.handle}
                </span>
              </a>

              <a
                href={LATTES_CANDIDATE_URLS[0]}
                onClick={handleLattesRedirect}
                className="social-anchor"
                title={content.lattesLabel}
              >
                <FileText size={16} />
                <span>
                  {checkingLattes ? content.lattesChecking : content.lattesLabel}
                </span>
              </a>
            </div>
          </div>

          <div className="hero-right">
            <div className="portrait-box">
              <img
                src={PROFILE_META.avatarUrl}
                alt={PROFILE_META.name}
                className="portrait-img"
              />
            </div>
          </div>
        </section>

        {/* 01 / ABOUT ME & EXPERIENCE */}
        <section
          id="sobre"
          aria-labelledby="sobre-title"
          className="section-hairline"
        >
          <div className="section-col-left">
            <span className="font-label text-label-md section-index">
              {content.sections.aboutIndex}
            </span>
            <h2 id="sobre-title" className="font-headline text-headline-lg">
              {content.sections.aboutTitle}
            </h2>
          </div>

          <div className="section-col-right">
            <div className="about-prose font-body text-body-lg">
              {content.aboutParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="timeline-list">
              {experiencesToDisplay.map((exp, idx) => (
                <div key={idx} className="timeline-row">
                  <span className="timeline-period font-label text-label-md">
                    {exp.period}
                  </span>
                  <div className="timeline-body">
                    <h3 className="font-title text-title-md">{exp.title}</h3>
                    <p className="font-body text-body-md timeline-desc">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 02 / SKILLS & TECHNOLOGIES (Grid of Boxes with Icons) */}
        <section
          id="skills"
          aria-labelledby="skills-title"
          className="skills-section"
        >
          <div className="skills-header">
            <div className="skills-header-titles">
              <span className="font-label text-label-md section-index accent-green-text">
                {content.sections.skillsIndex}
              </span>
              <h2 id="skills-title" className="font-headline text-headline-lg">
                {content.sections.skillsTitle}
              </h2>
            </div>
            <p className="font-body text-body-md skills-lead-text">
              {content.skillsLead}
            </p>
          </div>

          <div className="skills-boxes-grid">
            {content.skillBoxes.map((box) => (
              <article
                key={box.id}
                className={`skill-box-card accent-${box.accent}`}
              >
                <div className="skill-box-top">
                  <div className={`skill-icon-badge accent-${box.accent}`}>
                    {renderSkillIcon(box.icon)}
                  </div>
                  <div className="skill-box-titles">
                    <h3 className="font-headline text-title-lg">
                      {box.title}
                    </h3>
                    <span className="font-label text-label-md skill-box-sub">
                      {box.subtitle}
                    </span>
                  </div>
                </div>

                <ul className="skill-box-list font-body text-body-md">
                  {box.items.map((item) => (
                    <li key={item} className="skill-box-item">
                      <span className="skill-item-bullet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* 03 / PROJECTS */}
        <section
          id="projetos"
          aria-labelledby="projetos-title"
          className="projects-section"
        >
          <div className="projects-header">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <span className="font-label text-label-md section-index">
                {content.sections.projectsIndex}
              </span>
              <h2
                id="projetos-title"
                className="font-headline text-headline-lg"
              >
                {content.sections.projectsTitle}
              </h2>
            </div>

            <div
              className="filter-tabs"
              role="group"
              aria-label="Filter projects"
            >
              {(
                [
                  { id: 'todos', label: content.filters.todos },
                  { id: 'backend-rag', label: content.filters['backend-rag'] },
                  { id: 'ia-pesquisa', label: content.filters['ia-pesquisa'] },
                  { id: 'web', label: content.filters.web },
                ] as { id: FilterCategory; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  aria-pressed={activeFilter === tab.id}
                  className={`filter-tab font-body text-label-lg ${
                    activeFilter === tab.id ? 'active' : ''
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="projects-stack">
            {filteredProjects.map((project, index) => {
              const gallery = resolveGalleryForProject(project, index);
              const totalSlides = gallery.length;
              const currentSlide =
                totalSlides > 0
                  ? (slideIndices[project.id] ?? 0) % totalSlides
                  : 0;
              const activeImageSrc =
                totalSlides > 0 ? gallery[currentSlide] : undefined;

              return (
                <article
                  key={project.id}
                  className={`project-case ${index % 2 === 1 ? 'reverse' : ''}`}
                >
                  <div className="project-preview">
                    <a
                      href={project.deployUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-preview-link"
                      aria-label={`${content.projectCta.deploy} - ${project.title}`}
                    >
                      {activeImageSrc ? (
                        <img
                          key={activeImageSrc}
                          src={activeImageSrc}
                          alt={`${project.title} (${currentSlide + 1}/${totalSlides})`}
                          className="project-carousel-img"
                          onError={() =>
                            setFailedImages((prev) => ({
                              ...prev,
                              [activeImageSrc]: true,
                            }))
                          }
                        />
                      ) : (
                        <div className="project-preview-grid">
                          <Terminal
                            size={28}
                            style={{ color: 'var(--primary)', opacity: 0.9 }}
                          />
                          <span
                            className="font-headline text-title-lg"
                            style={{ color: 'var(--on-surface)' }}
                          >
                            {project.title}
                          </span>
                          {project.architectureNote && (
                            <span
                              className="font-label text-label-md"
                              style={{
                                color: 'var(--primary)',
                                maxWidth: '38ch',
                                lineHeight: 1.5,
                              }}
                            >
                              {project.architectureNote}
                            </span>
                          )}
                          <span
                            className="font-label text-label-md"
                            style={{
                              color: 'var(--on-surface-variant)',
                              marginTop: '0.25rem',
                            }}
                          >
                            {project.deployUrl.replace(/^https?:\/\//, '')} ↗
                          </span>
                        </div>
                      )}
                    </a>

                    {totalSlides > 1 && (
                      <>
                        <button
                          type="button"
                          className="carousel-nav-btn prev"
                          onClick={(e) =>
                            handleSlideStep(e, project.id, totalSlides, -1)
                          }
                          aria-label={
                            lang === 'en' ? 'Previous photo' : 'Foto anterior'
                          }
                          title={
                            lang === 'en' ? 'Previous photo' : 'Foto anterior'
                          }
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          type="button"
                          className="carousel-nav-btn next"
                          onClick={(e) =>
                            handleSlideStep(e, project.id, totalSlides, 1)
                          }
                          aria-label={
                            lang === 'en' ? 'Next photo' : 'Próxima foto'
                          }
                          title={lang === 'en' ? 'Next photo' : 'Próxima foto'}
                        >
                          <ChevronRight size={18} />
                        </button>

                        <div className="carousel-badge font-label text-label-md">
                          {currentSlide + 1} / {totalSlides}
                        </div>

                        <div
                          className="carousel-dots"
                          role="tablist"
                          aria-label={
                            lang === 'en'
                              ? 'Project photos navigation'
                              : 'Navegação de fotos do projeto'
                          }
                        >
                          {gallery.map((imgUrl, dotIdx) => (
                            <button
                              key={imgUrl}
                              type="button"
                              role="tab"
                              aria-selected={dotIdx === currentSlide}
                              aria-label={
                                lang === 'en'
                                  ? `Photo ${dotIdx + 1} of ${totalSlides}`
                                  : `Foto ${dotIdx + 1} de ${totalSlides}`
                              }
                              className={`carousel-dot ${
                                dotIdx === currentSlide ? 'active' : ''
                              }`}
                              onClick={(e) =>
                                handleSlideSelect(e, project.id, dotIdx)
                              }
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="project-info">
                    <span className="font-label text-label-md project-meta">
                      {project.meta[lang]}
                    </span>
                    <h3 className="font-headline text-headline-md">
                      {project.title}
                    </h3>
                    <p className="font-body text-body-md project-desc">
                      {project.description[lang]}
                    </p>
                    <p className="font-label text-label-md project-tech">
                      {project.stackLine[lang]}
                    </p>
                    <div className="project-links-row">
                      <a
                        href={project.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-cta font-body text-label-lg"
                      >
                        <span>{content.projectCta.deploy}</span>
                        <ArrowRight size={16} />
                      </a>

                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-cta secondary font-body text-label-lg"
                        >
                          <span>{content.projectCta.repo}</span>
                          <ArrowUpRight size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 04 / SCIENTIFIC ARTICLES */}
        <section
          id="artigos"
          aria-labelledby="artigos-title"
          className="section-hairline"
        >
          <div className="section-col-left">
            <span className="font-label text-label-md section-index accent-green-text">
              {content.sections.articlesIndex}
            </span>
            <h2 id="artigos-title" className="font-headline text-headline-lg">
              {content.sections.articlesTitle}
            </h2>
          </div>

          <div className="section-col-right">
            <div className="articles-index">
              {lattesData.articles.map((article) => (
                <article key={article.id} className="article-row">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <h3 className="font-title text-title-md article-row-title">
                      {article.title}
                    </h3>
                    <span className="font-label text-label-md article-row-meta">
                      {article.year} • {article.event.replace(/\s*—\s*/g, ' · ')}
                    </span>
                    {article.authors && (
                      <span
                        className="font-body text-label-md"
                        style={{ color: 'var(--outline)' }}
                      >
                        {article.authors}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer with Minimalist Easter Egg Triggers */}
      <footer className="site-footer">
        <div className="max-container footer-inner">
          <p className="font-body text-body-md footer-copy">
            © {new Date().getFullYear()} {PROFILE_META.name} · UNESP / LIPAI
          </p>

          <div className="footer-easter-triggers font-label text-label-md">
            <button
              type="button"
              onClick={() => {
                triggerTardisEffect();
                setTardisModalOpen(true);
              }}
              className="footer-trigger-btn"
              title="TARDIS Console"
            >
              TARDIS
            </button>
            <span style={{ color: 'var(--outline)' }} aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              onClick={() => setStarsModalOpen(true)}
              className="footer-trigger-btn"
              title="S.T.A.R.S. Save Room"
            >
              S.T.A.R.S. (0{inkRibbons})
            </button>
          </div>
        </div>
      </footer>

      {/* Minimalist Easter Egg Modal #1: Doctor Who */}
      {tardisModalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tardis-title"
          onClick={() => setTardisModalOpen(false)}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3 id="tardis-title" className="font-headline text-title-lg">
                TARDIS · Type 40
              </h3>
              <button
                type="button"
                onClick={() => setTardisModalOpen(false)}
                aria-label="Close TARDIS console"
                className="modal-close-btn"
              >
                <X size={15} />
              </button>
            </header>

            <p className="font-body text-body-md modal-quote">
              {TARDIS_QUOTES[lang][tardisQuoteIdx]}
            </p>

            <div className="modal-footer-box">
              <span className="font-label text-label-md">
                {432 + tardisQuoteIdx * 108} Hz
              </span>
              <button
                type="button"
                onClick={handleCycleSonic}
                className="modal-action-btn font-label text-label-md"
              >
                {lang === 'en' ? 'Next quote' : 'Próxima citação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimalist Easter Egg Modal #2: Resident Evil */}
      {starsModalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stars-title"
          onClick={() => setStarsModalOpen(false)}
        >
          <div
            className="modal-card re-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <h3 id="stars-title" className="font-headline text-title-lg">
                S.T.A.R.S. · Save Room
              </h3>
              <button
                type="button"
                onClick={() => setStarsModalOpen(false)}
                aria-label="Close S.T.A.R.S. terminal"
                className="modal-close-btn"
              >
                <X size={15} />
              </button>
            </header>

            <p className="font-body text-body-md modal-quote">
              {starsModalText}
            </p>

            <div className="modal-footer-box">
              <span className="font-label text-label-md">
                STATUS: {vitality}
              </span>
              <button
                type="button"
                onClick={handleUseInkRibbon}
                className="modal-action-btn font-label text-label-md"
              >
                {lang === 'en' ? 'Save (Ink Ribbon)' : 'Salvar (Ink Ribbon)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
