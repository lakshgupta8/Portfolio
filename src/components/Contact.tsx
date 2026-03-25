import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Contact() {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            const apiUrl = `${import.meta.env.VITE_API_URL || ""}/send`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formState.name,
                    senderEmail: formState.email,
                    receiverEmail: 'lakshya1176@gmail.com',
                    message: formState.message,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to send message');
            }

            setStatus({ type: 'success', message: 'Message sent successfully!' });
            setFormState({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to send message. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (status.message) {
            const timer = setTimeout(() => {
                setStatus({ type: null, message: '' });
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <section id="contact" className="bg-slate-900 py-24 border-slate-800/50 border-t">
            <div className="mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">Get in <span className="text-purple-400">Touch</span></h2>
                    <div className="bg-linear-to-r from-purple-400 to-pink-400 mx-auto rounded-full w-20 h-1"></div>
                    <p className="mx-auto mt-4 max-w-xl text-slate-400">
                        Have a project in mind or just want to say hi? I'd love to hear from you.
                    </p>
                </motion.div>

                <div className="mx-auto max-w-2xl">

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-950 shadow-lg p-8 border border-slate-800 rounded-2xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status.message && (
                                <div className={`p-4 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {status.message}
                                </div>
                            )}
                            <div>
                                <label htmlFor="name" className="block mb-2 font-medium text-slate-400 text-sm">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    autoComplete='on'
                                    className="bg-slate-900 px-4 py-3 border border-slate-800 focus:border-purple-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 w-full text-white transition-colors"
                                    placeholder="Your Name"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 font-medium text-slate-400 text-sm">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    autoComplete='on'
                                    className="bg-slate-900 px-4 py-3 border border-slate-800 focus:border-purple-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 w-full text-white transition-colors"
                                    placeholder="your@email.com"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block mb-2 font-medium text-slate-400 text-sm">Message</label>
                                <textarea
                                    rows={4}
                                    id="message"
                                    required
                                    autoComplete='on'
                                    className="bg-slate-900 px-4 py-3 border border-slate-800 focus:border-purple-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 w-full text-white transition-colors resize-none custom-scrollbar"
                                    placeholder="Tell me about your project..."
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-4 rounded-lg w-full font-semibold text-white transition-colors cursor-pointer"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
