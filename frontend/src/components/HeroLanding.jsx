import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Shield, Atom, Scan, Zap, ArrowRight } from 'lucide-react'
import NeuralParticles from './NeuralParticles'

function StatChip({ label, value }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-mono text-white/90">{value}</span>
    </div>
  )
}

export default function HeroLanding({ onPrimaryCta }) {
  const chips = useMemo(
    () => [
      { label: 'SYSTEM', value: 'ONLINE' },
      { label: 'ENGINE', value: 'FORENSIC AI' },
      { label: 'LATENCY', value: '~120ms' },
    ],
    [],
  )

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-10">
      <NeuralParticles />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-24 w-96 h-96 rounded-full bg-cyber-neon/20 blur-3xl opacity-30" />
        <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-cyber-neon/15 blur-3xl opacity-30" />
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-3 rounded-2xl border border-cyber-neon/25 bg-white/5 px-4 py-2">
              <Shield className="w-4 h-4 text-cyber-neon" />
              <span className="text-xs font-mono text-cyber-neon uppercase tracking-widest">Neural Research Sentinel</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block text-white">Premium cyber-intelligence</span>
              <span className="block text-cyber-neon neon-text">for AI hallucination forensics</span>
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-white/70 leading-relaxed max-w-xl">
              Run real-time predictive analysis powered by OpenAI. Detect fabrication risk, validate sources,
              and visualize integrity telemetry like a NASA-grade monitoring console.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {chips.map((c) => (
                <motion.div key={c.label} whileHover={{ scale: 1.02 }}>
                  <StatChip label={c.label} value={c.value} />
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.99 }}
                whileHover={{ boxShadow: '0 0 26px rgba(0,240,255,0.35)' }}
                onClick={onPrimaryCta}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyber-neon px-5 py-3 font-mono text-sm text-black uppercase tracking-wider hover:bg-cyber-neon/90 transition-all"
              >
                <Scan className="w-4 h-4" />
                Start Forensic Scan
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.a
                href="#pricing"
                whileTap={{ scale: 0.99 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-mono text-sm text-white/90 uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                <Zap className="w-4 h-4 text-cyber-neon" />
                View Pricing
              </motion.a>
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Atom className="w-4 h-4 text-cyber-neon" />
                <span className="text-xs font-mono text-white/70">Hallucination telemetry</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Shield className="w-4 h-4 text-cyber-neon" />
                <span className="text-xs font-mono text-white/70">Source verification mesh</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Zap className="w-4 h-4 text-cyber-neon" />
                <span className="text-xs font-mono text-white/70">Integrity score synthesis</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="glass-card rounded-3xl p-6 border border-cyber-neon/25"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-cyber-neon uppercase tracking-widest">AI Research Scanning</div>
                  <div className="text-sm text-white/80 font-mono">Fabrication risk prediction</div>
                </div>
                <div className="px-3 py-2 rounded-xl border border-white/10 bg-white/5">
                  <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest">MODE</div>
                  <div className="text-xs font-mono text-white/90">HALUCINATE-SAFE</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-cyber-neon"
                    initial={{ width: 0 }}
                    animate={{ width: ['10%', '78%', '100%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Anomaly Score</div>
                    <div className="text-2xl font-mono text-cyber-neon neon-text">{72}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Hallucination Rate</div>
                    <div className="text-2xl font-mono">{8.4}%</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-mono text-white/70">Live signals</div>
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyber-neon shadow-[0_0_20px_rgba(0,240,255,0.4)]" />
                      <span className="text-[10px] font-mono text-cyber-neon uppercase tracking-widest">streaming</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Source embedding alignment',
                      'Citation authenticity checks',
                      'Semantic drift cross-examination',
                    ].map((t, i) => (
                      <motion.div
                        key={t}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className="flex items-center justify-between text-[11px] font-mono"
                      >
                        <span className="text-white/70">{t}</span>
                        <span className="text-cyber-neon">{i === 0 ? 'locked' : i === 1 ? 'verifying' : 'armed'}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '⟡', title: 'Forensic Engine', desc: 'Integrity score synthesis + anomaly tracing.' },
          { icon: '⌁', title: 'Neural Cross-Examination', desc: 'Semantic drift + hallucination probability signals.' },
          { icon: '⧉', title: 'Verification Mesh', desc: 'External source stability + citation checks.' },
        ].map((f, idx) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-cyber-neon/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-cyber-neon/25 bg-cyber-neon/10 flex items-center justify-center text-cyber-neon">{f.icon}</div>
              <div className="space-y-1">
                <div className="text-sm font-mono text-white/90">{f.title}</div>
                <div className="text-xs font-mono text-white/60 leading-relaxed">{f.desc}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

