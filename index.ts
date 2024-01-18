/// <reference path="./types.d.ts" />
import Koa, { type DefaultState } from 'koa'
import { bodyParser } from '@koa/bodyparser'
import logger from './utils/logger'
import config from './config'

import mongodb from './utils/mongodb'
import redis from './utils/redis'

import onerror from './middleware/onerror'
import header from './middleware/header'
import accessControl from './middleware/access-control'

import router from './router'
import type { ICustomAppContext } from './types'

process.on('uncaughtException', (err) => {
    logger.error('uncaughtException: ' + err)
})

logger.info('🎉 DPlayer start! Cheers!')

const app = new Koa<DefaultState, ICustomAppContext>()
app.proxy = true
app.context.mongodb = mongodb
app.context.redis = redis

app.use(bodyParser())
app.use(onerror)
app.use(header)
app.use(accessControl)
app.use(router.routes()).use(router.allowedMethods())

app.listen(parseInt(config.port))
logger.info('Listening on port ' + config.port)