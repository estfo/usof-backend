const Router = require('express')
const router = new Router()
const category = require(`../controllers/categoryController`)
const admin = require('../midleware/adminCheck')

router.get('/',admin('admin'),category.getCategories)
router.get('/:categories_id',admin('admin'),category.getCategorByid)
router.get('/:categories_id/posts',admin('admin'),category.getPost)
router.post('/',admin('admin'),category.createCategory)
router.patch('/:categories_id',admin('admin'),category.UpdateCategor)
router.delete('/:categories_id',admin('admin'),category.DeleteCateg)

module.exports = router