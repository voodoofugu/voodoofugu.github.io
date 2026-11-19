import React from "react";

import { libraries, libraryBySlug, type Library } from "./libraries";

type Theme = "system" | "light" | "dark";

const themes = ["system", "light", "dark"] as const;

function useRoute() {
  const readRoute = () => {
    const slug = window.location.hash.replace(/^#\/?/, "");
    return libraryBySlug.has(slug) ? slug : "overview";
  };
  const [route, setRoute] = React.useState(readRoute);

  React.useEffect(() => {
    const update = () => setRoute(readRoute());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return route;
}

function useTheme() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    const stored = localStorage.getItem("voodoofugu-theme");
    return stored === "light" || stored === "dark" ? stored : "system";
  });

  React.useEffect(() => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    localStorage.setItem("voodoofugu-theme", theme);
  }, [theme]);

  return [theme, setTheme] as const;
}

function ThemeControl({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}) {
  const element = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const selectAt = (clientX: number) => {
    const bounds = element.current?.getBoundingClientRect();
    if (!bounds?.width) return;
    const offset = Math.max(0, Math.min(bounds.width - 1, clientX - bounds.left));
    const index = Math.min(
      themes.length - 1,
      Math.floor(offset / (bounds.width / themes.length)),
    );
    setTheme(themes[index]);
  };

  const release = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
  };

  return (
    <div
      aria-label="Color theme"
      className="theme-control"
      data-dragging={dragging || undefined}
      onLostPointerCapture={() => setDragging(false)}
      onPointerCancel={release}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        selectAt(event.clientX);
      }}
      onPointerMove={(event) => dragging && selectAt(event.clientX)}
      onPointerUp={release}
      ref={element}
    >
      {themes.map((value) => (
        <button
          aria-pressed={theme === value}
          key={value}
          onClick={() => setTheme(value)}
          type="button"
        >
          {value}
        </button>
      ))}
    </div>
  );
}

function Logo({ library }: { library: Library }) {
  return (
    <span
      aria-hidden="true"
      className="library-logo"
      style={{
        maskImage: `url("${library.logo}")`,
        WebkitMaskImage: `url("${library.logo}")`,
      }}
    />
  );
}

function ExternalLink({ href, children }: React.PropsWithChildren<{ href: string }>) {
  return (
    <a href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );
}

function Overview() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">frontend systems · Georg Schilin</p>
        <h1>Libraries for interaction-heavy interfaces.</h1>
        <p className="hero-copy">
          Small, focused tools for scrolling, state, CSS lifecycle and UI
          development. Each library solves one infrastructure problem and can
          be adopted independently.
        </p>
      </section>

      <section aria-labelledby="catalog-title" className="catalog-section">
        <div className="section-heading">
          <p className="eyebrow">open source</p>
          <h2 id="catalog-title">Library catalog</h2>
        </div>
        <div className="library-grid">
          {libraries.map((library) => (
            <a
              className="library-card"
              href={`#/${library.slug}`}
              key={library.slug}
              style={{ "--project-accent": library.accent } as React.CSSProperties}
            >
              <div className="card-topline">
                <Logo library={library} />
                <span>{library.category}</span>
              </div>
              <h3>{library.name}</h3>
              <p>{library.description}</p>
              <span className="card-action">Explore library</span>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="system-title" className="system-section">
        <div className="section-heading">
          <p className="eyebrow">how they fit</p>
          <h2 id="system-title">Independent tools, shared direction</h2>
        </div>
        <div className="system-map">
          <div>
            <strong>Interaction</strong>
            <span>morphing-scroll uses keytask for controlled frame work.</span>
          </div>
          <div>
            <strong>Application state</strong>
            <span>nexus-state keeps state updates explicit and traceable.</span>
          </div>
          <div>
            <strong>UI surfaces</strong>
            <span>styled-atom and demo-workbench own dynamic presentation.</span>
          </div>
        </div>
      </section>
    </>
  );
}

function LibraryPage({ library }: { library: Library }) {
  return (
    <article
      className="library-page"
      style={{ "--project-accent": library.accent } as React.CSSProperties}
    >
      <div className="library-hero">
        <Logo library={library} />
        <div>
          <p className="eyebrow">{library.category}</p>
          <h1>{library.name}</h1>
          <code>{library.packageName}</code>
        </div>
      </div>

      <p className="library-lead">{library.description}</p>
      <p className="library-details">{library.details}</p>

      <ul className="feature-list">
        {library.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <nav aria-label={`${library.name} links`} className="library-actions">
        {library.docs && <ExternalLink href={library.docs}>Documentation</ExternalLink>}
        <ExternalLink href={library.npm}>npm</ExternalLink>
        <ExternalLink href={library.github}>GitHub</ExternalLink>
      </nav>
    </article>
  );
}

function App() {
  const route = useRoute();
  const [theme, setTheme] = useTheme();
  const selected = route === "overview" ? undefined : libraryBySlug.get(route);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = selected
      ? `${selected.name} · voodoofugu libraries`
      : "voodoofugu · frontend libraries";
  }, [selected]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar-inner">
          <a className="brand" href="#/">
            <span aria-hidden="true" className="brand-mark">&lt;/&gt;</span>
            <span className="brand-name">voodoofugu</span>
            <small>libraries</small>
          </a>
          <ThemeControl setTheme={setTheme} theme={theme} />
        </div>
      </header>

      <div className="page-layout">
        <aside className="side-nav" aria-label="Library navigation">
          <nav>
            <a className={!selected ? "active" : undefined} href="#/">
              Overview
            </a>
            {libraries.map((library) => (
              <a
                className={selected?.slug === library.slug ? "active" : undefined}
                href={`#/${library.slug}`}
                key={library.slug}
                style={{ "--project-accent": library.accent } as React.CSSProperties}
              >
                <Logo library={library} />
                <span>{library.name}</span>
              </a>
            ))}
          </nav>
        </aside>

        <main>{selected ? <LibraryPage library={selected} /> : <Overview />}</main>
      </div>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>© {new Date().getFullYear()} Georg Schilin</span>
          <nav aria-label="External links">
            <ExternalLink href="https://resume.voodoofugu.com/?lang=ru">Portfolio</ExternalLink>
            <ExternalLink href="https://github.com/voodoofugu">GitHub</ExternalLink>
            <ExternalLink href="https://www.npmjs.com/~voodoofugu">npm</ExternalLink>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default App;
