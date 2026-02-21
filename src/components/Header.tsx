export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tighter">ARNE VAN DER REE</div>
        <div className="space-x-8 text-sm font-medium uppercase tracking-widest">
          <a href="#portfolio" className="hover:text-blue-600 transition">Portfolio</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </div>
      </nav>
    </header>
  )
}
