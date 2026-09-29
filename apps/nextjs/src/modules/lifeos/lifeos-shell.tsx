"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import classes from "./lifeos.module.css";

type Mode = "day" | "night";
type Section = "today" | "goals" | "habits" | "schedule" | "journal" | "review";

const sections: Array<{ id: Section; label: string }> = [
  { id: "today", label: "Today" },
  { id: "goals", label: "Goals" },
  { id: "habits", label: "Habits" },
  { id: "schedule", label: "Schedule" },
  { id: "journal", label: "Journal" },
  { id: "review", label: "Review" },
];

function defaultMode() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? "day" : "night";
}

export function LifeOsShell({ section = "today" }: { section?: Section }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>("day");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("mode");
    const stored = window.localStorage.getItem("5am-mode");
    const resolved = forced === "day" || forced === "night"
      ? forced
      : stored === "day" || stored === "night"
        ? stored
        : defaultMode();
    setMode(resolved);
    setNow(new Date());
    document.title = "LifeOS · 5AM Life";
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  function changeMode(next: Mode) {
    setMode(next);
    window.localStorage.setItem("5am-mode", next);
  }

  const time = now
    ? new Intl.DateTimeFormat("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now)
    : "--:--";

  return (
    <main className={classes.shell} data-mode={mode}>
      <div className={classes.background} aria-hidden="true" />
      <header className={classes.topbar}>
        <a href="/" className={classes.brand} aria-label="5AM Life home">5AM LIFE</a>
        <nav className={classes.globalNav} aria-label="5AM navigation">
          <a href="/">Home</a>
          <a className={classes.active} href="/modules/lifeos">LifeOS</a>
          <a href="/modules/trading-lab">Trading Lab</a>
        </nav>
        <div className={classes.actions}>
          <time className={classes.clock}>{time}</time>
          <div className={classes.modeToggle} aria-label="Theme mode">
            <button type="button" data-active={mode === "day"} onClick={() => changeMode("day")}>DAY</button>
            <button type="button" data-active={mode === "night"} onClick={() => changeMode("night")}>NIGHT</button>
          </div>
        </div>
      </header>

      <section className={classes.moduleHeader}>
        <div>
          <p>5AM / LIFE</p>
          <h1>LifeOS</h1>
          <span>Personal operating surface</span>
        </div>
        <nav className={classes.sectionNav} aria-label="LifeOS sections">
          {sections.map((item) => {
            const href = item.id === "today" ? "/modules/lifeos/today" : `/modules/lifeos/${item.id}`;
            const isActive = section === item.id || (pathname === "/modules/lifeos" && item.id === "today");
            return <a key={item.id} href={href} data-active={isActive}>{item.label}</a>;
          })}
        </nav>
      </section>

      <section className={classes.content}>
        <article className={classes.placeholder}>
          <span className={classes.kicker}>{section.toUpperCase()}</span>
          <h2>{section === "today" ? "Your day starts here." : `${sections.find((item) => item.id === section)?.label} is ready for migration.`}</h2>
          <p>Native 5AM Life module shell is active. No embedded upstream runtime or separate Homarr chrome is mounted.</p>
          <div className={classes.statusRow}>
            <span>Native route</span><span>5AM auth boundary</span><span>Responsive shell</span><span>{mode.toUpperCase()} mode</span>
          </div>
        </article>
      </section>

      <footer className={classes.footer}><span>5AM LIFE · LIFEOS</span><span>STEP 2 / NATIVE SHELL</span></footer>
    </main>
  );
}
