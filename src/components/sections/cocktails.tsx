import { motion } from "framer-motion";
import { Leaf, Palette } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Locally sourced herbs, fruits, and premium spirits"
  },
  {
    icon: Palette,
    title: "Custom Creations",
    description: "Personalized cocktails designed for your event"
  },
  // TODO: update or remove the following
  // {
  //   icon: Award,
  //   title: "Award-Winning",
  //   description: "Recognized mixology techniques and presentation"
  // }
];

export default function Cocktails() {
  return (
    <section id="cocktails" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Our Signature Cocktails
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Crafted with premium spirits, fresh ingredients, and mountain-inspired flair.
            Each cocktail tells a story of the Canadian Rockies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* TODO: Update cocktails menu */}
          {/* {cocktails.map((cocktail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-card hover-lift group h-full">
                <div className="p-6">
                  <Image
                    src={cocktail.image}
                    alt={cocktail.name}
                    width={400}
                    height={400}
                    className="mb-4 h-48 w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1280px) 250px, (min-width: 768px) 45vw, 100vw"
                  />
                  <h3 className="text-xl font-playfair font-semibold mb-2 text-white">
                    {cocktail.name}
                  </h3>
                  <p className="text-sm opacity-80 mb-3 text-white">
                    {cocktail.description}
                  </p>
                  <div className="text-mountain-gold font-semibold">
                    {cocktail.price}
                  </div>
                </div>
              </div>
            </motion.div>
          ))} */}
        </div>

        {/* TODO: <div className="grid md:grid-cols-3 gap-8"> */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-mountain-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-mountain-gold text-2xl" size={32} />
              </div>
              <h3 className="text-xl font-playfair font-semibold mb-2">{feature.title}</h3>
              <p className="opacity-80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
