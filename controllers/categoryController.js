const db = require('../models/db')
const Category = require('../models/categroyModel');
const e = require('express');

class CategoryController {
    async getCategories(req,res) {
        console.log("LOX");
        Category.getAllCategories().then(resp=> {
            if (resp[0].length>0) {
                return res.status(200).json({message:"Take all categories", result:resp[0]})
            }
            else {return res.status(404).json({message:"Cant take all categories"})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    async getCategorByid(req,res) {
        console.log("LOX");

        const {categories_id} = req.params
        Category.getCategoryById(categories_id).then(resp=> {
            if (resp[0].length>0) {
                return res.status(200).json({message:"Take this category", result:resp[0]})
            }
            else {return res.status(404).json({message:"Cant take this category"})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    async getPost(req,res) {
        console.log("LOX");

        const {categories_id} = req.params
        Category.getPostInCategory(categories_id).then(resp=> {
            if (resp[0].length>0) {
                return res.status(200).json({message:"Take post", result:resp[0]})
            }
            else {return res.status(404).json({message:"Cant take posts :("})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    async createCategory(req,res) {
        const {title} = req.body
        await db.execute(`SELECT * FROM categories WHERE title='${title}'`).then(resp=> {
            if (resp[0].length === 0) {
                Category.createCategory(title).then(resp=>{
                    if(resp[0].affectedRows>0) {return res.status(200).json({message: "Category was created", result:resp[0]})}
                    else {return res.status(404).json({message:"Something went wrong when u try to create category"})}
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
            else {return res.status(404).json({message:"Category also created"})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
    async UpdateCategor(req, res) {
        console.log("LOX");
        const {categories_id} = req.params
        const {title} = req.body
        await db.execute(`SELECT * FROM categories WHERE id=${categories_id}`).then(resp=> {
            if (resp[0].length>0) {
                Category.updateCategory(title,categories_id).then(resp=> {
                    if(resp[0].affectedRows>0) {return res.status(200).json({message:"You update category", result:resp[0]})}
                    return res.status(404).json({message:"You cant update category"})
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
            else {return res.status(404).json({message:"No category like this"})}
        }).catch(err=>{console.log(err.message);})
        
    }
    async DeleteCateg(req, res) {
        console.log("LOX");
        const {categories_id} = req.params
        await db.execute(`SELECT id FROM categories WHERE id=${categories_id}`).then(resp=> {
            if (resp[0].length>0) {
                db.execute(`DELETE from post_categories WHERE category_id=${categories_id}`).then(resp=> {
                    if (resp[0].affectedRows>0) {
                        Category.deleteCategory(categories_id).then(resp=> {
                            if (resp[0].affectedRows>0) {
                                return res.status(200).json({message:"Category was deleted"})
                            }
                            else {return res.status(200).json({message:"Category was deleted"})}
                        }).catch(err=>{return res.status(404).json({Eror:err.message})})
                        
                    }
                    else {
                        Category.deleteCategory(categories_id).then(resp=> {
                            if (resp[0].affectedRows>0) {
                                return res.status(200).json({message:"Category was deleted"})
                            }
                            else {return res.status(200).json({message:"Category was deleted"})}
                        }).catch(err=>{return res.status(404).json({Eror:err.message})})
                    }    
                }).catch(err=>{return res.status(404).json({Eror:err.message})})
            }
            else {return res.status(404).json({message:"No such category"})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
    }
}

module.exports = new CategoryController()