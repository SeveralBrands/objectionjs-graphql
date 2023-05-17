const redis = require('redis')
const md5 = require('md5')

class Cache {
  constructor(options) {
    if (options) {
<<<<<<< HEAD
      const redisOptions = JSON.parse(JSON.stringify(options))
      if (!(typeof redisOptions === 'object')) {
        throw new Error('Caching options must be an object')
      } else if (Array.isArray(redisOptions)) {
        throw new Error('Caching options can not be an array')
=======
      if (!(typeof options === 'object') || Array.isArray(options)) {
        throw new Error('Caching options must be an object')
>>>>>>> 2a318a3015019da8fa60ed6c0c0850ac81be65ff
      } else {
        const allowedKeys = ['host', 'port', 'cacheTimeout', 'redisKeyPrefix']
        Object.keys(redisOptions).forEach(key => {
          if (!allowedKeys.includes(key)) {
            throw new Error(`${key} is not a valid option for GraphQL caching`)
          }
        })
      }
<<<<<<< HEAD
      this.validate(redisOptions)
      this.redisClient = redis.createClient({
        port: +redisOptions.port,
        host: redisOptions.host
      })
      this.redisKeyPrefix = redisOptions.redisKeyPrefix || 'gqlCache'
      this.timeout = +redisOptions.cacheTimeout || 3600
=======

      this.validate(options)
      this.redisClient = redis.createClient({
        port: Number(options.port),
        host: options.host
      })
      this.redisKeyPrefix = options.redisKeyPrefix || 'gqlCache'
      this.timeout = Number(options.cacheTimeout) || 3600
>>>>>>> 2a318a3015019da8fa60ed6c0c0850ac81be65ff
    }
  }

  validate(options) {
    if (isNaN(+options.port)) {
      throw new Error('Invalid Redis port, redis port is not a valid number')
    }

    if (!(typeof options.host === 'string')) {
      throw new Error('Invalid Redis host')
    }

    if (options.timeout) {
      if (!(typeof +options.timeout === 'number')) {
        throw new Error('Invalid Timeout value, timeout is not a number')
      }
      if (+options.timeout <= 0) {
        throw new Error('Invalid Timeout value, timeout must be larger than zero')
      }
    }
    this.enabled = true
  }

  generateRedisKey(request) {
<<<<<<< HEAD
    return `${this.redisKeyPrefix}_`.concat(md5(request.res || request.body))
=======
    return `${this.redisKeyPrefix}_${md5(request.body)}`
>>>>>>> 2a318a3015019da8fa60ed6c0c0850ac81be65ff
  }

  async getCache(request) {
    if (this.enabled) {
      return new Promise((resolve, reject) => {
        this.redisClient.get(this.generateRedisKey(request), (error, value) => {
          if (error) return reject(error)
          if (value) return resolve(JSON.parse(value))
          return resolve(null)
        })
      })
    }
  }

  async cacheResult(request, result) {
    if (this.enabled) {
      await this.redisClient.setex(this.generateRedisKey(request), parseInt(this.timeout), JSON.stringify(result))
    }
  }
}

module.exports = Cache
