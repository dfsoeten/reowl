import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Store } from 'vuex'
import settings from '~/settings.json'
import { Match } from '~/types/match'
import { Team } from '~/types/team'
import { TeamService } from '~/services/team'

export class MatchService {
  /**
   * Get the latest matches
   * @param {number=} limit
   * @param {string[]=} matchIdsToExclude
   * @returns {Promise<Match[] | null>}
   */
  public static async getLatestMatches(
    axios: NuxtAxiosInstance,
    store: Store<any>,
    limit?: number,
    matchIdsToExclude?: string[]
  ): Promise<Match[] | null> {
    let latestMatches: Match[]

    store.commit('CHECK_IF_LATEST_MATCH_UPDATE_IS_REQUIRED')

    // Get the latest matches from the store
    // to prevent too much call to the API
    if (store.getters.latestMatches.length > 0) {
      latestMatches = store.getters.latestMatches
    }
    // Else, call the API
    else {
      let response

      try {
        response = await axios.get(`${settings.apiUrl}/api/matches`)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }

      if (!response || response.status !== 200) {
        return null
      }

      latestMatches = response.data.reduce(
        (matches: Match[], matchFromApi: any) => {
          const match: Match | null = this.convertToMatch(matchFromApi)

          // Get only FR cast matches for now
          if (match && match.cast === 'fr_FR') {
            matches.push(match)
          }

          return matches
        },
        []
      )

      store.commit('CHANGE_LATEST_MATCHES', latestMatches)
    }

    // Matches to exclude
    if (matchIdsToExclude) {
      latestMatches = latestMatches.filter(
        (match) => !matchIdsToExclude.some((matchId) => matchId === match.id)
      )
    }

    // Limit
    if (limit) {
      latestMatches = latestMatches.splice(0, limit)
    }

    return latestMatches
  }

  /**
   * Get a match
   * @returns Promise<Match | null>
   */
  public static async getMatch(
    axios: NuxtAxiosInstance,
    store: Store<any>,
    matchId: string
  ): Promise<Match | null> {
    const latestMatches = await this.getLatestMatches(axios, store)

    if (!latestMatches) {
      return null
    }

    return (
      latestMatches.find((match) => match.id.toString() === matchId) || null
    )
  }

  /**
   * Transform a match got by the API to a match object (interface)
   * @param {any} matchFromApi
   * @returns {Match}
   */
  private static convertToMatch(matchFromApi: any): Match | null {
    let match: Match | null = null

    const team1: Team | null = TeamService.getTeam(matchFromApi.team1)
    const team2: Team | null = TeamService.getTeam(matchFromApi.team2)

    if (team1 && team2) {
      match = {
        id: matchFromApi.id,
        publishedAt: new Date(matchFromApi.publishedAt),
        cast: matchFromApi.cast,
        team1,
        team2,
        video: {
          provider: matchFromApi.video.provider,
          providerVideoId: matchFromApi.video.providerVideoId
        }
      }
    }

    return match
  }
}
