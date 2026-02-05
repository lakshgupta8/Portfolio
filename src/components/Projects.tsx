import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

export default function Projects() {
    const projects = [
        {
            title: "EQUANO",
            description: "A powerful graphing calculator built with React and D3.js, featuring advanced 2D and 3D rendering capabilities for complex mathematical functions and data visualization.",
            tags: ["React", "Typescript", "D3.js", "Tailwind"],
            links: { demo: "#", github: "#" },
            image: "/equanothumbnail.png"
        },
        {
            title: "AwesomeBuy",
            description: "Full-stack e-commerce solution with Stripe integration and real-time inventory.",
            tags: ["React.js", "Prisma", "MySQL", "Typescript", "Tailwind", "Stripe", "Bun.js"],
            links: { demo: "#", github: "#" },
            image: "/awesomebuythumbnail.png"
        },
        {
            title: "XTodo",
            description: "A collaborative todo application built with React and Firebase, featuring real-time updates.",
            tags: ["React", "Typescript", "Tailwind", "Firebase"],
            links: { demo: "#", github: "#" },
            image: "/xtodothumbnail.png"
        }
    ];

    return (
        <section id="projects" className="bg-slate-950 py-24">
            <div className="mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">Featured <span className="text-purple-400">Projects</span></h2>
                    <div className="bg-linear-to-r from-purple-400 to-pink-400 mx-auto rounded-full w-20 h-1"></div>
                </motion.div>

                <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                        >
                            {/* Image Placeholder */}
                            <div className="relative w-full h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                            </div>

                            <div className="relative p-6">
                                <h3 className="flex items-center gap-2 mb-2 font-bold group-hover:text-purple-400 text-xl transition-colors">
                                    {project.title}
                                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h3>
                                <p className="mb-4 text-slate-400 text-sm line-clamp-2">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="bg-slate-800 px-2 py-1 border border-slate-700 rounded text-slate-300 text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 mt-auto">
                                    <a href={project.links.github} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                                        <Github size={16} /> Code
                                    </a>
                                    <a href={project.links.demo} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                                        <ExternalLink size={16} /> Live Demo
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
