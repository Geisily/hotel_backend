import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

// Request interceptor to add token
api.interceptors.request.use(config=>{
  const token = localStorage.getItem('token')
  if(token){
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, err=>Promise.reject(err))

// Simple response interceptor: redirect to login on 401
api.interceptors.response.use(
  res => res,
  async err => {
    const status = err?.response?.status
    if(status === 401){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // dispatch logout event for SPA-aware handling
        try{ window.dispatchEvent(new CustomEvent('auth:logout')) }catch(e){ window.location.href = '/login' }
      return Promise.reject(err)
    }

    // simple retry on network errors
    const config = err.config
    if(config && !config.__retry && (!err.response || err.code === 'ECONNABORTED')){
      config.__retry = true
      return new Promise(resolve => setTimeout(()=>resolve(api(config)), 500))
    }

    return Promise.reject(err)
  }
)

export default api
