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
} from 'lucide-react';
import {
  PROFILE_META,
  LOCALIZED_CONTENT,
  PROJECTS,
  INITIAL_LATTES_DATA,
  LattesPayload,
  Language,
  ExperienceRow,
} from './data/portfolioData';

type ThemeMode = 'dark' | 'light';
type VitalityState = 'FINE' | 'CAUTION' | 'DANGER';
type FilterCategory = 'todos' | 'backend-rag' | 'ia-pesquisa' | 'web';

const TARDIS_QUOTES: Record<Language, string[]> = {
  en: [
    '“People assume that time is a strict progression of cause to effect, but actually—from a non-linear, non-subjective viewpoint—it’s more like a big ball of wibbly-wobbly, timey-wimey... stuff.”',
    '“Allons-y! Every well-designed AI architecture is bigger on the inside than it looks on the diagram.”',
    '“Never cruel or cowardly. Never give up, never give in.” — 12th Doctor (Coords: Gallifrey 10-0-11-0-0 by 0-2)',
  ],
  pt: [
    '“People assume that time is a strict progression of cause to effect, but actually—from a non-linear, non-subjective viewpoint—it’s more like a big ball of wibbly-wobbly, timey-wimey... stuff.”',
    '“Allons-y! Toda arquitetura de IA bem projetada é maior por dentro do que parece no diagrama.”',
    '“Never cruel or cowardly. Never give up, never give in.” — 12th Doctor (Coordenadas: Gallifrey 10-0-11-0-0 by 0-2)',
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
  let title = exp.title.replace(
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

export const App: React.FC = () => {
  // Default language: 'en' (English) as requested
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

  // Resident Evil ECG & Save Room Easter Egg State
  const [vitality, setVitality] = useState<VitalityState>('FINE');
  const [inkRibbons, setInkRibbons] = useState<number>(3);
  const [starsModalOpen, setStarsModalOpen] = useState<boolean>(false);
  const [starsSavedOnce, setStarsSavedOnce] = useState<boolean>(false);

  // Doctor Who TARDIS Easter Egg State
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
  }, []);

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
            title:
              lang === 'en'
                ? 'GREEN HERB USED // STATUS: FINE'
                : 'GREEN HERB UTILIZADA // STATUS: FINE',
            message:
              lang === 'en'
                ? 'Vital condition restored to 100%. "Nothing dies down here." (Raccoon City, 1998)'
                : 'Condição vital restaurada para 100%. "Nothing dies down here." (Raccoon City, 1998)',
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
    setTimeout(() => setTardisMaterializing(false), 1500);
  };

  const handleLattesRedirect = async (e: React.MouseEvent<HTMLAnchorElement>) => {
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
      setQuickBanner({
        type: 'RE',
        title: 'R.P.D. BIO-MONITOR // STATUS: CAUTION',
        message:
          lang === 'en'
            ? '“Itchy. Tasty...” — Keeper’s Diary (Spencer Mansion, 1998). Click again or type "herb" to heal.'
            : '“Itchy. Tasty...” — Diário do Guardião (Spencer Mansion, 1998). Clique novamente ou digite "herb" para curar.',
      });
    } else if (vitality === 'CAUTION') {
      setVitality('DANGER');
      setQuickBanner({
        type: 'RE',
        title: 'R.P.D. BIO-MONITOR // STATUS: DANGER',
        message:
          lang === 'en'
            ? '“You want S.T.A.R.S.? I’ll give you S.T.A.R.S.!” — Jill Valentine. Click once more to apply Mixed Herb (G+R).'
            : '“You want S.T.A.R.S.? I’ll give you S.T.A.R.S.!” — Jill Valentine. Clique mais uma vez para usar Mixed Herb (G+R).',
      });
    } else {
      setVitality('FINE');
      setQuickBanner({
        type: 'RE',
        title:
          lang === 'en'
            ? 'MIXED HERB (G+R) APPLIED // STATUS: FINE'
            : 'MIXED HERB (G+R) APLICADA // STATUS: FINE',
        message:
          lang === 'en'
            ? 'Vital signs stabilized. Tip: you can also type "stars" or "tardis" on your keyboard anytime.'
            : 'Sinais vitais estabilizados. Dica: você também pode digitar "stars" ou "tardis" no teclado a qualquer momento.',
      });
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
      ? 'You entered the Spencer Mansion Save Room. There is an old typewriter on the desk and a Mixed Herb (G+R) next to the PyTorch inference server.'
      : 'Você entrou na Save Room da Mansão Spencer. Há uma máquina de escrever antiga sobre a mesa e uma mistura de ervas (G+R) ao lado do servidor de inferência PyTorch.'
    : lang === 'en'
    ? `Progress recorded on the Spencer Mansion typewriter. The embeddings and PyTorch server remains protected against the T-Virus. (Ink Ribbons left: 0${inkRibbons})`
    : `Progresso gravado na máquina de escrever da Mansão Spencer. O servidor de embeddings e modelos PyTorch está protegido contra o T-Virus. (Ink Ribbons restantes: 0${inkRibbons})`;

  return (
    <div className={`page-wrapper ${tardisMaterializing ? 'tardis-vworp' : ''}`}>
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
              {/* Resident Evil ECG Vitality Indicator */}
              <button
                type="button"
                onClick={cycleVitality}
                className={`ecg-btn font-label text-label-md ${ecgClass}`}
                title="R.P.D. Bio-Monitor (Resident Evil Easter Egg)"
              >
                <span className="ecg-dot" />
                <Activity size={13} />
                <span>ECG:{vitality}</span>
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
                          ? 'var(--primary)'
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
        {/* Quick Telemetry Notification when ECG or keyboard easter egg triggers */}
        {quickBanner && (
          <div
            className={`telemetry-banner ${
              quickBanner.type === 'RE' ? 're-banner' : ''
            }`}
            role="status"
          >
            <div>
              <div
                className="font-label text-label-md"
                style={{
                  color:
                    quickBanner.type === 'RE' ? 'var(--re-fine)' : 'var(--primary)',
                  marginBottom: '0.25rem',
                }}
              >
                {quickBanner.title}
              </div>
              <p className="font-body text-body-md" style={{ color: 'var(--on-surface)' }}>
                {quickBanner.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setQuickBanner(null)}
              className="telemetry-close font-label text-label-md"
              aria-label="Close"
            >
              {lang === 'en' ? 'close' : 'fechar'}
            </button>
          </div>
        )}

        {/* Asymmetric Split Landing Hero */}
        <section aria-labelledby="hero-title" className="hero-grid">
          <div className="hero-left">
            <p className="font-label text-label-md hero-kicker">
              {content.kicker}
            </p>
            <h1 id="hero-title" className="font-display text-display-lg">
              {content.heroTitle}
            </h1>
            <p className="font-body text-body-lg hero-lead">
              {content.heroLead}
            </p>

            <div className="hero-actions">
              <a href="#projetos" className="btn-primary font-body text-label-lg">
                <span>{content.ctaProjects}</span>
              </a>
              <a href="#artigos" className="btn-secondary font-body text-label-lg">
                <span>{content.ctaArticles}</span>
              </a>
            </div>

            {/* Social profiles: GitHub (LHLobato), LinkedIn (lhs-lobato), Instagram (lhs.lobato) & Lattes */}
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
        <section id="sobre" aria-labelledby="sobre-title" className="section-hairline">
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

        {/* 02 / SKILLS */}
        <section id="skills" aria-labelledby="skills-title" className="section-hairline">
          <div className="section-col-left">
            <span className="font-label text-label-md section-index">
              {content.sections.skillsIndex}
            </span>
            <h2 id="skills-title" className="font-headline text-headline-lg">
              {content.sections.skillsTitle}
            </h2>
          </div>

          <div className="section-col-right">
            <p className="font-body text-body-md skills-lead-box">
              {content.skillsLead}
            </p>

            <div className="skills-matrix">
              {content.skillColumns.map((col) => (
                <div key={col.title} className="skill-col">
                  <h3 className="font-title text-title-lg skill-col-title">
                    {col.title}
                  </h3>
                  <ul className="skill-ul font-body text-body-md">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 / PROJECTS */}
        <section
          id="projetos"
          aria-labelledby="projetos-title"
          className="projects-section"
        >
          <div className="projects-header">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span className="font-label text-label-md section-index">
                {content.sections.projectsIndex}
              </span>
              <h2 id="projetos-title" className="font-headline text-headline-lg">
                {content.sections.projectsTitle}
              </h2>
            </div>

            <div className="filter-tabs" role="group" aria-label="Filter projects">
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
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                className={`project-case ${index % 2 === 1 ? 'reverse' : ''}`}
              >
                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-preview"
                  style={{ textDecoration: 'none' }}
                  aria-label={`${content.projectCta.deploy} - ${project.title}`}
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '6px',
                      }}
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
                        lhlobato.github.io/what_anime_is_it_from ↗
                      </span>
                    </div>
                  )}
                </a>

                <div className="project-info">
                  <span className="font-label text-label-md project-meta">
                    {project.meta[lang]}
                  </span>
                  <h3 className="font-headline text-headline-md">{project.title}</h3>
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
            ))}
          </div>
        </section>

        {/* 04 / SCIENTIFIC ARTICLES (Static / Non-clickable) */}
        <section id="artigos" aria-labelledby="artigos-title" className="section-hairline">
          <div className="section-col-left">
            <span className="font-label text-label-md section-index">
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <h3 className="font-title text-title-md article-row-title">
                      {article.title}
                    </h3>
                    <span className="font-label text-label-md article-row-meta">
                      {article.year} • {article.event}
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

      {/* Clean Footer with Dual Easter Egg Triggers */}
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
              title={
                lang === 'en'
                  ? "Open TARDIS Console (or type 'tardis')"
                  : "Abrir Console TARDIS (ou digite 'tardis')"
              }
            >
              TARDIS // 10-0-11-00:02 (Bad Wolf)
            </button>
            <span style={{ color: 'var(--outline)' }} aria-hidden="true">
              ·
            </span>
            <button
              type="button"
              onClick={() => setStarsModalOpen(true)}
              className="footer-trigger-btn"
              title={
                lang === 'en'
                  ? "Open S.T.A.R.S. Save Room (or type 'stars')"
                  : "Abrir Save Room S.T.A.R.S. (ou digite 'stars')"
              }
            >
              S.T.A.R.S. // Spencer Mansion 1998 (Ink Ribbon x0{inkRibbons})
            </button>
          </div>
        </div>
      </footer>

      {/* Easter Egg Modal #1: Doctor Who (TARDIS Type 40 Console) */}
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
              <h3 id="tardis-title" className="font-headline text-headline-md">
                {lang === 'en'
                  ? 'TARDIS Console — Type 40'
                  : 'Console TARDIS — Tipo 40'}
              </h3>
              <button
                type="button"
                onClick={() => setTardisModalOpen(false)}
                aria-label="Close TARDIS console"
                className="modal-close-btn"
              >
                <X size={16} />
              </button>
            </header>

            <p className="font-label text-label-md modal-kicker">
              SIGNAL: BAD WOLF • GALLIFREY_COORDS: 10-0-11-00-02 • BIGGER ON THE INSIDE
            </p>

            <p className="font-body text-body-md modal-quote">
              {TARDIS_QUOTES[lang][tardisQuoteIdx]}
            </p>

            <div className="modal-footer-box">
              <span className="font-label text-label-md">
                Sonic Screwdriver: {432 + tardisQuoteIdx * 108} Hz{' '}
                {lang === 'en' ? '(doesn’t do wood)' : '(exceto madeira)'}
              </span>
              <button
                type="button"
                onClick={handleCycleSonic}
                className="modal-action-btn font-label text-label-md"
              >
                {lang === 'en' ? 'Calibrate Frequency' : 'Calibrar Frequência'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Easter Egg Modal #2: Resident Evil (S.T.A.R.S. Save Room Terminal) */}
      {starsModalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stars-title"
          onClick={() => setStarsModalOpen(false)}
        >
          <div className="modal-card re-modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3 id="stars-title" className="font-headline text-headline-md">
                S.T.A.R.S. — Save Room Terminal
              </h3>
              <button
                type="button"
                onClick={() => setStarsModalOpen(false)}
                aria-label="Close S.T.A.R.S. terminal"
                className="modal-close-btn"
              >
                <X size={16} />
              </button>
            </header>

            <p className="font-label text-label-md modal-kicker">
              {lang === 'en'
                ? `FILE: SPENCER MANSION • ALPHA TEAM • INK RIBBON x0${inkRibbons}`
                : `ARQUIVO: MANSÃO SPENCER • EQUIPE ALPHA • INK RIBBON x0${inkRibbons}`}
            </p>

            <p className="font-body text-body-md modal-quote">{starsModalText}</p>

            <div className="modal-footer-box">
              <span className="font-label text-label-md">
                ECG STATUS: {vitality} (100%)
              </span>
              <button
                type="button"
                onClick={handleUseInkRibbon}
                className="modal-action-btn font-label text-label-md"
              >
                {lang === 'en' ? 'Use Ink Ribbon' : 'Usar Ink Ribbon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
