'use client'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClientProvider } from '@/components/query-client-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import Navigation from "@/components/navigation";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Services from "@/components/sections/services";
import Reviews from "@/components/sections/reviews";
import Cocktails from "@/components/sections/cocktails";
import Gallery from "@/components/sections/gallery";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <ThemeProvider
      defaultTheme="light"
      storageKey="mountain-mixology-theme"
    >
      <QueryClientProvider>
        <TooltipProvider>
          <div className="min-h-screen">
            <Navigation />
            <Hero />
            <About />
            <Services />
            <Reviews />
            <Cocktails />
            <Gallery />
            <Contact />
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}