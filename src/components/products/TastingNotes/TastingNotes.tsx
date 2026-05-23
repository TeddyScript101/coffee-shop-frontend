import { cn } from '@/utils/cn'

interface TastingNotesProps {
  notes: string
  maxVisible?: number
  className?: string
}

export function TastingNotes({ notes, maxVisible, className }: TastingNotesProps) {
  const allNotes = notes.split(',').map((n) => n.trim()).filter(Boolean)
  const visible = maxVisible !== undefined ? allNotes.slice(0, maxVisible) : allNotes
  const hidden = maxVisible !== undefined ? allNotes.length - maxVisible : 0

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map((note) => (
        <span
          key={note}
          className="inline-block text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
        >
          {note}
        </span>
      ))}
      {hidden > 0 && (
        <span className="inline-block text-xs px-2 py-0.5 rounded-full text-[var(--color-text-subtle)]">
          +{hidden} more
        </span>
      )}
    </div>
  )
}
