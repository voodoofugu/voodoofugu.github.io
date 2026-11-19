import demoWorkbenchLogo from "./assets/demo-workbench.svg";
import keytaskLogo from "./assets/keytask.svg";
import morphingScrollLogo from "./assets/morphing-scroll.svg";
import nexusStateLogo from "./assets/nexus-state.svg";
import styledAtomLogo from "./assets/styled-atom.svg";

export type Library = {
  slug: string;
  name: string;
  packageName: string;
  category: string;
  description: string;
  details: string;
  features: readonly string[];
  accent: string;
  logo: string;
  docs?: string;
  npm: string;
  github: string;
};

export const libraries: readonly Library[] = [
  {
    slug: "morphing-scroll",
    name: "morphing-scroll",
    packageName: "morphing-scroll",
    category: "interaction engine",
    description:
      "Custom scrolling and slider mechanics for interaction-heavy React interfaces.",
    details:
      "A low-level UI engine for custom scrollbars, object-aligned pages, nested gesture ownership and virtualized surfaces. It keeps wheel, drag, touch, keyboard and programmatic navigation on one movement model.",
    features: [
      "Custom scroll, slider and hybrid layouts",
      "Wheel, drag, touch, keyboard and gamepad input",
      "Object pages, virtualization and visibility tracking",
    ],
    accent: "#2563eb",
    logo: morphingScrollLogo,
    docs: "https://voodoofugu.github.io/morphing-scroll/",
    npm: "https://www.npmjs.com/package/morphing-scroll",
    github: "https://github.com/voodoofugu/morphing-scroll",
  },
  {
    slug: "nexus-state",
    name: "nexus-state",
    packageName: "nexus-state",
    category: "state system",
    description:
      "A small state manager with automatic selector tracking and traceable updates.",
    details:
      "Framework-agnostic state at the core, with a focused React entry. Selectors track the keys they read, actions batch updates, and provenance flows through middleware, subscribers, persistence and devtools.",
    features: [
      "Automatic selector dependency tracking",
      "Actions, batching and update provenance",
      "Persistence, Redux DevTools and optional React bindings",
    ],
    accent: "#7c3aed",
    logo: nexusStateLogo,
    docs: "https://voodoofugu.github.io/nexus-state/",
    npm: "https://www.npmjs.com/package/nexus-state",
    github: "https://github.com/voodoofugu/nexus-state",
  },
  {
    slug: "styled-atom",
    name: "styled-atom",
    packageName: "styled-atom",
    category: "CSS lifecycle",
    description:
      "Lifecycle-managed CSS assets and focused inline styles for dynamic UI surfaces.",
    details:
      "Own dynamic CSS text through a typed inline compiler or mount ready-made assets through browser-cacheable stylesheet links. Styles share ownership, follow UI targets and leave the cascade after their last owner disappears.",
    features: [
      "Dynamic style objects and ready-made CSS assets",
      "SSR, portals, iframes and ShadowRoot targets",
      "Shared ownership, deterministic cascade and cleanup",
    ],
    accent: "#007f9e",
    logo: styledAtomLogo,
    docs: "https://voodoofugu.github.io/styled-atom/",
    npm: "https://www.npmjs.com/package/styled-atom",
    github: "https://github.com/voodoofugu/styled-atom",
  },
  {
    slug: "keytask-core",
    name: "keytask",
    packageName: "keytask-core",
    category: "task control",
    description:
      "Key-based scheduling for timeout and animation-frame work.",
    details:
      "A tiny timing primitive for render-heavy UI, scrolling, animation systems and games. The same key always describes the same unit of work, making replacement, locking, throttling, looping and cancellation predictable.",
    features: [
      "Latest-wins tasks and first-wins locks",
      "First-now, latest-later throttling",
      "Timeout and requestAnimationFrame loops",
    ],
    accent: "#d97706",
    logo: keytaskLogo,
    npm: "https://www.npmjs.com/package/keytask-core",
    github: "https://github.com/voodoofugu/keytask",
  },
  {
    slug: "demo-workbench",
    name: "demo-workbench",
    packageName: "demo-workbench",
    category: "developer tool",
    description:
      "A React shell for browsing, filtering and opening project demos and screens.",
    details:
      "A compact alternative to building the same internal demo browser repeatedly. The package owns the shell, themes and opened-demo surface; the host owns its components, generated manifest and compiled styles.",
    features: [
      "Grid, search, themes and opened-demo mode",
      "Host-owned demo manifest and CSS pipeline",
      "Responsive previews and active-demo lifecycle",
    ],
    accent: "#16845b",
    logo: demoWorkbenchLogo,
    npm: "https://www.npmjs.com/package/demo-workbench",
    github: "https://github.com/voodoofugu/demo-workbench",
  },
];

export const libraryBySlug = new Map(
  libraries.map((library) => [library.slug, library]),
);
