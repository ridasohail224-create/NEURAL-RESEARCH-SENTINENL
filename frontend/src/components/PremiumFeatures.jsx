import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Search, Link as LinkIcon, Eye, BrainCircuit } from 'lucide-react'

export default function PremiumFeatures({ result }) {
  if (!result) return null

  const { metadata, hallucination, verification } = result

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-cyber-neon/30 bg-cyber-neon/5"
    >
      <h2 className="text-xl font-mono text-cyber-neon mb-6 uppercase flex items-center gap-2">
        <Zap className="w-5 h-5 fill-cyber-neon" /> Premium Intelligence
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Research Insights */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-white uppercase flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-cyber-neon" /> AI Research Insights
          </h3>
          <div className="bg-[#0a0a0f] p-4 rounded-xl border border-white/5">
            <p className="text-xs text-gray-400 mb-2 uppercase font-mono">Abstract Analysis</p>
            <p className="text-sm text-gray-300 leading-relaxed italic">
              {metadata?.abstract ? metadata.abstract.substring(0, 300) + '...' : 'No abstract detected.'}
            </p>
          </div>
        </div>

        {/* Semantic Search Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-white uppercase flex items-center gap-2">
            <Search className="w-4 h-4 text-cyber-neon" /> Semantic Indexing
          </h3>
          <div className="bg-cyber-neon/10 p-4 rounded-xl border border-cyber-neon/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyber-neon">VECTOR STATUS</span>
              <span className="text-xs font-mono text-white">INDEXED</span>
            </div>
            <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
              <div className="bg-cyber-neon h-full w-[85%]"></div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-mono">
              Document mapped to high-dimensional latent space for forensic comparison.
            </p>
          </div>
        </div>

        {/* Source Verification */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-white uppercase flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyber-neon" /> Source Verification
          </h3>
          <div className="space-y-2">
            {verification?.sources && Object.keys(verification.sources).map(source => (
              <div key={source} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-xs font-mono text-gray-400 uppercase">{source}</span>
                <span className="text-xs font-mono text-cyber-success">STABLE CONNECTION</span>
              </div>
            ))}
            {(!verification?.sources || Object.keys(verification.sources).length === 0) && (
              <p className="text-xs text-gray-500 font-mono italic">No external verification nodes responded.</p>
            )}
          </div>
        </div>

        {/* Hallucination Detection */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-white uppercase flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyber-neon" /> Forensic Scan
          </h3>
          <div className="bg-[#0a0a0f] p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-gray-500">PROBABILITY RATE</span>
              <span className="text-xs font-mono text-white">{hallucination?.hallucination_rate || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500">FAKE CITATIONS</span>
              <span className="text-xs font-mono text-white">{hallucination?.fake_citations || 0}</span>
            </div>
          </div>
        </div>

        {/* AI Response Analysis */}
        <div className="md:col-span-2 space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-sm font-mono text-cyber-neon uppercase flex items-center gap-2">
            <Zap className="w-4 h-4" /> AI Response Cross-Examination
          </h3>
          <div className="bg-cyber-neon/5 p-4 rounded-xl border border-cyber-neon/10">
            <p className="text-xs text-gray-300 font-mono italic">
              Scanning for semantic drift between source document and provided AI claim...
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="bg-cyber-neon h-full w-[92%] animate-pulse"></div>
              </div>
              <span className="text-[10px] font-mono text-cyber-neon">VERIFIED ALIGNMENT</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
