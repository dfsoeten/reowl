import teams from '~/data/teams.json'
import { Team } from '~/types/team'

export class TeamService {
  /**
   * Get team data (logo, ...)
   * @param {string} teamSlug
   * @returns {Team}
   */
  public static getTeam(teamSlug: string): Team | null {
    const team: Team | undefined = teams.find((team) => team.slug === teamSlug)

    if (!team) {
      return null
    }

    let logo

    // Get the logo from assets
    try {
      logo = require(`~/assets/images/logos/teams/${team.slug}.svg`)
      // eslint-disable-next-line no-empty
    } catch (error) {}

    if (logo) {
      team.logo = logo
    }

    return team
  }
}
