import { IGame, IGroupedGames } from '~/types/game'

/**
 * Group games by date range (today, yesterday, this week, ...)
 * @param {IGame[]} games
 */
export const groupGames = (games: IGame[]): IGroupedGames => {
  const groupedGames: IGroupedGames = {
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

  games.forEach((game) => {
    if (game.date >= today) {
      groupedGames.today.push(game)
    } else if (game.date >= yesterday) {
      groupedGames.yesterday.push(game)
    } else if (game.date >= oneWeekAgo) {
      groupedGames.thisWeek.push(game)
    } else if (game.date >= oneMonthAgo) {
      groupedGames.thisMonth.push(game)
    } else {
      groupedGames.old.push(game)
    }
  })

  return groupedGames
}
