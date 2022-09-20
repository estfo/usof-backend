const Router = require('express')

const categoryRoutes=require('./categoryRouters')
const userRoutes=require('./userRouters')
const postRoutes=require('./postRouters')
const authorizationRoutes=require('./authorizationRouters')
const commentsRoutes = require('./commentsRouters')

const router = new Router()

router.use('/api/auth', authorizationRoutes)
router.use('/api/users', userRoutes)
router.use('/api/posts', postRoutes)
router.use('/api/categories', categoryRoutes)
router.use('/api/comments', commentsRoutes)

module.exports = router