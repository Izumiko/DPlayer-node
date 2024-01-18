import mongodb from './utils/mongodb'
import redis from './utils/redis'

interface ICustomAppContext {
    mongodb: typeof mongodb
    redis: typeof redis
}