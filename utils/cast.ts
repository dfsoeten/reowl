export const getCastFlag = (cast: string) => {
  let flag

  switch (cast) {
    case 'en-us':
      flag = '🇺🇸'
      break
    case 'fr-fr':
      flag = '🇫🇷'
      break
    default:
      flag = '🇺🇸'
  }

  return flag
}
