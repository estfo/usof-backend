const Router = require('express')
const router = new Router()
const Comment = require('../controllers/commentController')


router.get('/:comment_id',Comment.getComment)
router.get('/:comment_id/like',Comment.getLike)
router.post('/:comment_id/like',Comment.createLike)
router.patch('/:comment_id',Comment.updateComment)
router.delete('/:comment_id',Comment.DeleteComment)
router.delete('/:comment_id/like',Comment.deleteLike)

module.exports = router