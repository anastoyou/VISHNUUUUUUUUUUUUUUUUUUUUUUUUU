import type { Metadata } from "next";
import { Alex_Brush, Cinzel, Cormorant_Garamond, Great_Vibes, Montserrat } from "next/font/google";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import "./globals.css";

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alex-brush",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://vishnu-weds-vani.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vishnu & Vani — Wedding Invitation",
  description: "Wedding and Reception celebrations of Vishnu & Vani on 11 & 12 November 2026 in Palakkad, Kerala.",
  openGraph: {
    title: "Vishnu & Vani — Wedding Celebration",
    description: "Wedding Ceremony: 11 Nov 2026 @ PMR Auditorium • Reception: 12 Nov 2026 @ Thanima Auditorium",
    images: ["/assets/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${greatVibes.variable} ${alexBrush.variable} ${cinzel.variable} ${montserrat.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);`,
          }}
        />
      </head>
      <body className="font-[family-name:var(--font-cormorant)] text-[#fff0df] antialiased min-h-screen relative bg-[#190409]">
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
