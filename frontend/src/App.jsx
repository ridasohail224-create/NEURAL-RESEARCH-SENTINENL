import { useState } from 'react'
import { Shield, Activity, Sparkles } from 'lucide-react'
import UploadZone from './components/UploadZone'
import IntegrityGauge from './components/IntegrityGauge'
import RecentScans from './components/RecentScans'
import PremiumFeatures from './components/PremiumFeatures'
import HeroLanding from './components/HeroLanding'
import ThemeToggle from './components/ThemeToggle'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanCount, setScanCount] = useState(0)

  const handlePrimaryCta = () => {
    const el = document.getElementById('dashboard')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleScan = async (file, query, responseText) => {
    if (!file) {
      alert('Please upload a document first.')
      return
    }

    setIsScanning(true)
    try {
      // 1) Upload File
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

      // 2) Analyze Content
      const analyzeRes = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename,
          query,
          response: responseText,
        }),
      })

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json()
        throw new Error(err.detail || 'Analysis failed')
      }

      const result = await analyzeRes.json()
      setAnalysisResult(result)
      setScanCount((prev) => prev + 1)
    } catch (error) {
      console.error('Scan failed:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      alert(`Scanning failed: ${errorMessage}\n\nPlease check the Backend window for details.`)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen p-6 sm:p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyber-neon rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyber-neon rounded-full mix-blend-screen filter blur-[150px] opacity-10" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyber-neon/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-cyber-neon/5 rounded-full" />
      </div>

      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 glass-card p-4 rounded-2xl">
          <Shield className="text-cyber-neon w-10 h-10" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-widest font-mono neon-text uppercase">Neural Research Sentinel</h1>
            <p className="text-cyber-neon/70 text-xs sm:text-sm tracking-widest font-mono uppercase">Advanced AI Hallucination & Fabrication Detection</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 glass-card p-4 rounded-2xl">
            <Activity className="text-cyber-neon animate-pulse w-5 h-5" />
            <span className="text-sm font-mono text-cyber-neon">SYSTEM ONLINE</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <HeroLanding onPrimaryCta={handlePrimaryCta} />

      <main id="dashboard" className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="col-span-1 lg:col-span-7 space-y-8">
          <UploadZone onScan={handleScan} isScanning={isScanning} />
        </div>

        <div className="col-span-1 lg:col-span-5 space-y-8">
          <IntegrityGauge result={analysisResult} isScanning={isScanning} />
          <PremiumFeatures result={analysisResult} />
        </div>
      </main>

      <footer className="mt-8">
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyber-neon" />
            <div>
              <div className="font-mono text-xs text-white/80 uppercase tracking-widest">Telemetry</div>
              <div className="font-mono text-sm text-white/70">Integrity dashboards updated in real time.</div>
            </div>
          </div>
          <div className="font-mono text-xs text-white/60">Neural Research Sentinel © {new Date().getFullYear()}</div>
        </div>
        <RecentScans key={scanCount} />
      </footer>
    </div>
  )
}

export default App

