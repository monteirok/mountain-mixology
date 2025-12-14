import { motion } from "framer-motion";
import { 
  Wine, 
  Home, 
  Mountain, 
  Utensils,
} from "lucide-react";



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
    <section id="services" className="relative overflow-hidden py-32 bg-neutral dark:bg-[#171e24] transition-colors duration-500">
      {/* Liquid Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-mountain-gold/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-forest/10 dark:bg-mountain-gold/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px w-12 bg-mountain-gold" />
            <span className="text-sm font-bold tracking-widest text-mountain-gold uppercase">
              What We Offer
            </span>
            <span className="h-px w-12 bg-mountain-gold" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-forest dark:text-white mb-6 leading-tight">
            Premium Catering <span className="text-mountain-gold italic">Services</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-charcoal/80 dark:text-white/80 font-light">
            From intimate cocktail parties to grand celebrations, we provide comprehensive
            beverage services tailored to your vision and venue.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full p-8 rounded-[2rem] bg-white/50 dark:bg-white/5 border border-white/20 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-mountain-gold/10 relative overflow-hidden group-hover:-translate-y-2">
                {/* Liquid Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-mountain-gold/0 via-transparent to-transparent group-hover:from-mountain-gold/5 transition-all duration-700" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white to-neutral-100 dark:from-white/10 dark:to-white/5 shadow-lg border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="text-mountain-gold" size={28} />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-playfair font-bold mb-3 text-charcoal dark:text-white group-hover:text-mountain-gold transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-base leading-relaxed text-charcoal/80 dark:text-white/80 mb-6 font-light">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-medium text-charcoal/70 dark:text-white/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-mountain-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
