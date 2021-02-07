# Reowl

Watch Overwatch League replays spoiler-free, in the 🇫🇷 language

[https://www.reowl.fr](https://www.reowl.fr)

![Website screenshot](/ressources/website-screenshot.jpg)

## Environment

### Prerequisites to work on the project

- A recent version of [Node.js](https://nodejs.org/)

### Main technologies

- [Vue.js](https://vuejs.org)
- [Nuxt.js](https://fr.nuxtjs.org)

### Branching model

I'm using the [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/) branching model.

## Local development with dev server

`npm run dev`

## Build the website for production

`npm run generate`

## Deploy to preprod/production

GitHub Actions is used to build & deploy the website with GitFlow.

### Deploy to preprod:

Push to a `release/*-*-*` branch

URL: [https://preprod.reowl.fr](https://preprod.reowl.fr)

### Deploy to production:

Push to the `master` branch

URL: [https://www.reowl.fr](https://www.reowl.fr)

## Find and fix problems in the JavaScript code

`npm run lint`

## Analyse the webpack bundle content

`npm run build:analyze`

## Feedback

If you have any question/suggestion/bug, please feel free to create an issue or email me.
