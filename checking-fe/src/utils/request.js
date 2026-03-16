import axios from "axios"

const SERVER_URL = "https://ailogs.ptit.edu.vn/be-logs/"

const request = axios.create({
  baseURL: SERVER_URL
})

// 👉 GẮN TOKEN TỪ localStorage
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default request
