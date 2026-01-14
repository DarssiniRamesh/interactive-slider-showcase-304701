import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./PlaybookPage.module.css";

const PHASES = [
  {
    key: "A",
    name: "Nascent Analysis",
    icon: "🔎",
    oneLiner: "Clarify goal, constraints, and success criteria."
  },
  {
    key: "B",
    name: "Documentation / Design",
    icon: "🧭",
    oneLiner: "Turn intent into specs and implementation flow."
  },
  {
    key: "C",
    name: "Implement + Integrate",
    icon: "🧩",
    oneLiner: "Generate code, integrate, and stabilize."
  },
  {
    key: "D",
    name: "Verify + Review",
    icon: "✅",
    oneLiner: "Test, debug, and summarize outcomes."
  }
];

const LEVELS = [
  {
    n: 1,
    title: "Code Generation with Local Build",
    short: "No manifest; local build & local test",
    description:
      "You connect a repo and use Kavia primarily for code generation. Builds and tests are run locally by the developer.",
    phases: {
      A: ["Goal articulation and success criteria", "Constraints, scope, and risks", "High-level implementation plan"],
      B: ["Feature spec / design notes", "Module-wise breakdown", "Acceptance criteria and review checkpoints"],
      C: ["Generate code in modules", "Integrate wiring/imports/config", "Iterate locally until it compiles"],
      D: ["Generate tests", "Run tests locally + debug", "Review summary of changes and assumptions"]
    }
  },
  {
    n: 2,
    title: "Manifest-based Build (Run Locally)",
    short: "Build defined via manifest; still run locally",
    description:
      "A manifest defines build commands (and potentially CI steps). Kavia can optimize generation for compilation correctness.",
    phases: {
      A: ["Confirm build targets via manifest", "Identify compile/config risks", "Plan emphasizes no-compilation-errors"],
      B: ["Docs include build-impact decisions", "Implementation plan includes config changes", "Criteria includes build checks"],
      C: ["Generate + auto-fix for compilation", "Adjust build scripts/imports as needed", "Run manifest build locally"],
      D: ["Generate tests for changed modules", "Execute tests locally", "Review artifact ties build output to changes"]
    }
  },
  {
    n: 3,
    title: "Manifest + Preview/Run Through Kavia",
    short: "Runtime preview feedback + collaborative review",
    description:
      "In addition to manifest-defined builds, you run/preview through Kavia to catch runtime issues and iterate faster.",
    phases: {
      A: ["Define critical runtime scenarios", "Capture flows to validate (startup, navigation)", "Plan includes runtime checkpoints"],
      B: ["Document runtime behaviors + acceptance criteria", "Highlight integration touchpoints", "Structure for stakeholder review"],
      C: ["Implement and integrate", "Fix runtime errors using preview feedback", "Parallel review while iterating"],
      D: ["Verify with tests", "Use preview evidence to validate execution paths", "Review summary includes runtime fixes/risks"]
    }
  },
  {
    n: 4,
    title: "Fully Managed (Build + Run + Tests Through Kavia)",
    short: "End-to-end managed execution loop",
    description:
      "Kavia manages the full loop: generate code, build, run, and execute tests. Highest engagement and strongest validation.",
    phases: {
      A: ["Define end-to-end definition of done", "Clarify operational constraints (env/secrets/tools)", "Plan schedules automated verification"],
      B: ["Specs include commands + expected outputs", "Flow documents align with automation", "Review checkpoints tied to managed results"],
      C: ["Implement with managed feedback", "Auto-fix loops for compile/runtime", "Stabilize integration repeatably"],
      D: ["Generate and execute tests via Kavia", "Use failures to drive fixes until green", "Finalize release-ready review artifacts"]
    }
  }
];

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// PUBLIC_INTERFACE
function PlaybookPage() {
  const [activeLevel, setActiveLevel] = useState(2);

  const active = useMemo(() => LEVELS.find((l) => l.n === activeLevel) ?? LEVELS[1], [activeLevel]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Playbook</h1>
          <p className={styles.subtitle}>
            Detailed guidance for each Level (1–4) and phases A–D. Use the left navigation to jump.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link className={styles.backLink} to="/" aria-label="Back to Levels of Engagement page">
            ← Back to Levels
          </Link>
        </div>
      </header>

      <section className={styles.shell} aria-label="Playbook content">
        <aside className={styles.sidebar} aria-label="Playbook table of contents">
          <div className={styles.sidebarHeader}>Levels</div>

          <nav className={styles.levelNav}>
            {LEVELS.map((l) => (
              <button
                key={l.n}
                type="button"
                className={styles.levelBtn}
                data-active={l.n === activeLevel ? "true" : "false"}
                onClick={() => {
                  setActiveLevel(l.n);
                  scrollToSection(`level-${l.n}`);
                }}
                aria-label={`Jump to Level ${l.n}: ${l.title}`}
              >
                <div className={styles.levelBtnTop}>
                  <span className={styles.levelPill}>Level {l.n}</span>
                  <span className={styles.levelBtnTitle}>{l.title}</span>
                </div>
                <div className={styles.levelBtnSub}>{l.short}</div>
              </button>
            ))}
          </nav>

          <div className={styles.sidebarDivider} />

          <div className={styles.sidebarHeader}>Phases</div>
          <div className={styles.phaseNav} role="list" aria-label="Phase quick jump (within active level)">
            {PHASES.map((p) => (
              <button
                key={p.key}
                type="button"
                className={styles.phaseBtn}
                onClick={() => scrollToSection(`level-${activeLevel}-phase-${p.key}`)}
                aria-label={`Jump to Phase ${p.key}: ${p.name} within Level ${activeLevel}`}
              >
                <span className={styles.phaseIcon} aria-hidden="true">
                  {p.icon}
                </span>
                <span className={styles.phaseBtnText}>
                  <span className={styles.phaseKey}>Phase {p.key}</span>
                  <span className={styles.phaseName}>{p.name}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className={styles.content} aria-label="Playbook details">
          <div className={styles.callout} role="note" aria-label="Playbook note">
            <strong>Note:</strong> Phases A–D are consistent across all engagement levels; what changes is how much of the
            build/run/test loop is defined and executed through Kavia.
          </div>

          {LEVELS.map((l) => (
            <article key={l.n} className={styles.levelSection} id={`level-${l.n}`} aria-label={`Level ${l.n} details`}>
              <div className={styles.levelHeader}>
                <div>
                  <h2 className={styles.levelTitle}>
                    <span className={styles.levelBadge}>Level {l.n}</span>
                    {l.title}
                  </h2>
                  <p className={styles.levelDesc}>{l.description}</p>
                </div>

                <div className={styles.levelMeta}>
                  <span className={styles.metaChip}>
                    <strong>Engagement</strong> {l.n}/4
                  </span>
                  <span className={styles.metaChip}>
                    <strong>Phases</strong> A–D
                  </span>
                </div>
              </div>

              <div className={styles.phaseGrid} aria-label={`Phases for level ${l.n}`}>
                {PHASES.map((p) => (
                  <section
                    key={p.key}
                    className={styles.phaseCard}
                    id={`level-${l.n}-phase-${p.key}`}
                    aria-label={`Level ${l.n} phase ${p.key}`}
                  >
                    <div className={styles.phaseCardTop}>
                      <div className={styles.phaseCardTitle}>
                        <span className={styles.phaseIconLarge} aria-hidden="true">
                          {p.icon}
                        </span>
                        <div>
                          <div className={styles.phaseHeading}>
                            Phase {p.key}: {p.name}
                          </div>
                          <div className={styles.phaseOneLiner}>{p.oneLiner}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={styles.copyLinkBtn}
                        onClick={() => {
                          const url = `${window.location.origin}${window.location.pathname}#level-${l.n}-phase-${p.key}`;
                          navigator.clipboard?.writeText(url).catch(() => {});
                        }}
                        aria-label={`Copy link to Level ${l.n} Phase ${p.key}`}
                        title="Copy deep link"
                      >
                        Copy link
                      </button>
                    </div>

                    <ul className={styles.bullets} aria-label={`Outcomes for Level ${l.n} Phase ${p.key}`}>
                      {l.phases[p.key].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PlaybookPage;
