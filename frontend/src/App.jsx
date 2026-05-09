import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, UploadCloud, Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import UploadZone from './components/UploadZone'
import IntegrityGauge from './components/IntegrityGauge'
import RecentScans from './components/RecentScans'
import PremiumFeatures from './components/PremiumFeatures'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanCount, setScanCount] = useState(0)

  const handleScan = async (file, query, responseText) => {
    if (!file) {
      alert("Please upload a document first.")
      return
    }
    
    setIsScanning(true)
    try {
      // 1. Upload File
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.detail || 'Upload failed')
      }
      const { filename } = await uploadRes.json()
      
      // 2. Analyze Content
      const analyzeRes = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          query,
          response: responseText
        }),
      })
      
      if (!analyzeRes.ok) {
        const err = await analyzeRes.json()
        throw new Error(err.detail || 'Analysis failed')
      }
      const result = await analyzeRes.json()
      
      setAnalysisResult(result)
      setScanCount(prev => prev + 1)
    } catch (error) {
      console.error("Scan failed:", error)
      const errorMessage = error.message || "Unknown error occurred"
      alert(`Scanning failed: ${errorMessage}\n\nPlease check the Backend window for details.`)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyber-neon rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyber-neon rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyber-neon/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-cyber-neon/5 rounded-full"></div>
      </div>

      <header className="mb-8 flex items-center justify-between glass-card p-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <Shield className="text-cyber-neon w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-widest font-mono neon-text uppercase">Neural Research Sentinel</h1>
            <p className="text-cyber-neon/70 text-sm tracking-widest font-mono uppercase">Advanced AI Hallucination & Fabrication Detection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="text-cyber-neon animate-pulse w-5 h-5" />
          <span className="text-sm font-mono text-cyber-neon">SYSTEM ONLINE</span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="col-span-1 lg:col-span-7 space-y-8">
          <UploadZone onScan={handleScan} isScanning={isScanning} />
        </div>
        
        <div className="col-span-1 lg:col-span-5 space-y-8">
          <IntegrityGauge result={analysisResult} isScanning={isScanning} />
          <PremiumFeatures result={analysisResult} />
        </div>
      </main>

      <footer className="mt-8">
        <RecentScans key={scanCount} />
      </footer>
    </div>
  )
}

export default App
