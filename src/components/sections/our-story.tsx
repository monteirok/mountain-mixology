import Image from "next/image";
import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section id="about" className="py-32 bg-white dark:bg-[#101519] transition-colors duration-500 relative overflow-hidden">
      {/* Liquid Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-mountain-gold/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-forest/10 dark:bg-mountain-gold/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content in Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-white/30 dark:bg-white/5 rounded-[3rem] blur-2xl -z-10" />
            <div className="glass-card p-10 md:p-12 rounded-[2.5rem] border border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-px w-12 bg-mountain-gold" />
                <span className="text-sm font-bold tracking-widest text-mountain-gold uppercase">
                  Our Story
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-forest dark:text-white mb-8 leading-tight">
                Crafting <span className="text-mountain-gold italic">Liquid</span> Art
              </h2>
              
              <div className="space-y-6 text-lg text-charcoal/80 dark:text-white/80 leading-relaxed font-light">
                <p>
                  Born from the pristine waters and rugged peaks of Canmore, Mountain Mixology is more than a service—it's an experience. We blend the wild spirit of the Rockies with the refined elegance of modern mixology.
                </p>
                <p>
                  Every cocktail is a story, poured into a glass. We believe in the magic of gathering, the warmth of a toast, and the lingering memory of a perfectly balanced flavor profile.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image Content with Liquid Effects */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10" />
              <Image
                src="/images/cocktails/classic-old-fashion.png"
                alt="Professional mixologist crafting premium cocktails"
                width={800}
                height={600}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              
              {/* Glass Overlay on Image */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                <div className="glass-card p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
                  <p className="text-white/90 font-playfair italic text-xl">
                    "Where nature meets refinement."
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 w-32 h-32 bg-mountain-gold/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-12 -left-12 w-40 h-40 bg-forest/20 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
