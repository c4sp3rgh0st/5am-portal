import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@homarr/auth/next";

export const metadata: Metadata = {
  title: "LifeOS",
  description: "5AM Life LifeOS — today, goals, habits, schedule, journal and review.",
};

export default async function LifeOsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  return children;
}
