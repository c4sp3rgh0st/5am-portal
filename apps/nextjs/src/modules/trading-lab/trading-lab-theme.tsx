"use client";

import { useEffect, useState } from "react";
import classes from "./trading-lab.module.css";

type Mode = "day" | "night";

function getDefaultMode() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? "day" : "night";
}

export function TradingLabTheme() {
  const [mode, setMode] = useState<Mode>("day");

  useEffect(() => {
    setMode(getDefaultMode());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.tradingMode = mode;
    document.body.dataset.tradingMode = mode;
  }, [mode]);

  return (
    <div className={classes.themeToggle} aria-label="Trading Lab theme">
      <button type="button" data-active={mode === "day"} onClick={() => setMode("day")}>DAY</button>
      <button type="button" data-active={mode === "night"} onClick={() => setMode("night")}>NIGHT</button>
    </div>
  );
}
