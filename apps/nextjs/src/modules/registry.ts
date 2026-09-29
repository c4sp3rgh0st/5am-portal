import type { FiveAmModuleManifest } from "./types";
import { tradingLabModule } from "./trading-lab/manifest";

export const fiveAmModules: FiveAmModuleManifest[] = [
  tradingLabModule,
];

export function getFiveAmModule(id: FiveAmModuleManifest["id"]) {
  return fiveAmModules.find((module) => module.id === id);
}
