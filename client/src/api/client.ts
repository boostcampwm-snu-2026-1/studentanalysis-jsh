import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

client.interceptors.response.use(
  res => res.data,
  err => Promise.reject(new Error(err.response?.data?.error ?? '오류가 발생했습니다'))
)

export default client
