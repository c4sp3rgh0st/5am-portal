import type { FiveAmModuleManifest } from "../types";

export const tradingLabModule: FiveAmModuleManifest = {
  id: "trading-lab",
  name: "Trading Lab",
  description: "Wallet radar, signals, paper execution and risk telemetry.",
  route: "/modules/trading-lab",
  icon: "chart-candlestick",
  group: "money",
  status: "active",
  requiresAuth: true,
  backend: {
    healthUrl: "http://127.0.0.1:8400/health",
  },
};
