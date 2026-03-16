/**
 * Simple in-memory cache for API responses
 */
class Cache {
  constructor(ttl = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map()
    this.ttl = ttl
  }

  set(key, value, customTTL) {
    const expiresAt = Date.now() + (customTTL || this.ttl)
    this.cache.set(key, { value, expiresAt })
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  has(key) {
    return this.get(key) !== null
  }

  delete(key) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

// Create singleton instances for different data types
export const roomCache = new Cache(10 * 60 * 1000) // 10 minutes for rooms
export const hotelInfoCache = new Cache(30 * 60 * 1000) // 30 minutes for hotel info
export const staticDataCache = new Cache(60 * 60 * 1000) // 1 hour for static data

// Run cleanup every 5 minutes
setInterval(() => {
  roomCache.cleanup()
  hotelInfoCache.cleanup()
  staticDataCache.cleanup()
}, 5 * 60 * 1000)

export default Cache
