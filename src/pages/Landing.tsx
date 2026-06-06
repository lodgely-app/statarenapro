import React from 'react';
import { Trophy, Shield, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sofa-bg text-sofa-text selection:bg-sofa-blue selection:text-white pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-sofa-blue px-4 md:px-6 h-12 md:h-14 shadow-md">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-center relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
              <img src="/favicon.png" alt="StatArena Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-black text-lg md:text-xl tracking-tighter uppercase">
                STATARENA <span className="font-light opacity-50">PRO</span>
              </span>
            </div>
          </div>
          
          <div className="absolute right-0 top-0 h-full flex items-center">
            <button 
              onClick={() => navigate('/register')} 
              className="bg-white text-sofa-blue px-4 py-1.5 rounded-lg font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-slate-100 transition-all shadow-sm"
            >
              Register League
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 px-6 max-w-[1600px] mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white rounded-3xl mx-auto flex items-center justify-center p-6 shadow-xl border border-sofa-border mb-8"
          >
            <Trophy className="w-full h-full text-sofa-blue" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-sofa-navy"
          >
            Tournament Intelligence for the <span className="text-sofa-blue italic">Elite</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-sofa-muted font-medium max-w-2xl mx-auto"
          >
            Manage your leagues, cups, and e-sports tournaments with professional-grade tools, isolated tenant environments, and beautiful public dashboards.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <button 
              onClick={() => navigate('/register')} 
              className="bg-sofa-blue text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-sofa-blue/20"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-32">
          {[
            { icon: Shield, title: 'Isolated Tenants', desc: 'Custom subdomains and isolated databases for every community or organization.' },
            { icon: Users, title: 'Real-time Standings', desc: 'Live updates, round-robin tracking, and knockout tournament brackets.' },
            { icon: Trophy, title: 'Premium Design', desc: 'A stunning SofaScore-inspired interface built for performance and mobile responsiveness.' }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="bg-white p-8 rounded-2xl border border-sofa-border shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="w-12 h-12 bg-sofa-blue/10 rounded-xl flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-sofa-blue" />
              </div>
              <h3 className="text-xl font-black uppercase text-sofa-navy tracking-tight">{feature.title}</h3>
              <p className="text-sofa-muted font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
