import "./globals.css";
import { Inter, Montserrat } from "next/font/google";
import LocaleWrapper from "@/components/i18n/LocaleWrapper";
import { LOCALES } from "@/lib/i18n/constants";
// import { GoogleTagManager } from "@next/third-parties/google";
// import { Metadata } from "next";

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${montserrat.variable}`}
    >
      {/* <GoogleTagManager gtmId="GTM-PC8MX4P" /> */}
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body suppressHydrationWarning>
        <LocaleWrapper locale={locale}>
          <main className="select-none">{children}</main>
        </LocaleWrapper>
      </body>
    </html>
  );
}

//  Generate static params for supported locales
export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
