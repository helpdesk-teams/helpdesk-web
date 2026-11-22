/**
 * Where the tokens live: localStorage, so the session survives a page reload.
 *
 * Why a separate module and not the Pinia auth store?
 * The API client needs the token for every request, and the auth store (stage 3)
 * calls the API client. If the client imported the store, the two modules would
 * import each other (a circular dependency). Both import this small module instead.
 */

const ACCESS_KEY = 'helpdesk.accessToken'
const REFRESH_KEY = 'helpdesk.refreshToken'

export interface Tokens {
  accessToken: string
  refreshToken: string
}

// localStorage can throw (private mode, blocked storage), so every access is guarded
function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Storage unavailable: the session will just not survive a reload
  }
}

export const tokenStorage = {
  getAccessToken: () => read(ACCESS_KEY),
  getRefreshToken: () => read(REFRESH_KEY),

  setTokens({ accessToken, refreshToken }: Tokens) {
    write(ACCESS_KEY, accessToken)
    write(REFRESH_KEY, refreshToken)
  },

  clear() {
    write(ACCESS_KEY, null)
    write(REFRESH_KEY, null)
  },
}
