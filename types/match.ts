import { Team } from '~/types/team'

export interface Match {
  id: string
  publishedAt: Date
  cast: string
  team1: Team
  team2: Team
  youtubeVideoId?: string
}

export interface GroupedMatches {
  today: Match[]
  yesterday: Match[]
  thisWeek: Match[]
  thisMonth: Match[]
  old: Match[]
}
