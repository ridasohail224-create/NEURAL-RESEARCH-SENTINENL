import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Sparkles } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem('nrs_theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    window.localStorage.setItem('nrs_theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.98 }}
      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono uppercase tracking-wider text-white/90 hover:bg-white/10 transition-all"
      aria-label="Toggle theme"
    >
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-lg bg-cyber-neon/15 border border-cyber-neon/25 group-hover:border-cyber-neon/60">
        {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-cyber-neon" /> : <Sun className="w-3.5 h-3.5 text-cyber-neon" />}
      </span>
      <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
      <Sparkles className="w-3.5 h-3.5 text-cyber-neon opacity-80" />
    </motion.button>
  )
}

