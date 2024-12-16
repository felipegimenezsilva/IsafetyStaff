// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: false },
  css : ['bootstrap/dist/css/bootstrap.css'],
  runtimeConfig : {
    tokenApi: process.env.TOKEN_API,
    serverApi: process.env.API_URL
  },
  app : {
    baseURL : '/quiz/'
  }
})