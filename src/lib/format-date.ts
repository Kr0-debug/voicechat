export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'teraz'
  if (diffMin < 60) return `${diffMin}m`
  if (diffHour < 24) return `${diff}h`
  if (diffDay < 7) return `${diffDay}d`

  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })
}
