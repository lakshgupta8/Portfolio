import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-950 py-12 border-slate-900 border-t">
            <div className="mx-auto px-6 max-w-7xl">
                <div className="gap-8 grid grid-cols-1 md:grid-cols-4 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 mb-4 font-bold text-transparent text-2xl">
                            Portfolio
                        </h2>
                        <p className="max-w-sm text-slate-400">
                            Building digital experiences with passion and precision. Let's create something amazing together.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#about" className="text-slate-400 hover:text-purple-400 transition-colors">About</a></li>
                            <li><a href="#projects" className="text-slate-400 hover:text-purple-400 transition-colors">Projects</a></li>
                            <li><a href="#skills" className="text-slate-400 hover:text-purple-400 transition-colors">Skills</a></li>
                            <li><a href="#contact" className="text-slate-400 hover:text-purple-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="https://github.com/lakshgupta8" className="text-slate-400 hover:text-white transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/lakshya-gupta-54932524b/" className="text-slate-400 hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://x.com/LakshyaWWIII" className="text-slate-400 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://www.instagram.com/lakshgupta8/" className="text-slate-400 hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex md:flex-row flex-col justify-between items-center pt-8 border-slate-900 border-t text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
