import React from 'react';
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Trophy, Clock, FileText, Layout, Target, TrendingUp, Calendar, Zap, DollarSign, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardMockup } from '../components/DashboardMockup';
import { HeroSection } from '../components/HeroSection';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-sofa-navy font-sans selection:bg-sofa-blue selection:text-white">
      
      {/* 1. Split Hero Section */}
      <section className="relative w-full lg:h-[750px] flex flex-col lg:flex-row pt-[72px]">
        
        {/* Floating Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-sofa-blue shadow-md">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded p-1.5 shadow-sm">
              <img src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase text-white">
              STATARENA <span className="font-light opacity-80">PRO</span>
            </span>
          </div>
          
          {/* <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors">Who's It For?</a>
          </div> */}

          <div>
            <button 
              onClick={() => navigate('/register')} 
              className="bg-white text-sofa-blue px-6 py-2.5 rounded font-black text-[10px] md:text-xs tracking-widest uppercase hover:bg-slate-50 transition-colors shadow-sm"
            >
              Register League
            </button>
          </div>
        </nav>

        {/* Left Side (Light) */}
        <div className="w-full lg:w-[45%] bg-sofa-bg py-16 px-8 md:px-16 lg:px-24 flex flex-col justify-center border-r border-slate-200">
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2E5CFF]/30 bg-[#2E5CFF]/10 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span className="text-xs text-sofa-blue" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
                Tournament Intelligence Platform
              </span>
              {/* <span className="text-xs text-[#00D4FF] font-semibold">New →</span> */}
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.95] text-sofa-navy">
              One Platform <br/>
              For Leagues, <br/>
              <span className="text-sofa-blue">Tournaments</span> <br/>
              & Stats.
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 font-medium max-w-md leading-relaxed">
              StatArena helps modern sports organizers manage fixtures, track standings, automate brackets, and grow without juggling different tools.
            </p>

            {/* <div className="grid grid-cols-3 gap-6 pt-6">
              {[
                { val: '100% AUTOMATED', desc: 'Accept registrations online and reduce manual brackets.' },
                { val: '3X MORE ENGAGEMENT', desc: 'Sell tickets and merch from one place.' },
                { val: '5X LESS ADMIN', desc: 'Manage teams, reminders, and schedules easily.' }
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-0.5 w-full bg-sofa-blue opacity-50" />
                  <div className="text-[10px] font-black text-sofa-blue uppercase tracking-widest">{stat.val}</div>
                  <div className="text-[10px] text-slate-500 font-medium leading-relaxed">{stat.desc}</div>
                </div>
              ))}
            </div> */}

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <button 
                onClick={() => navigate('/register')} 
                className="w-full sm:w-auto bg-sofa-blue text-white px-8 py-4 rounded font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-sofa-blue/20"
              >
                Get Started →
              </button>
              <button className="w-full sm:w-auto bg-transparent border border-sofa-border text-sofa-navy px-8 py-4 rounded font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors">
                <a href="#features" className="text-xs font-bold uppercase tracking-widest text-sofa-navy hover:text-sofa-blue transition-colors">Features</a>
              </button>
            </div>

            {/* <div className="pt-16 flex justify-between items-end text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <div>
                TARGET SECTORS:<br/>
                LEAGUES / TOURNAMENTS / MODERN SPORTS / ESPORTS
              </div>
              <div className="text-right">
                STATUS:<br/>
                <span className="text-sofa-blue">SYSTEM READY</span> // OPERATIONAL
              </div>
            </div> */}
          </div>

        </div>

        {/* Right Side (Dashboard Mockup) */}
        <div className="w-full lg:w-[55%] bg-[#0A0F1A] relative overflow-hidden hidden lg:flex items-center justify-center">
           {/* Grid Background */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
           
           <div className="z-10 w-full px-12 scale-[0.85] xl:scale-100">
              <DashboardMockup />
           </div>
        </div>

      </section>

      {/* 2. Fragmented Features Grid */}
      <section id="features" className="py-32 px-6 max-w-6xl mx-auto bg-white">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-sofa-navy max-w-3xl mx-auto leading-tight">
            Running your tournament shouldn't feel fragmented.
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Most organizers today are forced to use one tool for fixtures, another for standings, WhatsApp for messages, spreadsheets for records. That creates stress, lost revenue, and a poor fan experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Layout,
              title: "Fixtures in one place, results somewhere else",
              desc: "The disjointed dance of managing multiple calendars and result tracking systems."
            },
            {
              icon: Clock,
              title: "Missed updates and manual brackets",
              desc: "Relying on human memory to advance teams through knockout stages costs time and trust."
            },
            {
              icon: FileText,
              title: "No team history or match notes",
              desc: "Starting from zero with every team interaction and registration."
            },
            {
              icon: Trophy,
              title: "Generic portals that don't reflect your brand",
              desc: "Sacrificing your unique identity to fit into rigid, uninspired league templates."
            },
            {
              icon: Target,
              title: "Hard-to-track registrations and deposits",
              desc: "Chasing payments instead of focusing on tournament delivery."
            },
            {
              icon: TrendingUp,
              title: "No clear view of growth or fan engagement",
              desc: "Operating blindly without actionable insights on league performance."
            }
          ].map((item, i) => (
            <div key={i} className="bg-[#F8FAFC] rounded-2xl p-8 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:8px_8px]" />
                <item.icon className="w-6 h-6 text-sofa-navy relative z-10 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-black text-sofa-navy mb-3 leading-snug">{item.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Dark CTA Section */}
      <section className="bg-[#F4F7FB] py-32 px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          
          <div className="bg-[#050B14] rounded-3xl border border-slate-800 shadow-[0_40px_100px_rgba(46,92,255,0.15)] relative overflow-hidden text-center py-24 px-6 sm:px-12">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-sofa-blue/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Trophy Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E5CFF] to-[#00D4FF] flex items-center justify-center shadow-[0_0_40px_rgba(46,92,255,0.4)] mb-8">
                <Trophy className="w-8 h-8 text-white" />
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
                Ready to run your best <br />
                <span className="text-[#00D4FF]">tournament</span> ever?
              </h2>

              {/* Subtext */}
              {/* <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto mb-10">
                Join 2,400+ leagues already using StatArena Pro. Free to start, no credit card required.
              </p> */}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                {/* <button 
                  onClick={() => navigate('/register')} 
                  className="bg-white text-slate-900 px-8 py-4 rounded-full font-black text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button> */}
                <button 
                  onClick={() => navigate('/register')} 
                  className="bg-[#0F172A] border border-slate-700 text-white px-8 py-4 rounded-full font-black text-sm flex items-center gap-2 hover:bg-[#1E293B] transition-colors w-full sm:w-auto justify-center"
                >
                  Create Free Account &rarr;
                </button>
              </div>

              {/* Bottom features */}
              {/* <div className="text-xs font-bold text-slate-500 flex items-center justify-center gap-3">
                <span>No credit card</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>Cancel anytime</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>GDPR compliant</span>
              </div> */}
            </div>
          </div>

        </div>
      </section>

      {/* Footer inside Landing */}
      <footer className="bg-white border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sofa-bg rounded-lg flex items-center justify-center p-1.5">
              <img src="/favicon.png" alt="Logo" className="w-full h-full object-contain grayscale opacity-50" />
            </div>
            <span className="font-black tracking-widest uppercase text-sm text-sofa-navy">StatArena Pro</span>
          </div>
          <div className="flex gap-6 text-xs font-bold tracking-widest uppercase text-slate-400">
            <a href="#" className="hover:text-sofa-navy transition-colors">Privacy</a>
            <a href="#" className="hover:text-sofa-navy transition-colors">Terms</a>
            <a href="#" className="hover:text-sofa-navy transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
