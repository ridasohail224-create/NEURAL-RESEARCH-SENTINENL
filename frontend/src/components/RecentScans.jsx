import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, ExternalLink, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react'

export default function RecentScans() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/recent-scans')
      .then(res => res.json())
      .then(data => {
        setScans(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch scans:", err)
        setLoading(false)
      })
  }, [])

  const handleOpenDoc = (filename) => {
    // Open the PDF from the backend static uploads folder
    window.open(`http://localhost:8000/uploads/${filename}`, '_blank')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-mono text-white uppercase flex items-center gap-2">
          <Database className="w-5 h-5 text-cyber-neon" /> Scan History
        </h2>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-cyber-neon" />}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cyber-neon/20">
              <th className="py-3 px-4 text-cyber-neon font-mono text-sm font-normal uppercase">Timestamp</th>
              <th className="py-3 px-4 text-cyber-neon font-mono text-sm font-normal uppercase">Document</th>
              <th className="py-3 px-4 text-cyber-neon font-mono text-sm font-normal uppercase">Score</th>
              <th className="py-3 px-4 text-cyber-neon font-mono text-sm font-normal uppercase">Status</th>
              <th className="py-3 px-4 text-cyber-neon font-mono text-sm font-normal uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-mono text-sm text-gray-400 whitespace-nowrap">{scan.timestamp}</td>
                <td className="py-4 px-4 font-mono text-sm text-gray-200">
                  <a 
                    href={`http://localhost:8000/uploads/${encodeURIComponent(scan.filename)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyber-neon transition-colors"
                  >
                    {scan.filename}
                  </a>
                </td>
                <td className="py-4 px-4 font-mono text-sm">
                  <span className={`px-2 py-1 rounded bg-[#0a0a0f] border ${scan.score >= 90 ? 'border-cyber-success text-cyber-success' : scan.score >= 60 ? 'border-cyber-warning text-cyber-warning' : 'border-cyber-alert text-cyber-alert'}`}>
                    {scan.score}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className={`flex items-center gap-2 font-mono text-sm ${scan.status === 'VERIFIED' ? 'text-cyber-success' : scan.status === 'SUSPICIOUS' ? 'text-cyber-warning' : 'text-cyber-alert'}`}>
                    {scan.status === 'VERIFIED' && <CheckCircle className="w-4 h-4" />}
                    {scan.status === 'SUSPICIOUS' && <AlertTriangle className="w-4 h-4" />}
                    {scan.status === 'FABRICATED' && <XCircle className="w-4 h-4" />}
                    {scan.status}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <a 
                    href={`http://localhost:8000/uploads/${encodeURIComponent(scan.filename)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyber-neon hover:text-white transition-colors inline-block"
                  >
                    <ExternalLink className="w-5 h-5 ml-auto" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {scans.length === 0 && !loading && (
          <p className="text-center py-8 text-gray-500 font-mono italic">No recent scans found.</p>
        )}
      </div>
    </motion.div>
  )
}
