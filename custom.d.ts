declare module '*.svg?inline' {
  const content: Vue.Component
  export default content
}

declare module '*.mp4' {
  const content: string
  export default content
}
