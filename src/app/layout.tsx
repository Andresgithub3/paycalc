import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0D6E3F' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0F14' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "PayCalc — Canadian Salary & Tax Calculator",
  description:
    "Free Canadian salary calculator. Convert salary ↔ hourly, see federal + provincial tax breakdown, compare take-home pay across all 13 provinces.",
  metadataBase: new URL('https://paycalc.ca'),
  openGraph: {
    type: 'website',
    siteName: 'PayCalc',
    locale: 'en_CA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
