import mongoose from 'mongoose'
import config from '../config'
import logger from './logger'

mongoose.connect(`mongodb://${(config.mongodb.username && config.mongodb.password) ? `${config.mongodb.username}:${config.mongodb.password}@` : ''}${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`)

const db = mongoose.connection
db.on('error', (err) => {
    logger.error('MongoDB connection error', err)
})
db.once('open', () => {
    logger.info('MongoDB connected')
})

const danmakuSchema = new mongoose.Schema({
    player: {
        type: String,
        index: true,
    },
    author: String,
    time: Number,
    text: String,
    color: Number,
    type: Number,
    ip: String,
    referer: String,
    date: Number,
})

const danmaku = mongoose.model('dan', danmakuSchema)

export default danmaku