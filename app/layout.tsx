import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { Sidebar } from "@/components/sidebar";
import { fontMontserrat } from "@/config/fonts";
import { Navbar, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontMontserrat.className
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className={`flex-1 ${"lg:w-full w-full"} px-6 py-4`}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
