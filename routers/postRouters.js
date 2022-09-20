const Router = require('express')
const router = new Router()
const PostController = require(`../controllers/postController`)
const auth = require('../midleware/userAuth')

router.get('/',auth(),PostController.getPosts)
router.get('/:post_id',auth(),PostController.getPost)
router.get('/:post_id/comments',auth(),PostController.getComment)
router.post('/:post_id/comments',auth(),PostController.createComment)
router.get('/:post_id/categories',auth(),PostController.getCategories)
router.get('/:post_id/like',auth(),PostController.getLikes)
router.post('/',auth(),PostController.createPost)
router.post('/:post_id/like',auth(),PostController.createLike)
router.patch('/:post_id',auth(),PostController.updatePost)
router.delete('/:post_id',auth(),PostController.deletePost)
router.delete('/:post_id/like',auth(),PostController.deleteLikeFromPost)

module.exports = router