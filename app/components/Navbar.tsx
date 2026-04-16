'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scissors, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const path = usePathname()

  const links = [
    { label: 'Home',      href: '/' },
    { label: 'About',     href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact',   href: '/portfolio#contact' },
  ]

  return (
    <header>
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/[0.05]"
        style={{ background: 'var(--nav-bg)' }}
      >
        <div className="flex justify-between items-center px-8 md:px-14 py-4 max-w-7xl mx-auto">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors"
              style={{ borderColor: 'var(--color-accent)' }}
            >
              <Scissors size={11} style={{ color: 'var(--color-accent)' }} />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase">Kris Professional Cuts</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors"
                style={{ color: path === l.href ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = path === l.href ? 'var(--color-accent)' : 'var(--color-text-muted)')}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Book Now + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/portfolio#contact"
              className="hidden md:block text-white text-xs font-bold px-5 py-2.5 rounded-full tracking-widest uppercase transition"
              style={{ background: 'var(--color-accent)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent)')}
            >
              Book Now
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="menu"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col px-8 pb-6 gap-4 border-t border-white/[0.05]">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-1 text-sm transition"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/portfolio#contact"
              onClick={() => setMenuOpen(false)}
              className="text-white text-xs font-bold px-5 py-2.5 rounded-full tracking-widest uppercase w-fit mt-1"
              style={{ background: 'var(--color-accent)' }}
            >
              Book Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
