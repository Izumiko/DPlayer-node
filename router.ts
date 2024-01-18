import Router from '@koa/router'
import Get from './routes/get'
import Post from './routes/post'
import Bilibili from './routes/bilibili'

const router = new Router()

router.get('/v3', Get)
router.post('/v3', Post)
router.get('/v3/bilibili', Bilibili)

export default router