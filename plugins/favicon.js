// Dark scheme favicon
export default () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return
  }

  if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
    document.querySelectorAll('head > link[rel="icon"]').forEach((linkTag) => {
      linkTag.setAttribute(
        'href',
        linkTag
          .getAttribute('href')
          .replace(
            /(favicon)-?(\d{2})?\.(ico|png)/,
            (_match, p1, p2, p3) =>
              `${[p1, 'reversed', p2].filter((str) => str).join('-')}.${p3}`
          )
      )
    })
  }
}
