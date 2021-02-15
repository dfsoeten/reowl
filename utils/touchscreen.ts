/**
 * Check if touch screen
 * @returns {boolean}
 */
export const isTouchScreen = (): boolean =>
  'ontouchstart' in document.documentElement
