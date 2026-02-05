import { motion } from 'framer-motion';

export default function Skills() {
    const skills = [
        { category: "Frontend", items: ["HTML/CSS/JS", "React.js", "Vite", "Tailwind CSS", "Framer Motion", "Redux", "TypeScript"] },
        { category: "Backend", items: ["Node.js", "Python", "Express.js", "MySQL"] },
        { category: "Tools", items: ["Netlify", "Git", "GitHub", "VS Code/Google Antigravity", "PostMan", "Bun.js"] }
    ];

    return (
        <section id="skills" className="bg-slate-900 py-24 border-slate-800/50 border-t">
            <div className="mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">My <span className="text-purple-400">Skills</span></h2>
                    <div className="bg-linear-to-r from-purple-400 to-pink-400 mx-auto rounded-full w-20 h-1"></div>
                    <p className="mt-4 text-slate-400">I approach every project with a diverse toolkit.</p>
                </motion.div>

                <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                    {skills.map((skillGroup, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-950 p-8 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-colors"
                        >
                            <h3 className="mb-6 font-bold text-purple-300 text-xl">{skillGroup.category}</h3>
                            <div className="flex flex-wrap gap-3">
                                {skillGroup.items.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-slate-900 hover:bg-purple-900/20 px-4 py-2 border border-slate-800 hover:border-purple-500/30 rounded-full font-medium text-slate-300 hover:text-purple-300 text-sm transition-all cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
