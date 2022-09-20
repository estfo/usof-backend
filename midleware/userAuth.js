const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = function (){
    return function (req, res, next){
        
        if(req.method === "OPTIONS"){
            next();
        }
        try{
            const token = req.cookies.token
            console.log("da");
            if (!token){
                return res.status(404).json({message:"Token is missing"})
            }
            console.log(token);
            const decoded = jwt.verify(token, process.env.SECRETKEY || 'KHPI');
            req.user = decoded;
            next();
        } catch(err){
            return res.status(404).json({message:"Please Authorizate",
        err:err.message})

        }
    }
}

