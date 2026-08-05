import { Manrope, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import SmoothScrolling from "@/components/SmoothScrolling";
import WhatsAppButton from "@/components/WhatsAppButton";
import SideRays from "@/components/SideRays";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata = {
  title: "Maawarna Studios | Photographer Portfolio",
  description: "Cinematic storytelling through photography and videography.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} ${syne.variable} antialiased min-h-screen bg-background text-foreground font-body`}
      >
        {/* One light source for the whole site, fixed to the top-right corner
            of the viewport so every page carries it and it holds while the
            page scrolls. */}
        <SideRays
          className="side-rays-fixed"
          rayColor1="#3b82f6"
          rayColor2="#93c5fd"
          intensity={1.4}
          spread={1.6}
          speed={1.6}
          saturation={1.2}
          falloff={1.4}
          opacity={0.55}
        />
        <SmoothScrolling>
          <Navigation />
          {children}
          <Footer />
          <WhatsAppButton />
        </SmoothScrolling>
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
