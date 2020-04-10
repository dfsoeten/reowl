import teams from '~/data/teams.json'
import { ITeam } from '~/types/team'

export class Team {
  /**
   * Get team data (logo, ...)
   * @param {string} teamSlug
   * @returns {ITeam}
   */
  public static getTeam(teamSlug: string): ITeam | null {
    const team: ITeam | undefined = teams.find((team) => team.slug === teamSlug)

    if (!team) {
      return null
    }

    let logo

    // Get the logo from assets
    try {
      logo = require(`~/assets/images/logos/teams/${team.slug}.svg`)
    } catch (error) {}

    if (logo) {
      team.logo = logo
    }

    return team
  }
}
