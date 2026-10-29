import type { Metadata } from "next";
import "./globals.css";
import "./portfolio-responsive.css";

export const metadata: Metadata = {
  title: "Bilal Ahmed — Web & Mobile Developer",
  description: "Karachi-based developer with 3+ years of experience in React Native, React.js, Next.js, TypeScript, and the MERN stack.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full">{children}</body></html>;
}
