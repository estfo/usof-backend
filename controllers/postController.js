const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const postModel = require('../models/postModel')
const db = require('../models/db')
const checkPost = require('../midleware/checkPost')
const e = require('express')
require('dotenv').config()

class Post {
    async getPosts(req, res) {
        console.log("LOX");
        postModel.getAllPost().then(resp=> {
            if (resp[0].length>0) {
                return res.status(200).json({message: "Take all posts",
                                            result:resp[0]})
            }
            else {
                return res.status(404).json({message:"No post yet"})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
       
    }
    
    async getPost(req,res) {
        console.log("LOX");

        const {post_id} = req.params
        postModel.getPostbyID(post_id).then(resp=> {
            if (resp[0].length>0) {
                return res.status(200).json({message: "Take this post",
                                            result:resp[0]})
            }
            else {
                return res.status(404).json({message:"No post with this id"})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    async getComment(req,res) {
        console.log("LOX");
        const {post_id} = req.params
        postModel.getComment(post_id).then(resp=> {
            if (resp[0].length>0) {
                return res.status(200).json({message: "Take this post",
                                            result:resp[0]})
            }
            else {
                return res.status(404).json({message:"No comments yet"})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    
    async getCategories(req,res) {
        console.log("LOX");
        const {post_id} = req.params
        postModel.getCategories(post_id).then(resp=> {
            if (resp[0].length>0) {
                return res.status(200).json({message: "Take categories",
                                            result:resp[0]})
            }
            else {
                return res.status(404).json({message:"No post"})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})}) 
    }

    async getLikes(req, res) {
        console.log("LOX");
        const {post_id} = req.params
        postModel.getLikePost(post_id).then(resp=> {
            if (resp[0].length>0) {
                return res.status(200).json({message: "Take likes",
                                            result:resp[0]})
            }
            else {
                return res.status(404).json({message:"No likes yet"})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    
    async createPost(req,res) {
        console.log("LOX");
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        const {title,info,category} = req.body
        if (!title || !info || !category) {return res.status(404).json({message:"Put all information"})}
        const true_title = checkPost.checktitle(title)
        if (true_title === false) {return res.status(404).json({mesage:"Check ur title"})}
        const true_info = checkPost.checkContent(info)
        if (true_info === false) {return res.status(404).json({message:"Check your content"})}
        postModel.getIdCategory(category).then(resp=> {
            if (resp == 'NOT FOUND') {
                db.execute(`INSERT INTO categories (title) VALUES ('${category}')`).then(resp=> {
                    if (resp[0].affectedRows>0) {
                        const post_id = resp[0].insertId
                        db.execute(`INSERT INTO posts (title,info,user_id) VALUES ('${true_title}','${true_info}','${decoded_id}')`).then(resp => {
                            if (resp[0].affectedRows>0) {
                                db.execute(`INSERT INTO post_categories (post_id, category_id) VALUES ('${resp[0].insertId}', '${post_id}')`).then(resp=> {
                                    if (resp[0].affectedRows>0) {return res.status(200).json({message:"Post created",
                                                                                            result: resp[0]})}
                                    else {return res.status(404).json({message:"Something went wrong while making post"})}
                                }).catch(err=>{return res.status(404).json({Eror:err.message})})
                            }
                            else {return res.status(404).json({message:"Something went wrong while making post"})}
                        }).catch(err=>{return res.status(404).json({Eror:err.message})})
                    }
                    else {return res.status(404).json({message:"Something went wrong while making post"})}
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
            else {
                const post_id = resp[0].id
                db.execute(`INSERT INTO posts (title,info,user_id) VALUES ('${true_title}','${true_info}','${decoded_id}')`).then(resp => {
                    if (resp[0].affectedRows>0) {
                        db.execute(`INSERT INTO post_categories (post_id, category_id) VALUES ('${resp[0].insertId}', '${post_id}')`).then(resp=> {
                            if (resp[0].affectedRows>0) {return res.status(200).json({message:"Post created",
                                                                                    result: resp})}
                            else {return res.status(404).json({message:"Something went wrong while making post"})}
                        }).catch(err=>{return res.status(404).json({Eror:err.message})})
                    }
                    else {return res.status(404).json({message:"Something went wrong while making post"})}
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
        
    }

    async createLike(req, res) {
        console.log("LOX");
        const {post_id} = req.params
        if (!post_id) {return res.status(404).json({message:"Check all fields"})}
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        await db.execute(`SELECT * from likeposts where user_id=${decoded_id} AND post_id=${post_id}`).then(resp=> {
            if (resp[0].length>0) {
                return res.status(404).json({message:"You already paste like on this post"})
            }
            else {
                db.execute(`INSERT INTO likeposts (post_id, user_id) VALUES ('${post_id}','${decoded_id}')`).then(resp=> {
                    if (resp[0].affectedRows>0) {
                        return res.status(200).json({message:"Like was created", result:resp[0]})
                    }
                    else {return res.status(404),json({message:"Error created like"})}
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
        
    }
    async createComment(req,res) {
        console.log("LOX");
        const {post_id} = req.params
        const {comment} = req.body
        if(!post_id||!comment) {return res.status(404).json({message:"Check all fields"})}
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        const true_content = checkPost.checkContent(comment)
        await db.execute(`INSERT INTO comments (content,user_id,post_id) VALUES ('${true_content}','${decoded_id}','${post_id}')`).then(resp=> {
            if (resp[0].affectedRows>0) {
                return res.status(200).json({message:"Comment was created", result: resp[0]})
            }
            else {return res.status(404).json({message:"Comment isn't created"})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    async updatePost(req, res) {
        console.log("LOX");
        const {post_id} = req.params
        const {info, title, category} = req.body
        if (!info || !title || !category) {return res.status(404).json({message:"Entry all info"})}
        if (!post_id) {return res.status(404).json({message:"Error"})}
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        
        await db.execute(`SELECT * FROM posts WHERE id=${post_id} AND user_id=${decoded_id}`).then(resp=> {
            if (resp[0].length===0) {return res.status(404).json({message:"Its not your post"})}
            else {
                postModel.getIdCategory(category).then(resp=>{
                    if (resp=='NOT FOUND') {
                        
                        db.execute(`INSERT INTO categories (title) VALUES ('${category}')`).then(resp=> {
                            const category_id = resp[0].insertId
                            if (resp[0].affectedRows>0) {
                                db.execute(`UPDATE posts SET title="${title}", info="${info}" WHERE id =${post_id}`).then(resp=>{
                                    if (resp[0].affectedRows>0) {
                                        db.execute(`INSERT INTO post_categories (post_id, category_id) VALUES ('${post_id}','${category_id}')`).then(resp=> {
                                            if (resp[0].affectedRows>0) {return res.status(200).json({message: "You update your post"})}
                                            else {return res.status(404).json({message: "CANT UPDATE POST"})}
                                    }).catch(err=>{return res.status(404).json({Eror:err.message})})
                                }
                                    else {return res.status(404).json({message: "CANT UPDATE POST"})}

                                }).catch(err=>{return res.status(404).json({Eror:err.message})})
                            } 
                        }).catch(err=>{return res.status(404).json({Eror:err.message})})
                    }
                    else {
                        const category_id = resp[0].id
                        db.execute(`UPDATE posts SET title="${title}", info="${info}" WHERE id =${post_id}`).then(resp=>{
                            console.log("Penis");
                            if (resp[0].affectedRows>0) {
                                return res.status(200).json({message: "You update your post"})
                                
                            }
                            else {return res.status(404).json({message: "CANT UPDATE POST"})}

                        }).catch(err=>{return res.status(404).json({Eror:err.message})})
                    }
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
        
        
        
    }
    async deletePost(req,res) {
        console.log("LOX");
        const {post_id} = req.params
        if (!post_id) {return res.status(404).json({message:"Error"})}
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        await db.execute(`SELECT * FROM posts where id=${post_id} AND user_id=${decoded_id}`).then(resp=> {
            if (resp[0].length>0) {
                db.execute(`DELETE from post_categories WHERE post_id=${post_id}`).then(resp=> {
                    if (resp[0].affectedRows>0) {
                        db.execute(`DELETE from likeposts where post_id =${post_id}`).then(resp=> {
                            if (resp[0].affectedRows>0) {
                                db.execute(`DELETE from posts where id=${post_id}`).then(resp=> {
                                    if (resp[0].affectedRows>0) {return res.status(200).json({message:"Post was successfully deleted"})}
                                    else {return res.status(404).json({message:"Something went wrong when try to delete post"})}
                                }).catch(err=>{return res.status(404).json({Eror:err.message})})
                            }
                            else {
                                db.execute(`DELETE from posts where id=${post_id}`).then(resp=> {
                                if (resp[0].affectedRows>0) {return res.status(200).json({message:"Post was successfully deleted"})}
                                else {return res.status(404).json({message:"Something went wrong when try to delete post"})}
                            }).catch(err=>{return res.status(404).json({Eror:err.message})})
                        }

                        })
                    }
                    else {
                        db.execute(`DELETE from posts where id=${post_id}`).then(resp=> {
                            if (resp[0].affectedRows>0) {return res.status(200).json({message:"Post was successfully deleted"})}
                            else {return res.status(404).json({message:"Something went wrong when try to delete post"})}
                        }).catch(err=>{return res.status(404).json({Eror:err.message})})
                    }

                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
            else {return res.status(404).json({message:"Its not your post"})}

        }).catch(err=>{return res.status(404).json({Eror:err.message})})
        
    }
    async deleteLikeFromPost(req,res) {
        console.log("LOX");

        const {post_id} = req.params
        if(!post_id) {return res.status(404).json({message:"Fill all fields man"})}
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        await db.execute(`SELECT * FROM posts where id=${post_id}`).then(resp=> {
            if (resp[0].length>0) {
                db.execute(`DELETE from likeposts WHERE post_id=${post_id} and user_id=${decoded_id}`).then(resp=> {
                    if (resp[0].affectedRows>0) {return res.status(200).json({message:"Like was deleted"})}
                    else {return res.status(404).json({message:"No like on this post"})}

                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
            else {return res.status(404).json({message:"No post like this"})}

        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
}

module.exports = new Post()