import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { RBACProvider } from "@/lib/rbac/client-guard";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TURIA | CA Practice Management & Compliance Operating System",
  description:
    "Next-generation practice orchestration, statutory compliance, timesheet costing, and DSC physical vault for Indian Chartered Accountants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      dynamic
      appearance={{
        variables: {
          colorPrimary: "#6366F1",
          colorBackground: "#FFFFFF",
          colorForeground: "#0F172A",
          colorInputForeground: "#0F172A",
          borderRadius: "0.625rem",
          fontFamily: "var(--font-inter), sans-serif",
        },
      }}
    >
      <html
        lang="en"
        className={`${inter.variable} h-full antialiased font-sans`}
        suppressHydrationWarning
      >
        <head suppressHydrationWarning>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('turia-theme');
                    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (theme === 'dark' || (!theme && supportDarkMode)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-150">
          <ThemeProvider>
            <RBACProvider>{children}</RBACProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
