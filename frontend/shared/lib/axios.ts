import axios from 'axios'

// const apiUrl = `${process.env.JSON_SERVER_API_URL}`
const apiUrl = process.env.JSON_SERVER_API_URL

// export const instance = axios.create({
export const api = axios.create({
  baseURL: apiUrl,
  headers: { 'Content-Type': 'application/json' }
  /** TODO: */
  // headers: { Authorization: 'SECRET' }   // 챗GPT: API KEY 숨김 용도??
  // withCredentials: true
})

api.interceptors.response.use(
  response => response,
  error => {
    // 공통 에러 처리
    return Promise.reject(error)
  }
)

/*
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
