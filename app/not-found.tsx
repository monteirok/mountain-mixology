import Link from 'next/link'

import BookEventButton from '@/components/ui/BookEventButton'

export default function NotFound() {
  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center bg-[#161616]/20 bg-cover bg-center md:bg-fixed"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        backgroundPosition: "center top",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#161616]/80 via-[#161616]/60 to-[#161616]/20" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="font-playfair text-[8rem] md:text-[12rem] leading-none font-bold text-white mb-2">
          404
        </h1>
        
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-mountain-gold mb-6">
          Page Not Found
        </h2>
        
        <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg leading-relaxed font-light">
          Sorry, we couldn't find what you were looking for.
        </p>
        
        <Link href="/">
          <BookEventButton variant="glass">
            Return Home
          </BookEventButton>
        </Link>
      </div>
    </div>
  )
}