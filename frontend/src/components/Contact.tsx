'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Instagram, Linkedin, Github, Download, Twitter, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('http://localhost:3001/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 bg-gloss-black relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Left: Contact Info */}
          <div className="w-full md:w-1/2">
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-4xl font-bold mb-8 text-white"
            >
              LET'S CONNECT
            </motion.h2>
            <p className="text-dark-silver text-lg mb-12">
              Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to discussing new projects and creative ideas.
            </p>

            <div className="flex gap-6 mb-12">
               <SocialLink href="https://www.instagram.com/im.akhilkumar.s" icon={<Instagram />} label="Instagram" />
               <SocialLink href="https://www.linkedin.com/in/akhil-kumar-s-9583762a1" icon={<Linkedin />} label="LinkedIn" />
               <SocialLink href="https://github.com/Akhil-Kumar-2001" icon={<Github />} label="GitHub" />
               {/* Placeholder for Twitter as not provided */}
               <SocialLink href="#" icon={<Twitter />} label="Twitter" />
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://drive.google.com/file/d/1bFyee5Rd5Laax53qGLxibvTxTXM0koWt/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-metallic-silver transition-colors"
            >
              <Download size={20} />
              Download Resume
            </motion.a>
          </div>

          {/* Right: Form */}
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                 <input 
                   type="text" 
                   placeholder="Your Name" 
                   required
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-white focus:border-electric-blue focus:outline-none focus:bg-gray-900 transition-all"
                 />
              </div>
              <div>
                 <input 
                   type="email" 
                   placeholder="Your Email" 
                   required
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                   className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-white focus:border-electric-blue focus:outline-none focus:bg-gray-900 transition-all"
                 />
              </div>
              <div>
                 <textarea 
                   placeholder="Message" 
                   rows={6}
                   required
                   value={formData.message}
                   onChange={(e) => setFormData({...formData, message: e.target.value})}
                   className="w-full bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-white focus:border-electric-blue focus:outline-none focus:bg-gray-900 transition-all resize-none"
                 />
              </div>

              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-gradient-to-r from-electric-blue to-neon-purple text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {status === 'sending' ? 'Sending...' : <>Send Message <Send size={18} /></>}
              </button>
              
              {status === 'success' && <p className="text-green-500 mt-2">Message sent successfully!</p>}
              {status === 'error' && <p className="text-red-500 mt-2">Failed to send message. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-12 h-12 flex items-center justify-center border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-electric-blue hover:shadow-[0_0_15px_rgba(65,105,225,0.4)] transition-all duration-300"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

