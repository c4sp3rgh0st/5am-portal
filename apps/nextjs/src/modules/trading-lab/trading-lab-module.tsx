import { tradingLabModule } from "./manifest";
import classes from "./trading-lab.module.css";

interface TradingHealth {
  status: string;
  mode: string;
  live_execution: string;
  executor: string;
  postgres: string;
  redis: string;
  real_money_exposure: number;
}

async function getHealth(): Promise<TradingHealth | null> {
  try {
    const response = await fetch(tradingLabModule.backend!.healthUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) return null;
    return (await response.json()) as TradingHealth;
  } catch {
    return null;
  }
}

export async function TradingLabModule() {
  const health = await getHealth();

  const metrics = [
    ["System", health?.status ?? "offline"],
    ["Mode", health?.mode ?? "unknown"],
    ["Executor", health?.executor ?? "unknown"],
    ["Exposure", `$${health?.real_money_exposure ?? 0}`],
    ["Postgres", health?.postgres ?? "unknown"],
    ["Redis", health?.redis ?? "unknown"],
  ];

  return (
    <main className={classes.shell}>
      <header className={classes.hero}>
        <div>
          <p className={classes.eyebrow}>5AM / MONEY</p>
          <h1>{tradingLabModule.name}</h1>
          <p>{tradingLabModule.description}</p>
        </div>
        <span className={classes.mode}>{health?.mode ?? "OFFLINE"}</span>
      </header>

      <section className={classes.grid}>
        {metrics.map(([label, value]) => (
          <article className={classes.card} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className={classes.stream}>
        <div>
          <span>Live Signal Stream</span>
          <strong>Wallet Radar</strong>
        </div>
        <p>
          Collector integration is the next Trading Lab step. Portal boundary is live.
        </p>
      </section>
    </main>
  );
}
