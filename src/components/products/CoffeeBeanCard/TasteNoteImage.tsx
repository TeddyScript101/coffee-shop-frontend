import { cn } from '@/utils/cn'

interface TasteNoteImageProps {
  originCountry: string
  originRegion: string
  tastingNotes: string
  className?: string
}

// Helper to pick colors based on country
function getColorTheme(country: string) {
  const upperCountry = country.toUpperCase()
  if (upperCountry.includes('COLOMBIA')) return 'bg-amber-500 text-white'
  if (upperCountry.includes('COSTA RICA')) return 'bg-[#3F2B1E] text-white'
  if (upperCountry.includes('MEXICO') || upperCountry.includes('MEXICAN')) return 'bg-[#78C25B] text-white'
  if (upperCountry.includes('BRAZIL')) return 'bg-yellow-400 text-black'
  if (upperCountry.includes('ETHIOPIA')) return 'bg-rose-500 text-white'
  if (upperCountry.includes('KENYA')) return 'bg-red-700 text-white'
  if (upperCountry.includes('PANAMA')) return 'bg-sky-500 text-white'
  if (upperCountry.includes('INDONESIA')) return 'bg-emerald-700 text-white'
  if (upperCountry.includes('JAMAICA')) return 'bg-blue-600 text-white'
  if (upperCountry.includes('YEMEN')) return 'bg-orange-700 text-white'
  if (upperCountry.includes('BLEND')) return 'bg-zinc-900 text-white'
  
  // Default fallback
  return 'bg-[var(--color-primary)] text-white'
}

export function TasteNoteImage({ originCountry, originRegion, tastingNotes, className }: TasteNoteImageProps) {
  const colorTheme = getColorTheme(originCountry)

  // Split notes by comma for layout
  const notes = tastingNotes.split(',').map((n) => n.trim().toUpperCase())

  return (
    <div className={cn('w-full h-full flex flex-col bg-[#F9F9F9] shadow-inner font-sans', className)}>
      {/* Top Banner */}
      <div className={cn('flex flex-col items-center justify-center pt-6 pb-2 px-2', colorTheme)}>
        <h4 className="font-bold text-base tracking-widest uppercase leading-tight">
          {originCountry}
        </h4>
        <span className="text-xs tracking-wider opacity-90 text-center font-serif italic mt-0.5">
          {originRegion}
        </span>
      </div>

      {/* Middle Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 relative">
        <h5 className="text-[0.65rem] text-gray-500 tracking-[0.2em] mb-1.5 font-medium">
          TASTING NOTES
        </h5>
        
        <div className="flex flex-col items-center gap-0.5 mb-2.5 text-[#2E2E2E]">
          {notes.map((note, idx) => (
            <span key={idx} className="text-[0.85rem] font-bold tracking-wider text-center leading-snug">
              {note}
            </span>
          ))}
        </div>

        <div className="w-12 h-[1px] bg-gray-300 mb-2" />

        {/* Icons Row */}
        <div className="flex items-center justify-center gap-2.5 text-gray-600 mb-1.5">
          {/* Roaster Icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 8h16M4 16h16M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 8v8M15 8v8" />
          </svg>
          {/* Bag Icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2h12v2H6zM6 4l-2 16h16l-2-16M10 12h4" />
          </svg>
          {/* Grinder Icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2h8v4H8zM7 6h10v6H7zM6 12h12v10H6zM12 6v6M16 16v2" />
          </svg>
          {/* Cup Icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v4M10 2v4M14 2v4" />
          </svg>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[0.65rem] font-black tracking-widest text-[#2E2E2E]">
            BEANWORKS
          </span>
          <span className="text-[0.55rem] tracking-[0.2em] text-gray-500 mt-0.5">
            COFFEE ROASTERS
          </span>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className={cn('py-1.5 px-2 flex items-center justify-center', colorTheme)}>
        <span className="text-[0.7rem] tracking-wider font-medium opacity-95">
          www.beanworks.com
        </span>
      </div>
    </div>
  )
}
