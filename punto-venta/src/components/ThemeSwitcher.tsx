'use client'
import { useEffect, useState } from 'react'

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', stored)
    setTheme(stored)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <button className="btn btn-sm btn-outline w-32" onClick={toggleTheme}>
      Tema: {theme === 'light' ? '🌞 Claro' : '🌙 Oscuro'}
    </button>
  )
}

export default ThemeSwitcher
