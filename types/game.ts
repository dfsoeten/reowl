import { ITeam } from '~/types/team'

export interface IGame {
  id: string
  date: Date
  team1: ITeam
  team2: ITeam
  video: {
    id: string
    source: string
  }
}

export interface IGroupedGames {
  today: IGame[]
  yesterday: IGame[]
  thisWeek: IGame[]
  thisMonth: IGame[]
  old: IGame[]
}
