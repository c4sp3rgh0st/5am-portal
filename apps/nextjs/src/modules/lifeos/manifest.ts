import type { FiveAmModuleManifest } from "../types";

export const lifeOsModule: FiveAmModuleManifest = {
  id: "lifeos",
  name: "LifeOS",
  description: "Daily command center for goals, habits, schedule, journal and reviews.",
  route: "/modules/lifeos",
  icon: "sunrise",
  group: "life",
  status: "preview",
  requiresAuth: true,
};
