export const getLocaleSvgFlag = (localeSlug: string) => {
  let flag

  switch (localeSlug) {
    case 'en':
      flag = require('~/assets/images/icons/flags/usa.svg')
      break
    case 'fr':
      flag = require('~/assets/images/icons/flags/france.svg')
      break
    default:
      flag = require('~/assets/images/icons/flags/usa.svg')
  }

  return flag
}

export const getCastSvgFlag = (cast: string) => {
  let flag

  switch (cast) {
    case 'en-us':
      flag = getLocaleSvgFlag('en')
      break
    case 'fr-fr':
      flag = getLocaleSvgFlag('fr')
      break
    default:
      flag = getLocaleSvgFlag('en')
  }

  return flag
}
