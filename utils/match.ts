import { Match, GroupedMatches } from '~/types/match'

/**
 * Group matches by date range (today, yesterday, this week, ...)
 * @param {Match[]} matches
 */
export const groupMatches = (matches: Match[]): GroupedMatches => {
  const groupedMatches: GroupedMatches = {
    today: [],
    yesterday: [],
    thisWeek: [],
    thisMonth: [],
    old: []
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
  yesterday.setHours(0, 0, 0, 0)

  const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7))
  oneWeekAgo.setHours(0, 0, 0, 0)

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  oneMonthAgo.setHours(0, 0, 0, 0)

  matches.forEach((match) => {
    if (match.publishedAt >= today) {
      groupedMatches.today.push(match)
    } else if (match.publishedAt >= yesterday) {
      groupedMatches.yesterday.push(match)
    } else if (match.publishedAt >= oneWeekAgo) {
      groupedMatches.thisWeek.push(match)
    } else if (match.publishedAt >= oneMonthAgo) {
      groupedMatches.thisMonth.push(match)
    } else {
      groupedMatches.old.push(match)
    }
  })

  return groupedMatches
}
