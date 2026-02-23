export default function Footer() {
  return (
    <footer className="border-t border-slate-100 py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center opacity-60 text-sm">
        <p>Alle afbeeldingen zijn auteursrechtelijk beschermd © {new Date().getFullYear()} Arne van der Ree</p>
        <p>Gemaakt met Next.js & Passie</p>
      </div>
    </footer>
  )
}
