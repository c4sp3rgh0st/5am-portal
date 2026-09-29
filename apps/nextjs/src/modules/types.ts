export type FiveAmModuleId = "trading-lab";

export type FiveAmModuleStatus = "active" | "preview" | "disabled";

export interface FiveAmModuleManifest {
  id: FiveAmModuleId;
  name: string;
  description: string;
  route: string;
  icon: string;
  group: "money" | "bodywork" | "labs" | "ops";
  status: FiveAmModuleStatus;
  requiresAuth: boolean;
  backend?: {
    healthUrl: string;
  };
}
