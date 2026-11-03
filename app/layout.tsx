import type { Metadata } from "next";
import { Alex_Brush, Cinzel, Cormorant_Garamond, Montserrat } from "next/font/google";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import "./globals.css";

  const alexBrush = Alex_Brush({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-alex-brush",
    display: "swap",
  });

    const cinzel = Cinzel({
      weight: ["400", "600", "700", "800"],
      subsets: ["latin"],
      variable: "--font-cinzel",
      display: "swap",
    });

    const cormorant = Cormorant_Garamond({
      weight: ["400", "600", "700"],
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
      : 'https://sreeraj-weds-suji.vercel.app';

    export const metadata: Metadata = {
      metadataBase: new URL(siteUrl),
      title: "Wedding Celebration | Sreeraj & Suji",
      description: "Wedding and Reception celebrations of Sreeraj & Suji on Wednesday, December 30, 2026.",
      openGraph: {
        title: "Wedding Celebration: Sreeraj & Suji",
        description: "Wednesday, December 30, 2026 • Greens Avenue Auditorium, Desamangalam & Kodakkal CSI Parish Hall, Malappuram",
        images: ["/assets/couple.jpeg"],
      },
    };

    export default function RootLayout({
      children,
    }: Readonly<{
      children: React.ReactNode;
    }>) {
    return(
    <html
      lang = "en"
      className = {`${cinzel.variable} ${cormorant.variable} ${alexBrush.variable} ${montserrat.variable} scroll-smooth`}
  >
      <body className="font-[family-name:var(--font-montserrat)] text-[#2D1525] antialiased min-h-screen relative selection:bg-[#C2185B]/20 selection:text-[#9C1448]">
        <AnalyticsTracker />
        {children}
      </body>
    </html >
  );
}
