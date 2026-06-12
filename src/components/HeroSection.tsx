import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(46,92,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(46,92,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-3xl -z-0" style={{ background: "radial-gradient(ellipse, rgba(46,92,255,0.18) 0%, rgba(124,58,237,0.05) 50%, transparent 80%)" }} />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-16 w-64 h-64 rounded-full bg-[#2E5CFF]/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], scale: [1, 0.95, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-[#00D4FF]/8 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2E5CFF]/30 bg-[#2E5CFF]/10 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span className="text-xs text-[#A3B3D6]" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
                Tournament Intelligence Platform
              </span>
              <span className="text-xs text-[#2E5CFF] font-semibold">New →</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white mb-6"
            >
              Elevate Your League with{" "}
              <span
                className="relative inline-block"
                style={{
                  background: "linear-gradient(135deg, #2E5CFF 0%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Tournament
              </span>{" "}
              Intelligence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#A3B3D6] text-lg leading-relaxed mb-10 max-w-lg"
            >
              StatArena Pro automates bracket progression, live standings, and fixture management — so you spend less time on admin and more time building legendary competitions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(46,92,255,0.6)" }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#2E5CFF] to-[#4F78FF] text-white shadow-[0_0_25px_rgba(46,92,255,0.4)] transition-all duration-300"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}
              >
                Get Started for Free
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[rgba(46,92,255,0.3)] text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}
              >
                <div className="w-6 h-6 rounded-full bg-[#2E5CFF]/20 flex items-center justify-center">
                  <Play className="w-3 h-3 text-[#2E5CFF] ml-0.5" />
                </div>
                View Demo
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 flex gap-8"
            >
              {[
                { label: "Active Leagues", value: "2,400+" },
                { label: "Matches Tracked", value: "190K+" },
                { label: "Uptime SLA", value: "99.9%" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-white" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>
                    {stat.value}
                  </div>
                  <div className="text-[#6B80A8] text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[#6B80A8] text-xs">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-[rgba(46,92,255,0.3)] flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[#2E5CFF]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
