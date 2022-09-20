const db = require(`./db`)

class CommentModel {
    getComment(id) {
        return db.execute(`SELECT comments.id, comments.content, comments.user_id, users.login, users.full_name FROM comments LEFT JOIN users ON comments.user_id=users.id WHERE comments.id=${id}`)
    }
    getLike(id) {
        return db.execute(`SELECT * FROM likecomments WHERE comment_id=${id}`)
    }
    createLike(user_id, comment_id) {
        return db.execute(`INSERT INTO likecomments (user_id, comment_id) VALUES ('${user_id}','${comment_id}')`)
    }
    UpdateComment(comment_id,content) {
        return db.execute(`UPDATE comments SET content="${content}" WHERE id = ${comment_id}`)
    }
    DeleteComment(comment_id) {
        return db.execute(`DELETE FROM comments WHERE id=${comment_id}`)
    }
    deleteLike(comment_id,user_id) {
        return db.execute(`DELETE FROM likecomments WHERE comment_id=${comment_id} AND user_id=${user_id}`)
    }
}
module.exports = new CommentModel