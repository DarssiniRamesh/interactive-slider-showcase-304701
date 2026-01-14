import React, { useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LevelsPage.module.css";

const LEVELS = [
  {
    n: 1,
    title: "Code Generation with Local Validation",
    subtitle: "You run builds locally; Kavia generates code and docs."
  },
  {
    n: 2,
    title: "CI-Ready Build Governance",
    subtitle: "Standard build commands defined; compile issues blocked early."
  },
  {
    n: 3,
    title: "Preview-Backed Runtime Validation",
    subtitle: "Preview verifies runtime behavior and supports fast review."
  },
  {
    n: 4,
    title: "Fully Managed Execution & Test Automation",
    subtitle: "Builds, previews, and tests executed and iterated by Kavia."
  }
];

const PHASES = [
  { key: "A", label: "Analyze", icon: "🔎" },
  { key: "B", label: "Design", icon: "🧭" },
  { key: "C", label: "Implement", icon: "🧩" },
  { key: "D", label: "Verify", icon: "✅" }
];

// PUBLIC_INTERFACE
function LevelsPage() {
  const sliderId = useId();
  const [level, setLevel] = useState(2);

  const activeLevel = useMemo(() => LEVELS.find((l) => l.n === level) ?? LEVELS[1], [level]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Levels of Engagement</h1>
          <p className={styles.subtitle}>
            A minimal view of Levels 1–4. Each level follows the same internal phases (A–D).
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link className={styles.primaryLink} to="/playbook" aria-label="Open detailed Playbook page">
            View Playbook
          </Link>
        </div>
      </header>

      <section className={styles.shell} aria-label="Engagement levels slider">
        <div className={styles.topBar}>
          <div className={styles.badges} aria-label="Legend">
            <span className={styles.pill}>Theme: white + amber</span>
            <span className={styles.badge}>
              <strong>Levels</strong> 1 → 4
            </span>
            <span className={styles.badge}>
              <strong>Phases</strong> A → D
            </span>
          </div>
          <div className={styles.tip}>
            Tip: <kbd className={styles.kbd}>Tab</kbd> then <kbd className={styles.kbd}>Arrow</kbd> keys to adjust.
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sliderRow}>
            <label className={styles.sliderLabel} htmlFor={sliderId}>
              Engagement level <span className={styles.sliderValue}>Level {level}</span>
            </label>

            <input
              id={sliderId}
              className={styles.slider}
              type="range"
              min={1}
              max={4}
              step={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              aria-label="Engagement level slider from 1 to 4"
              aria-valuemin={1}
              aria-valuemax={4}
              aria-valuenow={level}
              aria-valuetext={`Level ${level}: ${activeLevel.title}`}
            />

            <div className={styles.stops} aria-hidden="true">
              {LEVELS.map((l) => (
                <div key={l.n} className={styles.stop}>
                  <div className={styles.stopDot} data-active={l.n === level ? "true" : "false"} />
                  <div className={styles.stopLabel}>L{l.n}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.levelGrid} aria-label="Levels with phases A through D">
            {LEVELS.map((l) => (
              <article
                key={l.n}
                className={styles.levelCard}
                data-active={l.n === level ? "true" : "false"}
                aria-label={`Level ${l.n}`}
              >
                <div className={styles.levelCardTop}>
                  <div>
                    <div className={styles.levelCardTitle}>
                      <span className={styles.levelChip}>Level {l.n}</span> {l.title}
                    </div>
                    <div className={styles.levelCardSubtitle}>{l.subtitle}</div>
                  </div>
                </div>

                <div className={styles.phaseRow} aria-label={`Phases for Level ${l.n}`}>
                  {PHASES.map((p) => (
                    <div
                      key={p.key}
                      className={styles.phaseChip}
                      aria-label={`Phase ${p.key}: ${p.label}`}
                      title={`Phase ${p.key}: ${p.label}`}
                    >
                      <span className={styles.phaseIcon} aria-hidden="true">
                        {p.icon}
                      </span>
                      <span className={styles.phaseText}>
                        <span className={styles.phaseKey} aria-hidden="true">
                          {p.key}
                        </span>
                        <span className={styles.phaseLabel}>{p.label}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <footer className={styles.footer}>
            <p className={styles.footerText}>
              Want details for each phase?{" "}
              <Link className={styles.inlineLink} to="/playbook">
                Open the Playbook
              </Link>
              .
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}

export default LevelsPage;
