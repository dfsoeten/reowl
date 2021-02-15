export const getCastSvgFlag = (cast: string) => {
  let flag

  switch (cast) {
    case 'en-us':
      flag = require('~/assets/images/icons/flags/usa.svg')
      break
    case 'fr-fr':
      flag = require('~/assets/images/icons/flags/france.svg')
      break
    default:
      flag = require('~/assets/images/icons/flags/usa.svg')
  }

  return flag
}
