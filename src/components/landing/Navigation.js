'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#membership', label: 'Membership' },
    { href: '#benefits', label: 'Benefits' },
    { href: '#directory', label: 'Directory' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-14 w-14 relative transition-transform group-hover:scale-105">
              <Image
                src="/One-Voice-Final-LOGO.png"
                alt="OVWTN Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                One Voice
              </h1>
              <p className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
                Women Trade Network
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all hover:bg-gray-100"
              style={{ color: 'var(--text-primary)' }}
            >
              Member Login
            </Link>
            <Link
              href="/apply"
              className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Apply for Membership
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'var(--text-primary)' }}
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <Link
                  href="/login"
                  className="block w-full px-4 py-2.5 text-sm font-medium text-center rounded-lg border transition-colors hover:bg-gray-50"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                >
                  Member Login
                </Link>
                <Link
                  href="/apply"
                  className="block w-full px-4 py-2.5 text-sm font-medium text-center text-white rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  Apply for Membership
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
