import redis from 'redis'
import config from '../config'
import logger from './logger'
import { promisify } from 'util'

const options: { host: string, port: string, password?: string } = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
}
if (!options.password) {
    delete options.password;
}
const client = redis.createClient(options)

client.on('error', (err) => {
    logger.error('Redis error: ', err)
})
client.on('connect', () => {
    logger.info('Redis connected!')
})

const getAsync = promisify(client.get).bind(client)

export default {
    set: (key: string, value: string, maxAge: number = 30 * 24 * 60 * 60) => {
        logger.info('Redis set: ' + key)
        client.setEx(key, maxAge, value)
    },
    get: async (key: string) => await getAsync(key),
    del: (key: string) => client.del(key),
}