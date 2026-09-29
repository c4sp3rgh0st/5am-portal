import type { FiveAmModuleManifest } from "./types";
import { lifeOsModule } from "./lifeos/manifest";
import { tradingLabModule } from "./trading-lab/manifest";

export const fiveAmModules: FiveAmModuleManifest[] = [
  lifeOsModule,
  tradingLabModule,
];

export function getFiveAmModule(id: FiveAmModuleManifest["id"]) {
  return fiveAmModules.find((module) => module.id === id);
}
