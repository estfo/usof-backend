const db = require('../models/db')
const Comment = require(`../models/commentModel`)
const { json } = require('express')
const e = require('express')
const { DeleteComment } = require('../models/commentModel')
const jwt = require('jsonwebtoken')
class CommentController {
    async getComment(req,res) {
        console.log("LOX");
        const {comment_id} = req.params
        Comment.getComment(comment_id).then(resp=> {
            if(resp[0].length>0) {
                return res.status(200).json({message:"Take comment", result:resp[0]})
            }
            else {return res.status(404).json({message:"Error when try to take comment"})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})    
    }
    async getLike(req,res) {
        console.log("LOX");
        const {comment_id} = req.params
        Comment.getLike(comment_id).then(resp=> {
            if(resp[0].length>0) {
                return res.status(200).json({message:"Take likes", result:resp[0]})
            }
            else {return res.status(404).json({message:"Error when try to take likes"})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})    
    }
    async createLike(req, res) {
        console.log("LOX");
        const {comment_id} = req.params
        if (!comment_id) {
            return res.status(404).json({message:"No comment id :( Please paste comment id"})
        }
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        await db.execute(`SELECT * FROM likecomments where user_id=${decoded_id} and comment_id=${comment_id}`).then(resp=> {
            if (resp[0].length>0) {
                return res.status(404).json({message:"Like already pasted"}) 

            }
            else {
                Comment.createLike(decoded_id,comment_id).then(resp=>{
                    if (resp[0].affectedRows>0) {return res.status(200).json({message:"You like this comment", result:resp[0]})}
                    else { return res.status(404).json({message:"Something went wrong when u try to paste like"}) }
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    async updateComment(req, res) {
        console.log("LOX");
        const {comment_id} =req.params
        const {content} = req.body
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        const role = decoded.role
        if (!comment_id || !content) { return res.status(404).json({message:"Fill all required fills"}) }
        if (role=='admin') {
            await db.execute(`SELECT id FROM comments WHERE id=${comment_id}`).then(resp=> {
                if (resp[0].length>0) {
                    Comment.UpdateComment(comment_id,content).then(resp=> {
                        if (resp[0].affectedRows>0) {return res.status(200).json({message:"You update comment", result:resp[0]})}
                        else { return res.status(404).json({message: "Something went wrong when you update comment"}) }
                    }).catch(err=>{return res.status(404).json({Eror:err.message})})
                }
                else { return res.status(404).json({message: "Its not your comment"}) }
            }).catch(err=>{return res.status(404).json({Eror:err.message})})
        }
        else {
            await db.execute(`SELECT id FROM comments WHERE id=${comment_id} AND user_id=${decoded_id}`).then(resp=> {
                if (resp[0].length>0) {
                    Comment.UpdateComment(comment_id,content).then(resp=> {
                        if (resp[0].affectedRows>0) {return res.status(200).json({message:"You update comment", result:resp[0]})}
                        else { return res.status(404).json({message: "Something went wrong when you update comment"}) }
                    }).catch(err=>{return res.status(404).json({Eror:err.message})})
                }
                else { return res.status(404).json({message: "Its not your comment"}) }
            }).catch(err=>{return res.status(404).json({Eror:err.message})})
        }
    }
    async DeleteComment(req, res) {
        console.log("LOX");
        const {comment_id} = req.params

        if (!comment_id) { return res.status(404).json({message:"U need to paste comment id"}) }

        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        const role = decoded.role
        if (role=='admin') {
            await db.execute(`SELECT id FROM comments WHERE id=${comment_id}`).then(resp=> {
                if (resp[0].length>0) {
                    db.execute(`DELETE FROM likecomments WHERE comment_id=${comment_id}`).then(resp=> {
                        if (resp[0].affectedRows>0) {
                            Comment.DeleteComment(comment_id).then(resp=> {
                                if (resp[0].affectedRows>0) {return res.status(200).json({message:"You delete comment", result:resp[0]})}
                                else { return res.status(200).json({message:"You delete comment", result:resp[0]})}
                            })
                        }
                            
                        else { return res.status(404).json({message: "Cant delete comment"})}
                    }).catch(err=>{return res.status(404).json({Eror:err.message})})
                }
                else { return res.status(404).json({message: "Cant find comment"}) }
            }).catch(err=>{return res.status(404).json({Eror:err.message})})
        }
        else {
            await db.execute(`SELECT id FROM comments WHERE id=${comment_id} AND user_id=${decoded_id}`).then(resp=> {
                if (resp[0].length>0) {
                    db.execute(`DELETE FROM likecomments WHERE comment_id=${comment_id}`).then(resp=> {
                        if (resp[0].affectedRows>0) {
                            Comment.DeleteComment(comment_id).then(resp=> {
                                if (resp[0].affectedRows>0) {return res.status(200).json({message:"You delete comment", result:resp[0]})}
                                else { return res.status(200).json({message:"You delete comment", result:resp[0]})}
                            })
                        }
                            
                        else { return res.status(404).json({message: "Cant delete comment"})}
                    }).catch(err=>{return res.status(404).json({Eror:err.message})})
                }
                else { return res.status(404).json({message: "Cant find comments"}) }
            }).catch(err=>{return res.status(404).json({Eror:err.message})})
        }
    }
    async deleteLike(req, res) {
        console.log("LOX");
        const {comment_id} = req.params
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI')
        const decoded_id = decoded.id
        if (!comment_id) { return res.status(404).json({message:"U need to paste comment id"}) }
        await db.execute(`SELECT * FROM likecomments WHERE comment_id=${comment_id} AND user_id=${decoded_id}`).then(resp=> {
            if (resp[0].length>0) {
                Comment.deleteLike(comment_id,decoded_id).then(resp=>{
                    if (resp[0].affectedRows>0) {return res.status(200).json({message:"You delete like", result:resp[0]})}
                    else { return res.status(404).json({message: "Cant delete like"}) }
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
            else { return res.status(404).json({message: "U dont paste like!"}) }
        }).catch(err=>{return res.status(404).json({Eror:err.message})}) 
    }
}

module.exports = new CommentController