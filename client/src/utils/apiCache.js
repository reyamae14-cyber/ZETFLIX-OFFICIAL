class ApiCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes TTL
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }

  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key]
        return result
      }, {})
    
    return `${url}?${JSON.stringify(sortedParams)}`
  }

  set(key, data) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key) {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }

    // Check if cache entry has expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key) {
    this.cache.delete(key)
  }

  size() {
    return this.cache.size
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Create a singleton instance
const apiCache = new ApiCache()

// Clean up expired entries every 5 minutes
setInterval(() => {
  apiCache.cleanup()
}, 5 * 60 * 1000)

export default apiCache