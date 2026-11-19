/**
 * App settings read from environment variables (see .env.example).
 * The rest of the code imports from here instead of touching import.meta.env,
 * so defaults live in one place.
 */

/** Base URL for REST requests, e.g. "/api" (through the Vite proxy) */
export const API_URL = import.meta.env.VITE_API_URL || '/api'

/** Origin for the socket.io connection; empty = same origin as the page */
export const WS_URL = import.meta.env.VITE_WS_URL || ''

/**
 * Mock the API in the browser with MSW.
 * Only in development: `import.meta.env.DEV` is false in `vite build`,
 * so the mocks are never included in the production bundle.
 */
export const USE_MOCKS = import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true'
