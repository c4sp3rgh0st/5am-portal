export type FiveAmModuleId = "trading-lab" | "lifeos";

export type FiveAmModuleStatus = "active" | "preview" | "disabled";

export interface FiveAmModuleManifest {
  id: FiveAmModuleId;
  name: string;
  description: string;
  route: string;
  icon: string;
  group: "life" | "money" | "bodywork" | "labs" | "ops";
  status: FiveAmModuleStatus;
  requiresAuth: boolean;
  backend?: {
    healthUrl: string;
  };
}
