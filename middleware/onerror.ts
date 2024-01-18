import type { Context, Next } from "koa"
import logger from "../utils/logger"

export default async (ctx: Context, next: Next) => {
    try {
        await next()
    } catch (err) {
        logger.error('Promise error: ' + (err instanceof Error ? err.stack : err))
        ctx.set({
            'Content-Type': 'text/html; charset=UTF-8',
        })
        ctx.body = `DPlayer-node 发生了一些意外: <pre>${err instanceof Error ? err.stack : err}</pre>`
        ctx.status = 500
    }
}