'use client';

import { useState } from 'react';
import { Mail, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactForm() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult("Sending....");
    
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "7bebe87d-afeb-4529-9045-c29f21948a98");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.currentTarget.reset();
        setTimeout(() => setResult(""), 3000);
      } else {
        setResult(data.message || "Error submitting form");
      }
    } catch (error) {
      setResult("Error: Could not submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white via-blue-50/50 to-white border border-slate-200 p-10 md:p-16 rounded-[40px] shadow-2xl backdrop-blur-sm"
        >
          <div className="text-center mb-12">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-16 h-16 bg-gradient-to-br from-[#1A36A8] to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B173E] font-headline">Get in Touch</h2>
            <p className="text-slate-600 font-body text-lg">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-slate-700 font-body">Name</label>
                <input 
                  type="text" 
                  name="name"
                  required 
                  className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A36A8] focus:bg-white focus:ring-2 focus:ring-[#1A36A8]/20 transition-all font-body backdrop-blur-sm" 
                  placeholder="Your name" 
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-slate-700 font-body">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required 
                  className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A36A8] focus:bg-white focus:ring-2 focus:ring-[#1A36A8]/20 transition-all font-body backdrop-blur-sm" 
                  placeholder="your@email.com" 
                />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-sm font-bold text-slate-700 font-body">Subject</label>
              <input 
                type="text" 
                name="subject"
                required 
                className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A36A8] focus:bg-white focus:ring-2 focus:ring-[#1A36A8]/20 transition-all font-body backdrop-blur-sm" 
                placeholder="What is this about?" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="space-y-2"
            >
              <label className="text-sm font-bold text-slate-700 font-body">Message</label>
              <textarea 
                name="message"
                rows={5} 
                required 
                className="w-full bg-white/50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-[#1A36A8] focus:bg-white focus:ring-2 focus:ring-[#1A36A8]/20 transition-all font-body resize-none backdrop-blur-sm" 
                placeholder="Your message here..."
              ></textarea>
            </motion.div>

            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#1A36A8] to-blue-600 hover:from-[#12267a] hover:to-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-body"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </motion.button>

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 font-body text-sm ${
                  result.includes("Successfully") 
                    ? "bg-green-100 text-green-800" 
                    : result.includes("Sending")
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {result.includes("Successfully") && <CheckCircle className="w-5 h-5" />}
                {result.includes("Sending") && <Loader2 className="w-5 h-5 animate-spin" />}
                {result.includes("Error") && <AlertCircle className="w-5 h-5" />}
                {result}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
