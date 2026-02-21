import { Manrope, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import SmoothScrolling from "@/components/SmoothScrolling";
import WhatsAppButton from "@/components/WhatsAppButton";

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
