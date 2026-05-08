import { useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, FileText, Scan, Loader2 } from 'lucide-react'

export default function UploadZone({ onScan, isScanning }) {
  const [file, setFile] = useState(null)
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf') || droppedFile.name.toLowerCase().endsWith('.docx'))) {
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf') || selectedFile.name.toLowerCase().endsWith('.docx'))) {
      setFile(selectedFile)
    }
  }

  const triggerFilePicker = () => {
    document.getElementById('fileInput').click()
  }

  const handleScanClick = () => {
    if (onScan) {
      onScan(file, query, response)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <h2 className="text-xl font-mono text-cyber-neon mb-6 uppercase flex items-center gap-2">
        <FileText className="w-5 h-5" /> Data Ingestion
      </h2>
      
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        accept=".pdf,.docx"
        onChange={handleFileChange}
      />

      <div 
        className="border-2 border-dashed border-cyber-neon/30 rounded-xl p-8 mb-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyber-neon hover:bg-cyber-neon/5 transition-all"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={triggerFilePicker}
      >
        <UploadCloud className="w-12 h-12 text-cyber-neon/70 mb-4" />
        {file ? (
          <p className="text-white font-mono">{file.name}</p>
        ) : (
          <div>
            <p className="text-white font-mono mb-2">Click or Drag & Drop Document</p>
            <p className="text-sm text-gray-500">Supports PDF, DOCX</p>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-mono text-cyber-neon mb-2">Research Query</label>
          <textarea 
            className="w-full bg-[#0a0a0f] border border-cyber-neon/30 rounded-xl p-4 text-white focus:outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-all resize-none font-mono text-sm"
            rows="3"
            placeholder="Enter the research query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-mono text-cyber-neon mb-2">AI-Generated Response</label>
          <textarea 
            className="w-full bg-[#0a0a0f] border border-cyber-neon/30 rounded-xl p-4 text-white focus:outline-none focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-all resize-none font-mono text-sm"
            rows="4"
            placeholder="Paste the AI response to analyze..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          ></textarea>
        </div>
      </div>

      <button 
        onClick={handleScanClick}
        disabled={isScanning}
        className={`w-full py-4 rounded-xl font-mono uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${isScanning ? 'bg-cyber-neon/20 text-cyber-neon cursor-not-allowed' : 'bg-cyber-neon text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]'}`}
      >
        {isScanning ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Scanning Network...</>
        ) : (
          <><Scan className="w-5 h-5" /> Initiate Scan</>
        )}
      </button>
    </motion.div>
  )
}
