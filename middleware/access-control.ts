import type { Context, Next } from 'koa'

const blacklist = (process.env.BLACKLIST && process.env.BLACKLIST.split(',')) || []
const whitelist = (process.env.WHITELIST && process.env.WHITELIST.split(',')) || []

export default async (ctx: Context, next: Next) => {
    const ip = ctx.ips[0] || ctx.ip
    const referer = ctx.headers.referer

    const referAllowed = whitelist.some((domain) => referer?.includes(domain)) || blacklist.every((domain) => !referer?.includes(domain))
    const ipAllowed = whitelist.some((domain) => ip?.includes(domain)) || blacklist.every((domain) => !ip?.includes(domain))

    if (ipAllowed && referAllowed) {
        await next()
    } else {
        ctx.status = 403
        ctx.body = JSON.stringify({
            code: 1,
            msg: `${!referAllowed ? '该站点' : '你的IP'}没有访问权限`,
        })
    }
}
