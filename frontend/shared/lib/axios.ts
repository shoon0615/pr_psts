/*
import axios from 'axios'

// const apiUrl = `${process.env.JSON_SERVER_API_URL}`
const apiUrl = process.env.JSON_SERVER_API_URL

const instance = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' }
})

const accessInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

accessInstance.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      config.headers = {
        ...config.headers,
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    }

    return config
  },
  error => {}
)
*/
