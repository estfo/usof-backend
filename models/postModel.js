const bcrypt = require("bcryptjs")
const db = require('./db')
class Post {
    getAllPost() {
        return db.execute(`SELECT posts.id, posts.title, posts.info, posts.user_id, posts.time, users.login, users.full_name FROM posts
                                LEFT JOIN users ON posts.user_id = users.id LIMIT 10`)
    }
    getPostbyID(id) {
        return db.execute(`SELECT posts.id, posts.title, posts.info, posts.user_id, posts.time, users.login, users.full_name FROM posts 
                                    LEFT JOIN users ON posts.user_id = users.id WHERE posts.id="${id}"`)
    }
    getComment(id) {
        return db.execute(`SELECT comments.id ,comments.user_id, comments.content, comments.time, users.login, users.full_name FROM comments
                                LEFT JOIN users ON comments.user_id = users.id WHERE comments.post_id="${id}"`)
    }
    getCategories(id) {
        return db.execute(`SELECT categories.id, categories.title FROM post_categories LEFT JOIN categories on post_categories.category_id=categories.id WHERE post_categories.post_id="${id}"`)
    }
    reateComment(post_id,comment,user_id) {
        return db.execute("INSERT INTO comments (content,post_id, user_id) VALUES (?,?,?)",[comment,post_id,user_id])
    }
    getLikePost(id) {
        return db.execute(`SELECT likeposts.id, likeposts.user_id, likeposts.post_id, users.login, users.full_name FROM likeposts 
                                LEFT JOIN users ON likeposts.user_id = users.id WHERE likeposts.post_id="${id}"`)
    }
    getIdCategory(category) {
        return db.execute(`SELECT id from categories where title='${category}'`).then(resp=> {
            if (resp[0].length > 0) {
                return resp[0]
            }
            else {return 'NOT FOUND'}
        })
    }
}

module.exports = new Post()