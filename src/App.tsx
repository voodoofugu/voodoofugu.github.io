import React from "react";
import type { MorphScrollHandle, MorphScrollProps } from "morphing-scroll";

import ChromeScroll from "./ChromeScroll";
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
  const page = React.useRef<MorphScrollHandle>(null);
  const navigation = React.useRef<HTMLElement>(null);
  const footer = React.useRef<HTMLElement>(null);
  const shell = React.useRef<HTMLDivElement>(null);
  const keepNavigationStill = React.useCallback<
    NonNullable<MorphScrollProps["onScrollPosition"]>
  >((_left, top, _max, overscroll) => {
    const desiredOffset = top - overscroll.y;
    let offset = desiredOffset;

    if (navigation.current && footer.current) {
      const headerHeight = 59;
      const navigationTop = headerHeight + 32;
      const gapBeforeFooter = 24;
      const footerLimit =
        desiredOffset +
        footer.current.getBoundingClientRect().top -
        navigationTop -
        navigation.current.offsetHeight -
        gapBeforeFooter;
      offset = Math.min(desiredOffset, footerLimit);
    }

    navigation.current?.style.setProperty(
      "--side-scroll-offset",
      `${Math.max(0, offset)}px`,
    );
    shell.current?.toggleAttribute("data-scrolled", top > 8);
  }, []);

  React.useEffect(() => {
    page.current?.scrollTo(0, { duration: 0 });
    document.title = selected
      ? `${selected.name} · voodoofugu libraries`
      : "voodoofugu · libraries";
  }, [selected]);

  return (
    <div className="app-shell" ref={shell}>
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

      <main className="page-scroll">
        <ChromeScroll
          controls={{ keys: true }}
          onScrollPosition={keepNavigationStill}
          ref={page}
        >
          <div className="scroll-content">
            <div className="page-layout">
              <aside
                aria-label="Library navigation"
                className="side-nav"
                ref={navigation}
              >
                <nav>
                  <a
                    aria-current={!selected ? "page" : undefined}
                    className={!selected ? "active" : undefined}
                    href="#/"
                  >
                    <span>Overview</span>
                  </a>
                  {libraries.map((library) => (
                    <a
                      aria-current={selected?.slug === library.slug ? "page" : undefined}
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

              <div className="page-content">
                {selected ? <LibraryPage library={selected} /> : <Overview />}
              </div>
            </div>

            <footer className="site-footer" ref={footer}>
              <div className="site-footer-inner">
                <span>© {new Date().getFullYear()} Georg Schilin</span>
                <nav aria-label="External links">
                  <ExternalLink href="https://github.com/voodoofugu">github</ExternalLink>
                  <ExternalLink href="https://www.npmjs.com/~voodoofugu">npm</ExternalLink>
                  <ExternalLink href="https://resume.voodoofugu.com/?lang=ru">author</ExternalLink>
                </nav>
              </div>
            </footer>
          </div>
        </ChromeScroll>
      </main>
    </div>
  );
}

export default App;
