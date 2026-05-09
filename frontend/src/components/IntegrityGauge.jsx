import { motion } from 'framer-motion'
import { ShieldAlert, CheckCircle, AlertTriangle, XCircle, FileWarning, ExternalLink } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function IntegrityGauge({ result, isScanning }) {
  if (isScanning) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-cyber-neon/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-cyber-neon rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-4 border-4 border-cyber-neon/40 rounded-full border-b-transparent animate-spin-reverse"></div>
          <span className="font-mono text-cyber-neon text-xl animate-pulse">ANALYZING</span>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center min-h-[400px]">
        <ShieldAlert className="w-16 h-16 text-cyber-neon/30 mb-4" />
        <p className="text-gray-500 font-mono text-center">Awaiting data input.<br/>Initiate scan to begin analysis.</p>
      </div>
    )
  }

  const { integrity_score, status, issues, fabricated_claims } = result
  
  let statusColor = 'text-cyber-success'
  let borderColor = 'border-cyber-success'
  let glowColor = 'shadow-[0_0_30px_rgba(0,255,102,0.4)]'
  let Icon = CheckCircle

  if (integrity_score < 60) {
    statusColor = 'text-cyber-alert'
    borderColor = 'border-cyber-alert'
    glowColor = 'shadow-[0_0_30px_rgba(255,0,60,0.4)]'
    Icon = XCircle
  } else if (integrity_score < 90) {
    statusColor = 'text-cyber-warning'
    borderColor = 'border-cyber-warning'
    glowColor = 'shadow-[0_0_30px_rgba(255,193,7,0.4)]'
    Icon = AlertTriangle
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card rounded-2xl p-6 border ${borderColor} ${glowColor}`}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-mono text-white uppercase flex items-center gap-2">
          <Icon className={`w-6 h-6 ${statusColor}`} /> Analysis Report
        </h2>
        {result.filename && (
          <a 
            href={`${API_URL}/uploads/${encodeURIComponent(result.filename)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-cyber-neon hover:text-white transition-colors flex items-center gap-1 border border-cyber-neon/30 px-2 py-1 rounded"
          >
            {result.filename} <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="flex flex-col items-center mb-10">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Dashboard Gauge SVG */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#12121a" strokeWidth="10" />
            <motion.circle 
              cx="50" cy="50" r="45" fill="none" 
              stroke="currentColor" 
              className={statusColor}
              strokeWidth="10" 
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * integrity_score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute text-center">
            <div className={`text-5xl font-mono font-bold ${statusColor}`}>{integrity_score}</div>
            <div className={`text-sm font-mono tracking-widest ${statusColor} mt-1 uppercase`}>{status}</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-mono text-gray-400 uppercase mb-3 flex items-center gap-2">
            <FileWarning className="w-4 h-4" /> Detected Anomalies
          </h3>
          <ul className="space-y-2">
            {issues.map((issue, idx) => (
              <li key={idx} className="bg-cyber-alert/10 border border-cyber-alert/30 text-cyber-alert p-3 rounded-lg font-mono text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>

        {fabricated_claims && fabricated_claims.length > 0 && (
          <div>
            <h3 className="text-sm font-mono text-gray-400 uppercase mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Fabricated Claims
            </h3>
            <ul className="space-y-2">
              {fabricated_claims.map((claim, idx) => (
                <li key={idx} className="bg-cyber-alert/20 border border-cyber-alert/50 text-white p-3 rounded-lg font-mono text-sm">
                  "{claim}"
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button className="w-full mt-8 py-3 rounded-xl border border-cyber-neon text-cyber-neon hover:bg-cyber-neon/10 transition-all font-mono uppercase text-sm">
        Download Forensic Report
      </button>
    </motion.div>
  )
}
