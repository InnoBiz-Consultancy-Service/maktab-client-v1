import type { Metadata, Viewport } from "next";
import { Fredoka, Plus_Jakarta_Sans, Amiri } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maktab — Lantern-lit learning",
  description:
    "A warm, calm place to learn — Quran, Arabic, studies and duas under a lantern-lit night sky.",
  applicationName: "Maktab",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Maktab" },
};

export const viewport: Viewport = {
  themeColor: "#0b1f2a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${jakarta.variable} ${amiri.variable}`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#fdfbf5",
              color: "#0b1f2a",
              border: "1px solid #ece0c8",
              borderRadius: "1rem",
              fontFamily: "var(--font-jakarta)",
            },
          }}
        />
      </body>
    </html>
  );
}
