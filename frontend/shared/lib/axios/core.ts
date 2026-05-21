// import 'server-only'

import axios from 'axios'
import { apiInstance } from '@/shared/lib/axios/interceptor'

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`
// const jsonUrl = process.env.JSON_SERVER_API_URL
const jsonUrl = process.env.NEXT_PUBLIC_JSON_SERVER_API_URL

export const api = apiInstance(
  axios.create({
    baseURL: apiUrl
  })
)

export const jsonApi = apiInstance(
  axios.create({
    baseURL: jsonUrl
  })
)

const defaultConfig = {
  timeout: 10000,
  withCredentials: true
}

// shared/lib/axios/auth.ts
export const authApi = apiInstance(
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    ...defaultConfig
  })
)
