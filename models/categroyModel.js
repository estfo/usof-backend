const db = require('./db')

class CategoryModel {
    async getAllCategories() {
        
        return await db.execute(`SELECT * FROM categories`)
    }
    async getCategoryById(id) {
        return await db.execute(`SELECT * FROM categories WHERE id=${id}`)
    }
    async getPostInCategory(id) {
        return await db.execute(`SELECT * FROM post_categories 
                                LEFT JOIN posts on post_categories.post_id=posts.id WHERE post_categories.category_id=${id}`)
    }
    async createCategory(title) {
        return await db.execute(`INSERT INTO categories (title) VALUES ('${title}')`)
    }
    async updateCategory(title,category_id) {
        return await db.execute(`UPDATE categories SET title="${title}" WHERE id=${category_id}`)
    }
    async deleteCategory(id) {
        return await db.execute(`DELETE FROM categories WHERE id=${id}`)
    }
}

module.exports = new CategoryModel()