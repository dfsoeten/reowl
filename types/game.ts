import { ITeam } from '~/types/team'

export interface IGame {
  id: string
  publishedAt: Date
  cast: string
  team1: ITeam
  team2: ITeam
  video: {
    provider: string
    providerVideoId: string
  }
}

export interface IGroupedGames {
  today: IGame[]
  yesterday: IGame[]
  thisWeek: IGame[]
  thisMonth: IGame[]
  old: IGame[]
}
