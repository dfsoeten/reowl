import { NuxtAxiosInstance } from '@nuxtjs/axios'
import settings from '~/settings.json'
import { Match } from '~/types/match'
import { Team } from '~/types/team'
import { TeamService } from '~/services/team'

export class MatchService {
  /**
   * Get the latest matches
   * @param {number=} limit
   * @param {Object[]=} exclude
   * @returns {Promise<Match[]>}
   */
  public static async getLatestMatches(
    axios: NuxtAxiosInstance,
    limit?: number,
    exclude?: Match[]
  ): Promise<Match[]> {
    let response

    try {
      response = await axios.get(`${settings.apiUrl}/api/matches`, {
        params: {
          limit,
          exclude: exclude?.map((match) => match.id).join(',')
        }
      })
    } catch (error) {
      throw new Error(error)
    }

    if (!response || response.status !== 200) {
      return []
    }

    return response.data.reduce((matches: Match[], matchFromApi: any) => {
      const match: Match | null = this.convertToMatch(matchFromApi)

      if (match) {
        matches.push(match)
      }

      return matches
    }, [])
  }

  /**
   * Get a match
   * @returns Promise<Match | null>
   */
  public static async getMatch(
    axios: NuxtAxiosInstance,
    id: string
  ): Promise<Match | null> {
    let response

    try {
      response = await axios.get(`${settings.apiUrl}/api/match/${id}`)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    if (!response || response.status !== 200) {
      return null
    }

    return this.convertToMatch(response.data)
  }

  /**
   * Transform a match got by the API to a match object (interface)
   * @param {any} matchFromApi
   * @returns {Match}
   */
  private static convertToMatch(matchFromApi: any): Match | null {
    let match: Match | null = null

    if (Object.keys(matchFromApi).length === 0) {
      return null
    }

    const team1: Team | null = TeamService.getTeam(matchFromApi.team1)
    const team2: Team | null = TeamService.getTeam(matchFromApi.team2)

    if (team1 && team2) {
      match = {
        id: matchFromApi.id,
        publishedAt: new Date(matchFromApi.date),
        team1,
        team2
      }

      if (matchFromApi.youtubeVideosByCast) {
        match.youtubeVideosByCast = matchFromApi.youtubeVideosByCast
      }
    }

    return match
  }
}
