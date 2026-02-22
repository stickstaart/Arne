import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  style: ['italic', 'normal']
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  metadataBase: new URL('https://vercel.com/stickstaartdev/arne'), // Replace with your actual domain
  title: {
    default: "Arne van der Ree | Illustrator & Visualizer",
    template: "%s | Arne van der Ree"
  },
  description: "Portfolio van Arne van der Ree. Gespecialiseerd in zakelijke illustraties (Doodle.nl) en vrij artistiek werk (Wildkunst.nl).",
  openGraph: {
    images: ['/og-image.jpg'], // Belangrijk voor delen op LinkedIn/Insta
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
    <body className="bg-white text-slate-900 antialiased font-sans">
    <Header />
    <main>{children}</main>
    <Footer />
    </body>
    </html>
  )
}
