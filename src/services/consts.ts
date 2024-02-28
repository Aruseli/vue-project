// Note: all intervals and ttls are in milliseconds

export const TERMINAL_TYPE_ID = '654c6b75-54c5-4153-a3c7-b0f6a3431c68'
export const TERMINAL_REGISTRATION_ATTEMPT_INTERVAL = (process.env.DEV) ? 1000 : 5000
export const TERMINAL_STATUS_UPDATE_INTERVAL = (process.env.DEV) ? 60_000 : 600_000
export const USER_INFO_UPDATE_INTERVAL = (process.env.DEV) ? 60_000 : 600_000
export const IMAGES_CACHE_CLEANUP_INTERVAL = 6*3600*1000
export const ORDERS_CACHE_TTL = 120*1000
export const ARRIVALS_CACHE_TTL = 120*1000
export const INVENTORIES_CACHE_TTL = 120*1000
