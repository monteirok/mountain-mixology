import { motion } from "framer-motion";
import { 
  Wine, 
  Home, 
  Mountain, 
  Utensils,
} from "lucide-react";
import Image from "next/image";



const services = [
  {
    icon: Home,
    title: "Private Parties",
    description: "Intimate cocktail experiences for birthdays, anniversaries, and special celebrations in your home or venue.",
    features: [
    ]
  },
  {
    icon: Wine,
    title: "Wedding Cocktail Service",
    description: "Signature cocktail menus, professional bartending, and elegant presentation for your special day in the mountains.",
    features: [
    ]
  },
  {
    icon: Mountain,
    title: "Destination Events",
    description: "Specialized cocktail catering for mountain lodges, ski chalets, and outdoor celebrations.",
    features: [
    ]
  },
  {
    icon: Utensils,
    title: "Full Bar Service",
    description: "Complete beverage service including wine, beer, and premium spirits alongside our signature cocktails.",
    features: [
    ]
  }
];

export default function Services() {


  return (
    <section id="services" className="relative min-h-screen py-12 md:py-20 flex items-center justify-center overflow-hidden bg-neutral-100 dark:bg-[#161616] transition-colors duration-500">
      {/* Background Image */}


      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-24"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 bg-mountain-gold" />
            <span className="text-sm font-bold tracking-widest text-mountain-gold uppercase">
              What We Offer
            </span>
            <span className="h-px w-12 bg-mountain-gold" />
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-forest dark:text-white mb-6 leading-tight drop-shadow-lg">
            Premium Catering <span className="text-mountain-gold italic">Services</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-charcoal/80 dark:text-white/90 font-light drop-shadow-md">
            From intimate cocktail parties to grand celebrations, we provide comprehensive
            beverage services tailored to your vision and venue.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-x-40 lg:gap-y-12 max-w-7xl mx-auto relative">
          {/* Background Image Centered in Grid - Desktop Only */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none -z-10">
            <div className="relative w-full max-w-5xl h-[50vh] md:h-[70vh]">
              <Image
                src="/images/cocktails/classic-old-fashion.png"
                alt="Classic Old Fashioned Cocktail"
                fill
                className="object-contain object-center opacity-80"
                priority
                quality={100}
              />
              {/* Blending Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-100 via-transparent to-neutral-100 dark:from-[#161616] dark:via-transparent dark:to-[#161616]" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 via-transparent to-neutral-100 dark:from-[#161616] dark:via-transparent dark:to-[#161616]" />
            </div>
          </div>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full p-6 md:p-8 rounded-[2rem] bg-white dark:bg-black/40 backdrop-blur-md border border-neutral-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-black/50 hover:border-mountain-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-mountain-gold/5 relative overflow-hidden group-hover:-translate-y-1">
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-white/10 border border-neutral-200 dark:border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="text-mountain-gold" size={24} />
                  </div>
                  
                  <h3 className="text-xl font-playfair font-bold mb-3 text-charcoal dark:text-white group-hover:text-mountain-gold transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-charcoal/80 dark:text-white/80 mb-6 font-light">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xs font-medium text-charcoal/70 dark:text-white/70">
                          <span className="w-1 h-1 rounded-full bg-mountain-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Mobile Image Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="block md:hidden relative h-80 rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/cocktails/classic-old-fashion.png"
              alt="Classic Old Fashioned Cocktail"
              fill
              className="object-cover object-center"
              quality={100}
            />
            <div className="absolute inset-0 border border-neutral-200 dark:border-white/10 rounded-[2rem] pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
