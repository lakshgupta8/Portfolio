import { motion } from 'framer-motion';
import { Code, Palette, Globe, Bot } from 'lucide-react';

export default function About() {
    const cards = [
        {
            icon: <Code size={32} />,
            title: "Clean Code",
            description: "Writing scalable, maintainable, and efficient code is my priority."
        },
        {
            icon: <Palette size={32} />,
            title: "Modern Design",
            description: "Creating visually appeals interfaces with detailed attention to UX."
        },
        {
            icon: <Globe size={32} />,
            title: "Web Performance",
            description: "Optimizing applications for speed and accessibility across all devices."
        },
        {
            icon: <Bot size={32} />,
            title: "AI Utilization",
            description: "Utilizing AI to enhance productivity and create innovative solutions."
        }
    ];

    return (
        <section id="about" className="relative bg-slate-950 py-24">
            <div className="mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">About <span className="text-purple-400">Me</span></h2>
                    <div className="bg-linear-to-r from-purple-400 to-pink-400 mx-auto rounded-full w-20 h-1"></div>
                    <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                        I am a dedicated developer seeking to craft perfect digital solutions. With a strong foundation in modern web technologies, I bridge the gap between design and functionality.
                    </p>
                </motion.div>

                <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-slate-900/50 hover:bg-slate-900 p-6 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-all"
                        >
                            <div className="mb-4 text-purple-400 group-hover:text-purple-300 transition-colors">
                                {card.icon}
                            </div>
                            <h3 className="mb-2 font-bold text-xl">{card.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {card.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
