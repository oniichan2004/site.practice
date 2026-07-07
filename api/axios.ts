import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios"
import { toast } from "sonner"
// import { refresh } from "./requests"

const DEFAULT_TIMEOUT_MS = 30000

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"

// localStorage only exists in the browser. This module can be imported during
// SSR (Server Components / route handlers), so every access is guarded — reading
// localStorage on the server throws "localStorage is not defined".
const isBrowser = (): boolean => typeof window !== "undefined"

export const getAccessToken = (): string | null =>
  isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null

export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (!isBrowser()) return
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const clearTokens = (): void => {
  if (!isBrowser()) return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Use optional chaining — network errors have no `response`, so
    // `error.response.status` would itself throw.
    if (error.response?.status === 401) {
      try {
        // const tokens = await refresh()
        // if (isBrowser()) {
        //   localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
        //   localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
        // }
      } catch {
        clearTokens()
        toast.error("Refresh failed")
      }
    }
    return Promise.reject(error)
  },
)

export default api
