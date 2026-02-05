import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative flex justify-center items-center pt-20 min-h-screen overflow-hidden">

            <div className="top-0 -z-10 absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950"></div>
            <div className="top-1/4 -left-20 absolute bg-purple-500/10 blur-3xl rounded-full w-72 h-72"></div>
            <div className="-right-20 bottom-1/4 absolute bg-blue-500/10 blur-3xl rounded-full w-96 h-96"></div>

            <div className="items-center gap-12 grid lg:grid-cols-2 mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="mb-6 font-bold text-5xl md:text-7xl tracking-tight">
                        Building Digital <span className="bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 text-transparent">Experiences</span>
                    </h1>

                    <p className="mb-8 max-w-lg text-slate-400 text-lg md:text-xl leading-relaxed">
                        I'm a full-stack developer passionate about creating stunning, interactive, and high-performance web applications.
                    </p>

                    <div className="flex sm:flex-row flex-col gap-4">
                        <a
                            href="#projects"
                            className="flex justify-center items-center gap-2 bg-white hover:bg-slate-200 px-8 py-4 rounded-full font-semibold text-slate-950 transition-colors"
                        >
                            View Projects <ArrowRight size={20} />
                        </a>
                        <a
                            href="#contact"
                            className="flex justify-center items-center gap-2 bg-transparent px-8 py-4 border border-slate-700 hover:border-purple-500 rounded-full font-semibold text-white hover:text-purple-400 transition-all"
                        >
                            Contact Me
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block relative"
                >
                    <div className="group z-10 relative bg-linear-to-tr from-slate-800 to-slate-900 shadow-2xl p-2 border border-slate-700/50 rounded-2xl w-full h-[600px] rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                        <div className="absolute inset-0 bg-linear-to-tr from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500" />
                        <div className="relative bg-slate-950 rounded-xl w-full h-full overflow-hidden">
                            <div className="space-y-4 p-6">
                                <div className="flex gap-2">
                                    <div className="bg-red-500 rounded-full w-3 h-3"></div>
                                    <div className="bg-yellow-500 rounded-full w-3 h-3"></div>
                                    <div className="bg-green-500 rounded-full w-3 h-3"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-slate-800 rounded w-1/3 h-2"></div>
                                    <div className="bg-slate-800 rounded w-2/3 h-2"></div>
                                    <div className="bg-slate-800 rounded w-1/2 h-2"></div>
                                </div>
                            </div>

                            <div className="inset-0 opacity-40 p-6 overflow-hidden font-mono text-slate-500 leading-relaxed pointer-events-none select-none">
                                <span className="text-purple-400">import</span> React, {"{"} useState, useEffect {"}"} <span className="text-purple-400">from</span> <span className="text-green-300">'react'</span>;{"\n"}
                                <span className="text-purple-400">import</span> {"{"} motion {"}"} <span className="text-purple-400">from</span> <span className="text-green-300">'framer-motion'</span>;{"\n"}
                                {"\n"}
                                <span className="text-slate-400">{"// Developer profile configuration"}</span>{"\n"}
                                <span className="text-purple-400">const</span> <span className="text-yellow-200">developer</span> = {"{"}{"\n"}
                                {"  "}name: <span className="text-green-300">'Lakshya Gupta'</span>,{"\n"}
                                {"  "}role: <span className="text-green-300">'Full Stack Developer'</span>,{"\n"}
                                {"  "}traits: [<span className="text-green-300">'Creative'</span>, <span className="text-green-300">'Logical'</span>, <span className="text-green-300">'Passionate'</span>]{"\n"}
                                {"}"};{"\n"}
                                {"\n"}
                                <span className="text-purple-400">export default function</span> <span className="text-yellow-200">Portfolio</span>() {"{"}{"\n"}
                                {"  "}<span className="text-purple-400">const</span> [isAwesome, setIsAwesome] = <span className="text-blue-300">useState</span>(<span className="text-purple-300">true</span>);{"\n"}
                                {"\n"}
                                {"  "}<span className="text-blue-300">useEffect</span>(() ={">"} {"{"}{"\n"}
                                {"    "}<span className="text-purple-400">if</span> (developer.role === <span className="text-green-300">'Full Stack Developer'</span>) {"{"}{"\n"}
                                {"      "}console.<span className="text-blue-300">log</span>(<span className="text-green-300">'Building the future...'</span>);{"\n"}
                                {"    "}{"}"}{"\n"}
                                {"  "}{"}"}, []);{"\n"}
                                {"\n"}
                                {"  "}<span className="text-purple-400">return</span> ({"\n"}
                                {"    "}<span className="text-blue-300">{"<div"}</span> className=<span className="text-green-300">"future-tech"</span>{">"}{"\n"}
                                {"      "}<span className="text-blue-300">{"<Code>"}</span>{"\n"}
                                {"        "}{"{"}developer.traits.map(trait ={">"} ({"\n"}
                                {"          "}<span className="text-blue-300">{"<span"}</span> key={"{trait}"}{">"}{"{trait}"}<span className="text-blue-300">{"</span>"}</span>{"\n"}
                                {"        "})){"}"}{"\n"}
                                {"      "}<span className="text-blue-300">{"</Code>"}</span>{"\n"}
                                {"    "}<span className="text-blue-300">{"</div>"}</span>{"\n"}
                                {"  "});{"\n"}
                                {"}"}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
