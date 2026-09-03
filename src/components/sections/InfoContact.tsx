"use client"

import { useState, useEffect } from 'react'

export default function InfoContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Automatische timer voor het uitfaden van de succesmelding
  useEffect(() => {
    let fadeTimer: NodeJS.Timeout
    let resetTimer: NodeJS.Timeout

    if (status === 'success') {
      setIsFadingOut(false)

      // Start fade-out effect na 7 seconden
      fadeTimer = setTimeout(() => {
        setIsFadingOut(true)
      }, 7000)

      // Zet status weer op 'idle' na 8 seconden (wanneer fade-out klaar is)
      resetTimer = setTimeout(() => {
        setStatus('idle')
        setIsFadingOut(false)
      }, 8000)
    }

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(resetTimer)
    }
  }, [status])

  const handleResetForm = () => {
    setStatus('idle')
    setIsFadingOut(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          to: 'arne@doodle.nl',
        }),
      })

      if (!res.ok) {
        throw new Error('Er is iets misgegaan bij het verzenden van het formulier.')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setErrorMessage(err.message || 'Verzenden mislukt. Probeer het later opnieuw.')
    }
  }

  return (
    <section id="infocontact" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* LINKERKOLOM: Logo Doodle & Infotekst */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex flex-col border-b border-stone-200/80 pb-4 inline-block">
            <h2 className="text-3xl font-sans uppercase tracking-[0.3em] text-stone-900 leading-none">
              Doodle.nl
            </h2>
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mt-2 font-sans font-medium">
              Arne van der Ree
            </span>
          </div>

          <div className="space-y-4 text-stone-700 text-base md:text-lg leading-relaxed font-sans">
            <p>
              <strong className="text-stone-900 font-semibold">Doodle.nl</strong> is de éénkoppige illustratiestudio van Arne van der Ree. Met meer dan 30 jaar professionele ervaring in commerciële illustratie en educatief design zijn uw opdrachten in goede handen.
            </p>
            <p>
              Stuur gerust uw vragen over de mogelijkheden via nevenstaand formulier.
            </p>
          </div>
        </div>

        {/* RECHTERKOLOM: Contactformulier */}
        <div className="lg:col-span-7 bg-[#F9F7F2]/60 border border-stone-200/80 rounded-2xl p-6 md:p-10 shadow-sm">
          <h3 className="text-xl font-sans uppercase text-stone-900 mb-8 border-b border-stone-200 pb-3">
            Bericht sturen
          </h3>

          {status === 'success' ? (
            <div
              className={`p-6 bg-emerald-50/90 border border-emerald-200 text-emerald-900 rounded-xl space-y-4 font-sans transition-opacity duration-1000 ease-in-out ${
                isFadingOut ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed">
                Bedankt voor uw bericht! We hebben de e-mail goed ontvangen en nemen zo snel mogelijk contact met u op via <strong className="font-semibold">arne@doodle.nl</strong>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium uppercase tracking-widest rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Nog een bericht sturen
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              {/* Naam */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium uppercase tracking-widest text-stone-600 mb-2">
                  Volledige naam <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="bijv. Jan Jansen"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 transition-all text-sm"
                />
              </div>

              {/* Grid voor Email en Telefoon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-widest text-stone-600 mb-2">
                    E-mailadres <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="naam@voorbeeld.nl"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 transition-all text-sm"
                  />
                </div>

                {/* Telefoonnummer (Optioneel) */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-widest text-stone-600 mb-2">
                    Telefoonnummer <span className="text-stone-400 text-[10px] lowercase font-normal">(optioneel)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="06 12345678"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Bericht */}
              <div>
                <label htmlFor="message" className="block text-xs font-medium uppercase tracking-widest text-stone-600 mb-2">
                  Bericht <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Waar kan Arne u mee helpen?"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-800 focus:border-stone-800 transition-all resize-y text-sm"
                />
              </div>

              {/* Foutmelding */}
              {status === 'error' && (
                <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-200">
                  {errorMessage}
                </p>
              )}

              {/* Submit Knop */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-medium uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    VERZENDEN...
                  </>
                ) : (
                  'VERSTUUR BERICHT'
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
