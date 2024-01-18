import type { Context, Next } from "koa"
import logger from "../utils/logger"

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
    'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'no-cache',
}

export default async (ctx: Context, next: Next) => {
    logger.info(`${ctx.url}, user IP: ${ctx.ips[0] || ctx.ip}`)
    ctx.set(headers)
    await next()
}