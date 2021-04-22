import { Team } from '~/types/team'
import { YoutubeVideo } from '~/types/youtube-video'

export interface Match {
  id: string
  publishedAt: Date
  team1: Team
  team2: Team
  youtubeVideosByCast?: YoutubeVideo[]
}

export interface GroupedMatches {
  today: Match[]
  yesterday: Match[]
  thisWeek: Match[]
  thisMonth: Match[]
  old: Match[]
}
