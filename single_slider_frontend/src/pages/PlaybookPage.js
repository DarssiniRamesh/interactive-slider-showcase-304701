import React, { useEffect, useMemo, useRef, useState } from "react";
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
    title: "Code Generation with Local Validation",
    short: "You run builds locally; Kavia generates code and docs.",
    description: "You run builds locally; Kavia generates code and docs.",
    phases: {
      A: ["Goal articulation and success criteria", "Constraints, scope, and risks", "High-level implementation plan"],
      B: ["Feature spec / design notes", "Module-wise breakdown", "Acceptance criteria and review checkpoints"],
      C: ["Generate code in modules", "Integrate wiring/imports/config", "Iterate locally until it compiles"],
      D: ["Generate tests", "Run tests locally + debug", "Review summary of changes and assumptions"]
    }
  },
  {
    n: 2,
    title: "CI-Ready Build Governance",
    short: "Standard build commands defined; compile issues blocked early.",
    description: "Standard build commands defined; compile issues blocked early.",
    phases: {
      A: ["Confirm build targets via manifest", "Identify compile/config risks", "Plan emphasizes no-compilation-errors"],
      B: ["Docs include build-impact decisions", "Implementation plan includes config changes", "Criteria includes build checks"],
      C: ["Generate + auto-fix for compilation", "Adjust build scripts/imports as needed", "Run manifest build locally"],
      D: ["Generate tests for changed modules", "Execute tests locally", "Review artifact ties build output to changes"]
    }
  },
  {
    n: 3,
    title: "Preview-Backed Runtime Validation",
    short: "Preview verifies runtime behavior and speeds review.",
    description: "Preview verifies runtime behavior and speeds review.",
    phases: {
      A: ["Define critical runtime scenarios", "Capture flows to validate (startup, navigation)", "Plan includes runtime checkpoints"],
      B: ["Document runtime behaviors + acceptance criteria", "Highlight integration touchpoints", "Structure for stakeholder review"],
      C: ["Implement and integrate", "Fix runtime errors using preview feedback", "Parallel review while iterating"],
      D: ["Verify with tests", "Use preview evidence to validate execution paths", "Review summary includes runtime fixes/risks"]
    }
  },
  {
    n: 4,
    title: "Fully Managed Execution & Test Automation",
    short: "Builds, previews, and tests run within Kavia.",
    description: "Builds, previews, and tests run within Kavia.",
    phases: {
      A: ["Define end-to-end definition of done", "Clarify operational constraints (env/secrets/tools)", "Plan schedules automated verification"],
      B: ["Specs include commands + expected outputs", "Flow documents align with automation", "Review checkpoints tied to managed results"],
      C: ["Implement with managed feedback", "Auto-fix loops for compile/runtime", "Stabilize integration repeatably"],
      D: ["Generate and execute tests via Kavia", "Use failures to drive fixes until green", "Finalize release-ready review artifacts"]
    }
  }
];

function parseLevelHash() {
  const hash = (window.location.hash || "").toLowerCase();
  const match = hash.match(/^#l([1-4])$/);
  if (!match) return null;
  return Number(match[1]);
}

function toLevelHash(levelN) {
  return `#l${levelN}`;
}

// PUBLIC_INTERFACE
function PlaybookPage() {
  const tabRefs = useRef([]);
  const [activeLevel, setActiveLevel] = useState(() => parseLevelHash() ?? 2);

  const active = useMemo(() => LEVELS.find((l) => l.n === activeLevel) ?? LEVELS[1], [activeLevel]);

  // Keep deep-linking behavior: if a user lands on /playbook#l3, show L3; if they switch tabs, update hash.
  useEffect(() => {
    const onHashChange = () => {
      const levelFromHash = parseLevelHash();
      if (levelFromHash && levelFromHash !== activeLevel) {
        setActiveLevel(levelFromHash);
      }
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [activeLevel]);

  useEffect(() => {
    // Avoid noisy history entries while tabbing; replace keeps back button behavior sane.
    const desired = toLevelHash(activeLevel);
    if (window.location.hash !== desired) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${desired}`);
    }
  }, [activeLevel]);

  const onTabKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;

    e.preventDefault();

    const currentIndex = LEVELS.findIndex((l) => l.n === activeLevel);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;

    if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + LEVELS.length) % LEVELS.length;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % LEVELS.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = LEVELS.length - 1;

    const nextLevel = LEVELS[nextIndex];
    setActiveLevel(nextLevel.n);

    // Roving focus to keep keyboard interaction consistent with WAI-ARIA authoring practices.
    const nextEl = tabRefs.current[nextIndex];
    if (nextEl) nextEl.focus();
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Playbook</h1>
          <p className={styles.subtitle}>
            Detailed guidance for each Level (1–4) and phases A–D. Switch levels with the tabs below.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link className={styles.backLink} to="/" aria-label="Back to Levels of Engagement page">
            ← Back to Levels
          </Link>
        </div>
      </header>

      <section className={styles.shell} aria-label="Playbook content">
        <div className={styles.content} aria-label="Playbook details">
          <div className={styles.callout} role="note" aria-label="Playbook note">
            <strong>Note:</strong> Phases A–D are consistent across all engagement levels; what changes is how much of the
            build/run/test loop is defined and executed through Kavia.
          </div>

          <div className={styles.levelTabsWrap} aria-label="Levels tabs">
            <div className={styles.levelTabs} role="tablist" aria-label="Engagement levels" onKeyDown={onTabKeyDown}>
              {LEVELS.map((l, idx) => {
                const selected = l.n === activeLevel;
                return (
                  <button
                    key={l.n}
                    type="button"
                    ref={(el) => {
                      tabRefs.current[idx] = el;
                    }}
                    className={styles.levelTab}
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`level-panel-${l.n}`}
                    id={`level-tab-${l.n}`}
                    tabIndex={selected ? 0 : -1}
                    data-active={selected ? "true" : "false"}
                    onClick={() => setActiveLevel(l.n)}
                  >
                    <span className={styles.levelTabPill}>L{l.n}</span>
                    <span className={styles.levelTabText}>
                      <span className={styles.levelTabTitle}>{l.title}</span>
                      <span className={styles.levelTabSub}>{l.short}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <article
            className={styles.levelSection}
            id={`level-panel-${active.n}`}
            role="tabpanel"
            aria-labelledby={`level-tab-${active.n}`}
            aria-label={`Level ${active.n} details`}
          >
            <div className={styles.levelHeader}>
              <div>
                <h2 className={styles.levelTitle}>
                  <span className={styles.levelBadge}>Level {active.n}</span>
                  {active.title}
                </h2>
                <p className={styles.levelDesc}>{active.description}</p>
              </div>

              <div className={styles.levelMeta}>
                <span className={styles.metaChip}>
                  <strong>Engagement</strong> {active.n}/4
                </span>
                <span className={styles.metaChip}>
                  <strong>Phases</strong> A–D
                </span>
              </div>
            </div>

            <div className={styles.phaseGrid} aria-label={`Phases for level ${active.n}`}>
              {PHASES.map((p) => (
                <section key={p.key} className={styles.phaseCard} aria-label={`Level ${active.n} phase ${p.key}`}>
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
                  </div>

                  <ul className={styles.bullets} aria-label={`Outcomes for Level ${active.n} Phase ${p.key}`}>
                    {active.phases[p.key].map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default PlaybookPage;
