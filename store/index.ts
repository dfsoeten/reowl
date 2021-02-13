import { GetterTree, MutationTree } from 'vuex'
import { Match } from '~/types/match'

export const state = () => ({
  latestMatches: [] as Match[],
  latestMatchesUpdateDate: null as Date | null
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  latestMatches: (state) => state.latestMatches
}

export const mutations: MutationTree<RootState> = {
  CHANGE_LATEST_MATCHES: (state, newLatestMatches) => {
    state.latestMatches = newLatestMatches
    state.latestMatchesUpdateDate = new Date()
  },
  // If the user does not reload the page after 5 minutes,
  // a new API call will be done to update the latest matches
  CHECK_IF_LATEST_MATCH_UPDATE_IS_REQUIRED: (state) => {
    if (state.latestMatchesUpdateDate) {
      const timeSinceLatestUpdate = Math.round(
        (new Date().getTime() - state.latestMatchesUpdateDate.getTime()) / 1000
      )

      if (timeSinceLatestUpdate > 300) {
        state.latestMatches = []
        state.latestMatchesUpdateDate = null
      }
    }
  }
}
