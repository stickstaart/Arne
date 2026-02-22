export default function Container({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`mx-auto max-w-7xl px-5 sm:px-8 md:px-12 ${className}`}>
      {children}
    </div>
  )
}
