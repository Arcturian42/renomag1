'use client'

import { useState, useEffect } from 'react'

const CONSENT_KEY = 'renomag_cookie_consent'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY)
      if (!consent) setShow(true)
    } catch {
      // localStorage unavailable
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, analytics: true, date: new Date().toISOString() }))
    } catch {}
    setShow(false)
  }

  const reject = () => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, analytics: false, date: new Date().toISOString() }))
    } catch {}
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-900 mb-1">🍪 Nous utilisons des cookies</p>
            <p>
              Ce site utilise des cookies essentiels et, avec votre consentement, des cookies d&apos;analyse.
              Vous pouvez accepter, refuser ou personnaliser vos choix à tout moment.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={reject}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Refuser
            </button>
            <button
              onClick={accept}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 rounded-lg transition-colors"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
