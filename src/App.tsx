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
} from 'lucide-react';
import {
  PROFILE_DATA,
  PROJECTS,
  INITIAL_LATTES_DATA,
  LattesPayload,
} from './data/portfolioData';

type ThemeMode = 'dark' | 'light';
type VitalityState = 'FINE' | 'CAUTION' | 'DANGER';
type FilterCategory = 'todos' | 'backend-rag' | 'ia-pesquisa' | 'web';

const TARDIS_QUOTES = [
  '“People assume that time is a strict progression of cause to effect, but actually—from a non-linear, non-subjective viewpoint—it’s more like a big ball of wibbly-wobbly, timey-wimey... stuff.”',
  '“Allons-y! Toda arquitetura de IA bem projetada é maior por dentro do que parece no diagrama.”',
  '“Never cruel or cowardly. Never give up, never give in.” — 12th Doctor (Coordenadas: Gallifrey 10-0-11-0-0 by 0-2)',
];

const LATTES_CANDIDATE_URLS = PROFILE_DATA.socials.lattes.urls;

async function isUrlReachable(url: string, timeoutMs = 3500): Promise<boolean> {
  // Evita erro de Mixed Content caso a página esteja em HTTPS e a URL candidata seja HTTP
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
  // Fallback caso o navegador bloqueie o probe de rede
  return LATTES_CANDIDATE_URLS[0];
}

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('lhlobato-theme') as ThemeMode | null;
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('todos');

  // Dados do Currículo Lattes carregados automaticamente do PDF em /assets
  const [lattesData, setLattesData] = useState<LattesPayload>(INITIAL_LATTES_DATA);
  const [checkingLattes, setCheckingLattes] = useState<boolean>(false);

  // Resident Evil ECG & Save Room Easter Egg State
  const [vitality, setVitality] = useState<VitalityState>('FINE');
  const [inkRibbons, setInkRibbons] = useState<number>(3);
  const [starsModalOpen, setStarsModalOpen] = useState<boolean>(false);
  const [starsLog, setStarsLog] = useState<string>(
    'Você entrou na Save Room da Mansão Spencer. Há uma máquina de escrever antiga sobre a mesa e uma mistura de ervas (G+R) ao lado do servidor de inferência PyTorch.'
  );

  // Doctor Who TARDIS Easter Egg State
  const [tardisModalOpen, setTardisModalOpen] = useState<boolean>(false);
  const [tardisQuoteIdx, setTardisQuoteIdx] = useState<number>(0);
  const [tardisMaterializing, setTardisMaterializing] = useState<boolean>(false);

  // Quick banner for ECG click or keyboard shortcut
  const [quickBanner, setQuickBanner] = useState<{
    type: 'RE' | 'DW';
    title: string;
    message: string;
  } | null>(null);

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

  // Busca automática em runtime de ./lattes.json (gerado pelo extrator do PDF em /assets)
  useEffect(() => {
    fetch('./lattes.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LattesPayload | null) => {
        if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setLattesData(data);
        }
      })
      .catch(() => {
        // Fallback silencioso para os dados já embutidos no build
      });
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
            title: 'GREEN HERB UTILIZADA // STATUS: FINE',
            message:
              'Condição vital restaurada para 100%. "Nothing dies down here." (Raccoon City, 1998)',
          });
          buffer = '';
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const triggerTardisEffect = () => {
    setTardisMaterializing(true);
    setTimeout(() => setTardisMaterializing(false), 1500);
  };

  // Verifica qual dos 2 links do Lattes está online e dispara apenas um redirecionamento
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
          '“Itchy. Tasty...” — Diário do Guardião (Spencer Mansion, 1998). Clique novamente ou digite "herb" para curar.',
      });
    } else if (vitality === 'CAUTION') {
      setVitality('DANGER');
      setQuickBanner({
        type: 'RE',
        title: 'R.P.D. BIO-MONITOR // STATUS: DANGER',
        message:
          '“You want S.T.A.R.S.? I’ll give you S.T.A.R.S.!” — Jill Valentine. Clique mais uma vez para usar Mixed Herb (G+R).',
      });
    } else {
      setVitality('FINE');
      setQuickBanner({
        type: 'RE',
        title: 'MIXED HERB (G+R) APLICADA // STATUS: FINE',
        message:
          'Sinais vitais estabilizados. Dica: você também pode digitar "stars" ou "tardis" no teclado a qualquer momento.',
      });
    }
  };

  const handleUseInkRibbon = () => {
    setVitality('FINE');
    if (inkRibbons > 0) {
      const remaining = inkRibbons - 1;
      setInkRibbons(remaining);
      setStarsLog(
        `Progresso gravado na máquina de escrever da Mansão Spencer. O servidor de embeddings e modelos PyTorch está protegido contra o T-Virus. (Ink Ribbons restantes: 0${remaining})`
      );
    } else {
      setInkRibbons(3);
      setStarsLog(
        'Você encontrou um novo pacote de Ink Ribbons no baú da Save Room! Progresso salvo e estoque restaurado (x03).'
      );
    }
  };

  const handleCycleSonic = () => {
    triggerTardisEffect();
    setTardisQuoteIdx((prev) => (prev + 1) % TARDIS_QUOTES.length);
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

  const experiencesToDisplay =
    lattesData.experiences && lattesData.experiences.length > 0
      ? lattesData.experiences
      : PROFILE_DATA.experiences;

  return (
    <div className={`page-wrapper ${tardisMaterializing ? 'tardis-vworp' : ''}`}>
      {/* Minimalist Sticky Header */}
      <header className="site-header">
        <div className="max-container header-inner">
          <a href="#topo" className="font-headline text-title-lg brand-link">
            {PROFILE_DATA.name}
          </a>

          <div className="header-right">
            <nav aria-label="Navegação principal" className="main-nav">
              <a href="#sobre" className="font-body text-label-lg nav-link">
                Sobre mim
              </a>
              <a href="#skills" className="font-body text-label-lg nav-link">
                Skills
              </a>
              <a href="#projetos" className="font-body text-label-lg nav-link">
                Projetos
              </a>
              <a href="#artigos" className="font-body text-label-lg nav-link">
                Artigos
              </a>
            </nav>

            <div className="header-controls">
              {/* Resident Evil ECG Vitality Indicator */}
              <button
                type="button"
                onClick={cycleVitality}
                className={`ecg-btn font-label text-label-md ${ecgClass}`}
                title="Monitor de Vitalidade R.P.D. (Easter Egg Resident Evil — clique para interagir)"
              >
                <span className="ecg-dot" />
                <Activity size={13} />
                <span>ECG:{vitality}</span>
              </button>

              {/* Light / Dark Mode Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Alternar entre modo claro e escuro"
                className="theme-btn font-label text-label-md"
                title={
                  theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'
                }
              >
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
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
              aria-label="Fechar aviso"
            >
              fechar
            </button>
          </div>
        )}

        {/* Asymmetric Split Landing Hero */}
        <section aria-labelledby="hero-title" className="hero-grid">
          <div className="hero-left">
            <p className="font-label text-label-md hero-kicker">
              {PROFILE_DATA.kicker}
            </p>
            <h1 id="hero-title" className="font-display text-display-lg">
              {PROFILE_DATA.heroTitle}
            </h1>
            <p className="font-body text-body-lg hero-lead">
              {PROFILE_DATA.heroLead}
            </p>

            <div className="hero-actions">
              <a href="#projetos" className="btn-primary font-body text-label-lg">
                <span>Explorar projetos</span>
              </a>
              <a href="#artigos" className="btn-secondary font-body text-label-lg">
                <span>Ler artigos publicados</span>
              </a>
            </div>

            {/* Social profiles: GitHub (LHLobato), LinkedIn (lhs-lobato), Instagram (lhslobato) & Currículo Lattes */}
            <div className="social-links-row font-label">
              <a
                href={PROFILE_DATA.socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-anchor"
              >
                <Github size={16} />
                <span>GitHub</span>
                <span className="social-handle">
                  @{PROFILE_DATA.socials.github.handle}
                </span>
              </a>

              <a
                href={PROFILE_DATA.socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-anchor"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
                <span className="social-handle">
                  /{PROFILE_DATA.socials.linkedin.handle}
                </span>
              </a>

              <a
                href={PROFILE_DATA.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-anchor"
              >
                <Instagram size={16} />
                <span>Instagram</span>
                <span className="social-handle">
                  @{PROFILE_DATA.socials.instagram.handle}
                </span>
              </a>

              <a
                href={LATTES_CANDIDATE_URLS[0]}
                onClick={handleLattesRedirect}
                className="social-anchor"
                title="Acessar Currículo Lattes"
              >
                <FileText size={16} />
                <span>{checkingLattes ? 'Verificando Lattes...' : 'Currículo Lattes'}</span>
              </a>
            </div>
          </div>

          <div className="hero-right">
            <div className="portrait-box">
              <img
                src={PROFILE_DATA.avatarUrl}
                alt={`Foto de ${PROFILE_DATA.name}`}
                className="portrait-img"
              />
            </div>
          </div>
        </section>

        {/* 01 / SOBRE MIM & EXPERIÊNCIA (Hairline Editorial Grid) */}
        <section id="sobre" aria-labelledby="sobre-title" className="section-hairline">
          <div className="section-col-left">
            <span className="font-label text-label-md section-index">
              01 / SOBRE MIM
            </span>
            <h2 id="sobre-title" className="font-headline text-headline-lg">
              Trajetória &amp; Pesquisa
            </h2>
          </div>

          <div className="section-col-right">
            <div className="about-prose font-body text-body-lg">
              {PROFILE_DATA.aboutParagraphs.map((paragraph, idx) => (
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

        {/* 02 / SKILLS (Clean Editorial Matrix without pill clutter) */}
        <section id="skills" aria-labelledby="skills-title" className="section-hairline">
          <div className="section-col-left">
            <span className="font-label text-label-md section-index">
              02 / SKILLS
            </span>
            <h2 id="skills-title" className="font-headline text-headline-lg">
              Especialidades
            </h2>
          </div>

          <div className="section-col-right">
            <p className="font-body text-body-md skills-lead-box">
              {PROFILE_DATA.skillsLead}
            </p>

            <div className="skills-matrix">
              {PROFILE_DATA.skillColumns.map((col) => (
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

        {/* 03 / PROJETOS (Clean Landing Case Studies — clicáveis para deploy) */}
        <section
          id="projetos"
          aria-labelledby="projetos-title"
          className="projects-section"
        >
          <div className="projects-header">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span className="font-label text-label-md section-index">
                03 / PROJETOS
              </span>
              <h2 id="projetos-title" className="font-headline text-headline-lg">
                Trabalhos selecionados
              </h2>
            </div>

            <div className="filter-tabs" role="group" aria-label="Filtrar projetos">
              {(
                [
                  { id: 'todos', label: 'Todos' },
                  { id: 'backend-rag', label: 'Backend & RAG' },
                  { id: 'ia-pesquisa', label: 'IA & Modelos' },
                  { id: 'web', label: 'Web & Sistemas' },
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
                  aria-label={`Abrir deploy do projeto ${project.title}`}
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                    {project.meta}
                  </span>
                  <h3 className="font-headline text-headline-md">{project.title}</h3>
                  <p className="font-body text-body-md project-desc">
                    {project.description}
                  </p>
                  <p className="font-label text-label-md project-tech">
                    {project.stackLine}
                  </p>
                  <div className="project-links-row">
                    <a
                      href={project.deployUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-cta font-body text-label-lg"
                    >
                      <span>Acessar projeto em deploy</span>
                      <ArrowRight size={16} />
                    </a>

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-cta secondary font-body text-label-lg"
                      >
                        <span>Repositório</span>
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 04 / ARTIGOS CIENTÍFICOS (Estáticos / Não clicáveis, sem exposição do ID) */}
        <section id="artigos" aria-labelledby="artigos-title" className="section-hairline">
          <div className="section-col-left">
            <span className="font-label text-label-md section-index">
              04 / ARTIGOS CIENTÍFICOS
            </span>
            <h2 id="artigos-title" className="font-headline text-headline-lg">
              Publicações
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
            © {new Date().getFullYear()} {PROFILE_DATA.name} · UNESP / LIPAI
          </p>

          <div className="footer-easter-triggers font-label text-label-md">
            <button
              type="button"
              onClick={() => {
                triggerTardisEffect();
                setTardisModalOpen(true);
              }}
              className="footer-trigger-btn"
              title="Abrir Console TARDIS (ou digite 'tardis' no teclado)"
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
              title="Abrir Save Room S.T.A.R.S. (ou digite 'stars' no teclado)"
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
                Console TARDIS — Tipo 40
              </h3>
              <button
                type="button"
                onClick={() => setTardisModalOpen(false)}
                aria-label="Fechar console TARDIS"
                className="modal-close-btn"
              >
                <X size={16} />
              </button>
            </header>

            <p className="font-label text-label-md modal-kicker">
              SIGNAL: BAD WOLF • GALLIFREY_COORDS: 10-0-11-00-02 • BIGGER ON THE INSIDE
            </p>

            <p className="font-body text-body-md modal-quote">
              {TARDIS_QUOTES[tardisQuoteIdx]}
            </p>

            <div className="modal-footer-box">
              <span className="font-label text-label-md">
                Sonic Screwdriver: {432 + tardisQuoteIdx * 108} Hz (exceto madeira)
              </span>
              <button
                type="button"
                onClick={handleCycleSonic}
                className="modal-action-btn font-label text-label-md"
              >
                Calibrar Frequência
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
                aria-label="Fechar terminal S.T.A.R.S."
                className="modal-close-btn"
              >
                <X size={16} />
              </button>
            </header>

            <p className="font-label text-label-md modal-kicker">
              ARQUIVO: MANSÃO SPENCER • EQUIPE ALPHA • INK RIBBON x0{inkRibbons}
            </p>

            <p className="font-body text-body-md modal-quote">{starsLog}</p>

            <div className="modal-footer-box">
              <span className="font-label text-label-md">
                ECG STATUS: {vitality} (100%)
              </span>
              <button
                type="button"
                onClick={handleUseInkRibbon}
                className="modal-action-btn font-label text-label-md"
              >
                Usar Ink Ribbon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
