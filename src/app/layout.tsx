import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import ClientBody from "./ClientBody";

// Используем Montserrat для заголовков и Inter для основного текста
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weather & Clothing - Прогноз погоды с рекомендациями по одежде",
  description:
    "Сервис для получения прогноза погоды и персонализированных рекомендаций по подбору одежды в зависимости от погодных условий",
  keywords: [
    "прогноз погоды",
    "рекомендации по одежде",
    "метеосервис",
    "погода и одежда",
    "что надеть сегодня"
  ],
  authors: [{ name: "Weather & Clothing Team" }],
  creator: "Weather & Clothing",
  publisher: "Weather & Clothing",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://weather-clothing.example.com",
    title: "Weather & Clothing - Прогноз погоды с рекомендациями по одежде",
    description: "Сервис для получения прогноза погоды и персонализированных рекомендаций по подбору одежды",
    siteName: "Weather & Clothing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather & Clothing - Прогноз погоды с рекомендациями по одежде",
    description: "Сервис для получения прогноза погоды и персонализированных рекомендаций по подбору одежды",
    creator: "@weatherclothing",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${montserrat.variable} ${inter.variable}`}>
      <ClientBody>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ClientBody>
    </html>
  );
}
