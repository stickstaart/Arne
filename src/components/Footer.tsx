export default function Footer() {
  return (
    <footer className="border-t border-slate-100 py-12 px-6 font-sans">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center opacity-60 text-sm gap-4 md:gap-0">
        <p>Alle afbeeldingen zijn auteursrechtelijk beschermd © {new Date().getFullYear()} Arne van der Ree</p>
        <p className="flex items-center gap-1.5">
          <span>Gemaakt met Next.js & Passie door</span>
          <a
            href="https://stickstaart.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:opacity-100 transition-opacity"
          >
            StickStaart
          </a>
        </p>
      </div>
    </footer>
  )
}
