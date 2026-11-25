import React, { useEffect, useState } from 'react';
import {
  PROFILE_DATA,
  PROJECTS,
  SCIENTIFIC_ARTICLES,
} from './data/portfolioData';

type ThemeMode = 'light' | 'dark';
type VitalityState = 'FINE' | 'CAUTION' | 'DANGER';

interface EasterEggMessage {
  universe: 'DOCTOR_WHO' | 'RESIDENT_EVIL';
  title: string;
  quote: string;
  detail: string;
}

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('lhlobato-theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [vitality, setVitality] = useState<VitalityState>('FINE');
  const [inkRibbons, setInkRibbons] = useState<number>(3);
  const [tardisActive, setTardisActive] = useState<boolean>(false);
  const [easterEgg, setEasterEgg] = useState<EasterEggMessage | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lhlobato-theme', theme);
  }, [theme]);

  useEffect(() => {
    let buffer = '';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-10);
        if (buffer.endsWith('tardis')) {
          triggerDoctorWhoEasterEgg();
          buffer = '';
        } else if (buffer.endsWith('stars') || buffer.endsWith('herb')) {
          triggerResidentEvilEasterEgg();
          buffer = '';
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const cycleVitality = () => {
    if (vitality === 'FINE') {
      setVitality('CAUTION');
      setEasterEgg({
        universe: 'RESIDENT_EVIL',
        title: 'R.P.D. Bio-Monitor // Status: CAUTION',
        quote: '"Itchy. Tasty..." — Diário do Guardião (Spencer Mansion, 1998)',
        detail: 'Clique novamente no status ou use uma Green Herb para restaurar.',
      });
    } else if (vitality === 'CAUTION') {
      setVitality('DANGER');
      setEasterEgg({
        universe: 'RESIDENT_EVIL',
        title: 'R.P.D. Bio-Monitor // Status: DANGER',
        quote: '"You want S.T.A.R.S.? I\'ll give you S.T.A.R.S.!" — Jill Valentine',
        detail: 'Sinais vitais críticos. Clique mais uma vez para aplicar Mixed Herb (G+R).',
      });
    } else {
      setVitality('FINE');
      setEasterEgg({
        universe: 'RESIDENT_EVIL',
        title: 'Mixed Herb (G+R) // Status: FINE',
        quote: 'Condição restaurada. Dica: você também pode digitar "stars" no teclado.',
        detail: 'Vitalidade normalizada.',
      });
    }
  };

  const triggerResidentEvilEasterEgg = () => {
    setVitality('FINE');
    const nextCount = inkRibbons > 0 ? inkRibbons - 1 : 3;
    setInkRibbons(nextCount);
    setEasterEgg({
      universe: 'RESIDENT_EVIL',
      title: 'Typewriter Save Room // Spencer Mansion',
      quote: 'Progresso registrado na máquina de escrever.',
      detail: `Status: FINE · Ink Ribbons restantes: ${nextCount} · S.T.A.R.S. Alpha Team`,
    });
  };

  const triggerDoctorWhoEasterEgg = () => {
    setTardisActive(true);
    setTimeout(() => setTardisActive(false), 1400);
    setEasterEgg({
      universe: 'DOCTOR_WHO',
      title: 'TARDIS Console // Type 40 Telemetry',
      quote:
        '"From a non-linear, non-subjective viewpoint, time is more like a big ball of wibbly-wobbly... timey-wimey... stuff."',
      detail:
        'Coordenadas: Gallifrey 10-0-11-0-0 by 0-2 · Bigger on the inside (dica: digite "tardis" a qualquer momento).',
    });
  };

  const vitalityClass =
    vitality === 'FINE'
      ? 'status-fine'
      : vitality === 'CAUTION'
      ? 'status-caution'
      : 'status-danger';

  return (
    <div className={`page-shell ${tardisActive ? 'tardis-shift' : ''}`}>
      {/* Header minimalista editorial */}
      <header className="topbar">
        <div className="topbar-inner">
          <a href="#sobre" className="brand-id mono">
            {PROFILE_DATA.shortName} <span>// UNESP · LIPAI</span>
          </a>

          <nav className="nav-row mono" aria-label="Seções">
            <a href="#sobre" className="nav-item">
              sobre
            </a>
            <a href="#skills" className="nav-item">
              skills
            </a>
            <a href="#projetos" className="nav-item">
              projetos
            </a>
            <a href="#artigos" className="nav-item">
              publicações
            </a>
          </nav>

          <div className="controls-row">
            <button
              type="button"
              onClick={cycleVitality}
              className={`text-btn vitality-trigger ${vitalityClass}`}
              title="ECG Bio-Monitor (Easter Egg Resident Evil)"
            >
              <span className="vitality-dot" />
              <span>ECG:{vitality}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="text-btn"
              aria-label="Alternar tema claro ou noturno"
            >
              [{theme === 'dark' ? 'modo:noturno' : 'modo:claro'}]
            </button>
          </div>
        </div>
      </header>

      {/* Log discreto para os Easter Eggs quando acionados */}
      {easterEgg && (
        <div
          className={`telemetry-log ${
            easterEgg.universe === 'RESIDENT_EVIL' ? 're-log' : ''
          }`}
          role="status"
        >
          <div>
            <div className="telemetry-header mono">{easterEgg.title}</div>
            <div className="telemetry-quote serif">
              <em>{easterEgg.quote}</em>
            </div>
            <div className="telemetry-detail mono">{easterEgg.detail}</div>
          </div>
          <button
            type="button"
            onClick={() => setEasterEgg(null)}
            className="text-btn"
            aria-label="Fechar log"
          >
            [fechar]
          </button>
        </div>
      )}

      <main>
        {/* 01 / Sobre Mim */}
        <section id="sobre" className="intro-section">
          <div className="intro-header">
            <div>
              <div className="intro-kicker mono">{PROFILE_DATA.headline}</div>
              <h1 className="intro-name serif">{PROFILE_DATA.name}</h1>
              <p className="intro-sub">{PROFILE_DATA.subheadline}</p>
            </div>

            <div className="profile-photo-frame">
              <img
                src={PROFILE_DATA.avatarUrl}
                alt={`Foto de ${PROFILE_DATA.name}`}
                className="profile-photo"
              />
            </div>
          </div>

          <div className="prose-about">
            {PROFILE_DATA.aboutMe.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="links-strip mono">
            <a
              href={PROFILE_DATA.socials.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ext-link"
            >
              <span>GitHub</span>
              <span className="ext-handle">/{PROFILE_DATA.socials.github.handle} ↗</span>
            </a>

            <a
              href={PROFILE_DATA.socials.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ext-link"
            >
              <span>LinkedIn</span>
              <span className="ext-handle">/{PROFILE_DATA.socials.linkedin.handle} ↗</span>
            </a>

            <a
              href={PROFILE_DATA.socials.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ext-link"
            >
              <span>Instagram</span>
              <span className="ext-handle">@{PROFILE_DATA.socials.instagram.handle} ↗</span>
            </a>
          </div>
        </section>

        {/* 02 / Skills & Stack */}
        <section id="skills" className="ed-section">
          <div className="ed-section-head mono">
            <h2 className="ed-section-title">01 / Stack & Especialidades</h2>
            <span className="ed-section-note">Produção & Pesquisa</span>
          </div>

          <p className="skills-lead">{PROFILE_DATA.skillsNote}</p>

          <div className="skills-table">
            {PROFILE_DATA.skillGroups.map((group) => (
              <div key={group.category} className="skill-row">
                <div className="skill-cat mono">{group.category}</div>
                <div className="skill-items">
                  {group.items.map((item) => (
                    <span key={item} className="skill-token">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 03 / Projetos */}
        <section id="projetos" className="ed-section">
          <div className="ed-section-head mono">
            <h2 className="ed-section-title">02 / Projetos Selecionados</h2>
            <span className="ed-section-note">Sistemas, APIs & Modelos</span>
          </div>

          <div className="projects-list">
            {PROJECTS.map((project) => (
              <article key={project.id} className="project-entry">
                <div>
                  <div className="project-meta-top mono">
                    <span>{project.year}</span>
                    <span>—</span>
                    <span>{project.context}</span>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-stack mono">
                    {project.stack.map((tech) => (
                      <span key={tech} className="stack-item">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="project-links mono">
                  <a
                    href={project.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-link"
                  >
                    deploy ↗
                  </a>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link muted"
                    >
                      repositório ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 04 / Artigos Científicos */}
        <section id="artigos" className="ed-section">
          <div className="ed-section-head mono">
            <h2 className="ed-section-title">03 / Artigos Científicos</h2>
            <span className="ed-section-note">Publicações & Eventos</span>
          </div>

          <div className="publications-list">
            {SCIENTIFIC_ARTICLES.map((article) => (
              <article key={article.id} className="pub-row">
                <div className="pub-year mono">{article.year}</div>
                <div>
                  <h3 className="pub-title">{article.title}</h3>
                  <div className="pub-venue">
                    <span>{article.event}</span>
                    {article.area && (
                      <span className="pub-area mono">[{article.area}]</span>
                    )}
                  </div>
                </div>
                <div className="mono" style={{ fontSize: '0.8rem' }}>
                  {article.link && article.link !== '#' ? (
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-link"
                    >
                      paper ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Rodapé com referências sutis a Doctor Who e Resident Evil */}
      <footer className="site-footer mono">
        <div className="footer-row">
          <div>
            © {new Date().getFullYear()} {PROFILE_DATA.name} · UNESP / LIPAI
          </div>

          <div className="easter-bar">
            <button
              type="button"
              onClick={triggerDoctorWhoEasterEgg}
              className="text-btn"
              title="Doctor Who Easter Egg (ou digite 'tardis')"
            >
              [TARDIS // 10-0-11-0-0:0-2]
            </button>
            <button
              type="button"
              onClick={triggerResidentEvilEasterEgg}
              className="text-btn"
              title="Resident Evil Save Room (ou digite 'stars')"
            >
              [ink_ribbon:{inkRibbons}]
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
