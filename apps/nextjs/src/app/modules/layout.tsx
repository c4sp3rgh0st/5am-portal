import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "5AM Life", template: "%s · 5AM Life" },
  description: "5AM Life portal modules",
};

export default function FiveAmModulesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ minHeight: "100%", overflowX: "hidden", overflowY: "auto" }}>
      <body style={{ margin: 0, minHeight: "100%", overflowX: "hidden", overflowY: "auto", background: "#08111e" }}>
        {children}
      </body>
    </html>
  );
}
