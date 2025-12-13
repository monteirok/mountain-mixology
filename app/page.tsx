'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import Navigation from "@/components/navigation";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Services from "@/components/sections/services";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="min-h-screen">
          <Navigation />
          <Hero />
          <About />
          <Services />
          <Contact />
          <Footer />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
