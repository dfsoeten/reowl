declare module '*.svg?inline' {
  import Vue from 'vue'
  const content: Vue.Component
  export default content
}

declare module '*.mp4' {
  const content: string
  export default content
}

declare module 'idle-js'
declare module 'vue-click-outside'
