import { tradingLabModule } from "./manifest";
import { TradingLabTheme } from "./trading-lab-theme";
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

interface WalletScoutStatus {
  status: string;
  mode: string;
  agent?: string;
  configured_providers?: number;
  providers: Array<{
    provider: string;
    configured: boolean;
    status: string;
    last_checked_at: string | null;
  }>;
  counts: {
    candidate: number;
    watch: number;
    approved: number;
    rejected: number;
  };
  recent: Array<{
    address: string;
    status: string;
    score: number | null;
    reason: string | null;
  }>;
  spend_today_usd?: number;
  last_usage?: {
    model: string;
    input_tokens: number;
    output_tokens: number;
    cost_usd: number;
    is_free: boolean;
    created_at: string;
  } | null;
  cost_policy?: {
    strategy?: string;
    model_chain?: string[];
    daily_budget_usd?: number;
    allow_paid_fallback?: boolean;
    auto_approve?: boolean;
  };
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

async function getScoutStatus(): Promise<WalletScoutStatus | null> {
  try {
    const response = await fetch("http://127.0.0.1:8400/wallet-scout/status", {
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) return null;
    return (await response.json()) as WalletScoutStatus;
  } catch {
    return null;
  }
}

export async function TradingLabModule() {
  const [health, scout] = await Promise.all([getHealth(), getScoutStatus()]);
  const mode = health?.mode ?? "OFFLINE";
  const scoutAgent = scout?.agent ?? "OFFLINE";
  const providers = scout?.providers ?? [];
  const counts = scout?.counts ?? {
    candidate: 0,
    watch: 0,
    approved: 0,
    rejected: 0,
  };
  const costPolicy = scout?.cost_policy ?? {};
  const spendToday = scout?.spend_today_usd ?? 0;
  const lastUsage = scout?.last_usage ?? null;
  const dailyBudget = costPolicy.daily_budget_usd ?? 0.25;
  const modelChain = costPolicy.model_chain ?? [
    "openrouter/free",
    "deepseek/deepseek-v4-flash-0731",
    "z-ai/glm-5.3-flash",
  ];
  const metrics = [
    ["SYSTEM", health?.status ?? "offline"],
    ["MODE", mode],
    ["EXECUTOR", health?.executor ?? "unknown"],
    ["EXPOSURE", "$" + (health?.real_money_exposure ?? 0)],
    ["POSTGRES", health?.postgres ?? "unknown"],
    ["REDIS", health?.redis ?? "unknown"],
  ];

  return (
    <main className={classes.shell}>
      <div className={classes.background} aria-hidden="true" />

      <header className={classes.topbar}>
        <a href="/" className={classes.brand} aria-label="Back to 5AM Portal">
          <img src="/branding/5am-life-pixel-logo.png" alt="5AM Life" />
        </a>
        <nav>
          <a href="/">Home</a>
          <a className={classes.active} href="/modules/trading-lab">Trading Lab</a>
        </nav>
        <div className={classes.topActions}>
          <span className={classes.modePill}>{mode}</span>
          <TradingLabTheme />
        </div>
      </header>

      <section className={classes.hero}>
        <div className={classes.heroText}>
          <p className={classes.eyebrow}>5AM / MONEY</p>
          <h1>Trading Lab</h1>
          <p>Wallet radar, signal generation, paper execution and risk telemetry — one operating surface.</p>
          <div className={classes.featureRow}>
            <span>Wallet Radar</span>
            <span>Wallet Scout</span>
            <span>Signals</span>
            <span>Paper Trading</span>
            <span>Risk Engine</span>
            <span>Telemetry</span>
          </div>
        </div>

        <div className={classes.radarWrap} aria-hidden="true">
          <div className={classes.radarRing} />
          <div className={classes.radarRing} />
          <div className={classes.radarRing} />
          <div className={classes.radarSweep} />
          <i className={classes.pingA} />
          <i className={classes.pingB} />
          <i className={classes.pingC} />
        </div>
      </section>

      <section className={classes.metrics}>
        {metrics.map(([label, value]) => (
          <article className={classes.metricCard} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className={classes.mainGrid}>
        <article className={classes.scoutPanel}>
          <div className={classes.scoutHead}>
            <div>
              <span>INTELLIGENCE LAYER</span>
              <strong>Wallet Scout</strong>
              <p>Find, cross-check and validate high-signal Solana wallets before they ever reach Wallet Radar.</p>
            </div>
            <div className={classes.scoutState}>
              <small>AGENT</small>
              <b>{scoutAgent.replaceAll("_", " ")}</b>
            </div>
          </div>

          <div className={classes.providerRail}>
            {["nansen", "gmgn", "birdeye", "helius", "openrouter"].map((name) => {
              const provider = providers.find((item) => item.provider === name);
              const ready = provider?.configured ?? false;
              return (
                <div className={ready ? classes.providerReady : classes.providerWaiting} key={name}>
                  <span>{name.toUpperCase()}</span>
                  <strong>{ready ? "READY" : "AWAITING KEY"}</strong>
                </div>
              );
            })}
          </div>

          <div className={classes.scoutFlow}>
            <div>
              <span>DISCOVER</span>
              <strong>Nansen · GMGN · Birdeye</strong>
              <small>Candidate sources</small>
            </div>
            <i>→</i>
            <div>
              <span>REASON</span>
              <strong>OpenRouter Scout</strong>
              <small>Evidence synthesis</small>
            </div>
            <i>→</i>
            <div>
              <span>VERIFY</span>
              <strong>Helius</strong>
              <small>On-chain truth</small>
            </div>
            <i>→</i>
            <div>
              <span>ADMIT</span>
              <strong>Wallet Radar</strong>
              <small>Approved watchlist</small>
            </div>
          </div>

          <div className={classes.costStrip}>
            <div className={classes.costBadge}>
              <span>MODEL POLICY</span>
              <strong>FREE FIRST</strong>
            </div>
            <div className={classes.costModels}>
              {modelChain.map((model, index) => (
                <div key={model}>
                  <small>{index === 0 ? "FREE" : "FALLBACK " + index}</small>
                  <strong>{model}</strong>
                </div>
              ))}
            </div>
            <div className={classes.costBudget}>
              <span>SPEND TODAY</span>
              <strong>{"$" + spendToday.toFixed(4)}</strong>
              <small>{"cap $" + dailyBudget.toFixed(2) + " / day"}</small>
            </div>
          </div>

          <div className={classes.lastRun}>
            <div>
              <span>LAST MODEL</span>
              <strong>{lastUsage?.model ?? "NO RUNS YET"}</strong>
            </div>
            <div>
              <span>COST</span>
              <strong>{lastUsage ? (lastUsage.is_free ? "FREE" : "$" + lastUsage.cost_usd.toFixed(6)) : "—"}</strong>
            </div>
            <div>
              <span>TOKENS</span>
              <strong>{lastUsage ? lastUsage.input_tokens + " in / " + lastUsage.output_tokens + " out" : "—"}</strong>
            </div>
          </div>

          <div className={classes.funnel}>
            <div><span>CANDIDATES</span><strong>{counts.candidate}</strong></div>
            <div><span>WATCH</span><strong>{counts.watch}</strong></div>
            <div><span>APPROVED</span><strong>{counts.approved}</strong></div>
            <div><span>REJECTED</span><strong>{counts.rejected}</strong></div>
          </div>
        </article>
        <article className={classes.panel}>
          <div className={classes.panelHead}>
            <div>
              <span>LIVE SIGNAL STREAM</span>
              <strong>Wallet Radar</strong>
            </div>
            <b>LISTENING</b>
          </div>
          <div className={classes.emptyState}>
            <div className={classes.miniRadar}>
              <div />
              <div />
              <div />
              <span />
            </div>
            <div>
              <strong>No watched wallets enabled</strong>
              <p>Collector is healthy and waiting for the first wallet.</p>
            </div>
          </div>
        </article>

        <article className={classes.panel}>
          <div className={classes.panelHead}>
            <div>
              <span>SIGNALS</span>
              <strong>Queue</strong>
            </div>
            <b>OBSERVE</b>
          </div>
          <div className={classes.chart}>
            {[24, 34, 48, 39, 63, 52, 78, 66, 92].map((height, index) => (
              <i key={index} style={{ height: height + "%" }} />
            ))}
          </div>
          <div className={classes.panelStats}>
            <span><b>0</b> actionable</span>
            <span><b>0</b> high confidence</span>
            <span><b>0</b> rejected</span>
          </div>
        </article>

        <article className={classes.panel}>
          <div className={classes.panelHead}>
            <div>
              <span>EXECUTION</span>
              <strong>Paper Trading</strong>
            </div>
            <b>SAFE</b>
          </div>
          <div className={classes.bigValue}>OFF</div>
          <p className={classes.muted}>Live execution remains disabled. Paper and simulation paths are isolated from real capital.</p>
        </article>

        <article className={classes.panel}>
          <div className={classes.panelHead}>
            <div>
              <span>RISK & TELEMETRY</span>
              <strong>System Health</strong>
            </div>
            <b>HEALTHY</b>
          </div>
          <div className={classes.healthGrid}>
            {["API", "Collector", "Postgres", "Redis", "Risk", "Backups"].map((item) => (
              <div key={item}><span className={classes.dot} /><strong>{item}</strong><small>Online</small></div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
