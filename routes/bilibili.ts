import type { Context } from 'koa'
import type { ICustomAppContext } from '../types'
import * as cheerio from 'cheerio'

export default async (ctx: Context & ICustomAppContext) => {
    const aid = ctx.query.aid
    let cid = ctx.query.cid

    if (!cid && aid) {
        cid = await ctx.redis.get(`v3bilibiliaid2cid${aid}`)
        if (!cid) {
            const res = await fetch(`http://www.bilibili.com/widget/getPageList?aid=${aid}`)
            const json = await res.json() as Array<any>
            cid = json[0].cid
            await ctx.redis.set(`v3bilibiliaid2cid${aid}`, cid as string)
        }
    }

    let data = await ctx.redis.get(`v3bilibilicid2dan${cid}`)
    if (data) {
        ctx.set('X-Koa-Redis', 'true')
        data = JSON.parse(data)
    } else {
        const res = await fetch(`https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`)
        const xml = await res.text()
        const $ = cheerio.load(xml.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]/g, ''), { xmlMode: true })
        data = $('d').map((_, el) => {
            const item = $(el)
            const p = item.attr('p')?.split(',') ?? []
            let type = 0
            if (p[1] === '4') {
                type = 2
            } else if (p[1] === '5') {
                type = 1
            }
            return [[parseFloat(p[0]), type, parseInt(p[3]), p[6], item.text()]]
        }).get()
        ctx.redis.set(`v3bilibilicid2dan${cid}`, JSON.stringify(data), 10 * 60)
        ctx.set('X-Koa-Origin', 'true')
    }
    ctx.body = JSON.stringify({
        code: 0,
        data: data
    })
}