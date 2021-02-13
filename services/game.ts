import { NuxtAxiosInstance } from '@nuxtjs/axios'
import settings from '~/settings.json'
import { IGame } from '~/types/game'
import { ITeam } from '~/types/team'
import { Team } from '~/services/team'

export class Game {
  /**
   * Get the latest games
   * @param {number=} limit
   * @param {string[]=} gameIdsToExclude
   * @returns {Promise<IGame[] | null>}
   */
  public static async getLatestGames(
    axios: NuxtAxiosInstance,
    limit?: number,
    gameIdsToExclude?: string[]
  ): Promise<IGame[] | null> {
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

    const latestGames: IGame[] = response.data.reduce(
      (games: IGame[], gameFromApi: any) => {
        if (
          !gameIdsToExclude ||
          !gameIdsToExclude.some((gameId: string) => gameId === gameFromApi.id)
        ) {
          const game: IGame | null = this.convertToGame(gameFromApi)

          // Get only FR cast games for now
          if (game && game.cast === 'fr_FR') {
            games.push(game)
          }
        }

        return games
      },
      []
    )

    return limit ? latestGames.splice(0, limit) : latestGames
  }

  /**
   * Get a game
   * @returns Promise<IGame | null>
   */
  public static async getGame(
    axios: NuxtAxiosInstance,
    gameId: string
  ): Promise<IGame | null> {
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

    const gameFromApi = response.data.find(
      (game: any) => game.id.toString() === gameId
    )

    if (!gameFromApi || gameFromApi.length === 0) {
      return null
    }

    const game: IGame | null = this.convertToGame(gameFromApi)

    return game
  }

  /**
   * Transform a game got by the API to a game object (interface)
   * @param {any} gameFromApi
   * @returns {IGame}
   */
  private static convertToGame(gameFromApi: any): IGame | null {
    let game: IGame | null = null

    const team1: ITeam | null = Team.getTeam(gameFromApi.team1)
    const team2: ITeam | null = Team.getTeam(gameFromApi.team2)

    if (team1 && team2) {
      game = {
        id: gameFromApi.id,
        publishedAt: new Date(gameFromApi.publishedAt),
        cast: gameFromApi.cast,
        team1,
        team2,
        video: {
          provider: gameFromApi.video.provider,
          providerVideoId: gameFromApi.video.providerVideoId
        }
      }
    }

    return game
  }
}
