import Container from '../layout/Container'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Arne van der Ree <br />
            <span className="text-slate-400 italic">tekent</span> de essentie.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
            Van snelle zakelijke visualisaties tot diepgaand vrij werk.
            Een portfolio gebouwd op 20 jaar vakmanschap.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button className="h-14 px-8 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-all active:scale-95">
              Bekijk Portfolio
            </button>
            <button className="h-14 px-8 border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-all active:scale-95">
              Contact
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
