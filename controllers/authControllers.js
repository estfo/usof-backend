const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcryptjs')
const db = require('../models/db')
const message = require("nodemailer")
const User = require('../models/userModel')
const check = require('../midleware/checkUserinfo')

function jwtGenerator(id, login, email, role){
    const token = jwt.sign(
        {id: id, login: login, email: email, role: role}, 
        process.env.SECRETKEY,
        {expiresIn: '12h'}
    );
    return token;
}

class Authentication {
    async register(req,res) {
        console.log("LOX");
        const Check = new check()
        const {login, email, full_name, password} = req.body
        if(!login || !email || !full_name || !password) {
            return res.status(404).json({message:"Please fill all information"})
        }
        const true_email =Check.checkEmail(email)
        const true_login = Check.checkLogin(login)
        const true_full = Check.checkFull_name(full_name)
        const true_password = Check.checkPassword(password)
        const hashed = await bcrypt.hash(password,10)
        const user = new User()
        if (!true_email||!true_full||!true_login||!true_password) {return res.status(404).json({message:"Fill required fields in right way"})}
        else {
            user.getAllUsers().then(resp=> {
                if(resp[0].length===0) {
                    const hashedPassword = bcrypt.hash(password.toString(),10)
                    console.log(hashedPassword);
                    db.execute(`INSERT INTO users (login, password, email, full_name, role,photo) VALUES ('${login}','${hashed}','${email}','${full_name}','admin','admin.png');`).then(resp=> {
                        if(resp[0].affectedRows>0) {
                            const token = jwtGenerator(resp[0].insertId, login, email, 'admin');
                            return res.status(200).json({message:"You were succesfully registered",result:token})}
                        else {return res.status(404).json({message:"Registration failed"})}
                        
                    }).catch(err=>{return res.status(404).json({Eror:err.message})})
                }
                else {
                    db.execute(`INSERT INTO users (login,email,full_name,password,role,photo) VALUES ('${login}','${email}','${full_name}','${hashed}','user','user.png');` ).then(resp=> {
                            if(resp[0].affectedRows>0) {
                                const token = jwtGenerator(resp[0].insertId, login, email, 'user');
                                return res.status(200).json({message:"You were succesfully registered",result:token})}
                            else {return res.status(404).json({message:"Registration failed"})}
                        }).catch(err=>{return res.status(404).json({Eror:err.message})})
                }
            }).catch(err=>{return res.status(404).json({Eror:err.message})})
        }
    }
    async login(req,res) {
        console.log("LOX");
        const {login, password,email} = req.body
        if(!login || !password || !email) {return res.status(404).json({message:"Check all required fields"})}
        let user = new User()
        const Check = new check()
        const t_login = Check.checkLogin(login)
        const t_password = Check.checkPassword(password)
        const t_email=Check.checkEmail(email)
        user.getUserbyLoginpass(login).then(resp=> {
            if(resp=='NOT FOUND') {return res.status(404).json({message:"No user with this login and mail"})}
            else {
                user = resp[0]
                console.log(resp[0].password);
                const compare = bcrypt.compareSync(t_password,user.password)
                console.log(compare);
                if (!compare) {return res.status(404).json({message:"Check your password"})}
                else {
                    const token = jwtGenerator(user.id,user.login,user.email,user.role)
                    res.cookie('token',token,{httpOnly: true,expiresIn:'12h'})
                    return res.status(200).json({message:"You were successfully loged in",token:token})
                }
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
        // if(result.length === 0) {res.status(404).json({message:"No user with this login and mail"})}
        // const hashed = result[0].password
        // const checkpass = bcrypt.compare(t_password,hashed)
        // if(checkpass === false) {
        //     res.status(404).json({message:"Password isn`t correct"})
        // }
        // const token = jwtGenerator(result[0].id, result[0].login, result[0].email, result[0].role)
        // const session = {
        //     id: result[0].id,
        //     login:result[0].login,
        //     email:result[0].email,
        //     token:token
        // }
        // req.session.user = session
        // req.session.save()
        // res.status(200).json({token: token})
    }
    async logout(req,res) {
        res.clearCookie('token')
        res.status(200).json({message:"You were logout"})
        
    }
    async resetPassword (req, res) {
        console.log("LOX");
        const Check = new check()
        const {email} = req.body
        await db.execute(`SELECT * FROM users WHERE email="${email}";`).then(resp=> {
            if (resp[0].length==0) {return res.status(404).json({message:"This email isn`t used"})}
            else {
                const token = jwt.sign({
                    email:email
                },process.env.SECRETKEY,{expiresIn: '2h'})
                var transporter = message.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'eestfoo@gmail.com',
                        pass: 'dxwcxeojfjkoyjuz'
                    }
                });
                
                var mailOptions = {
                    from: 'eestfoo@gmail.com',
                    to: email,
                    subject: 'Reset Password',
                    text:`Paste this lenk in ur website: "http://localhost:3001/api/auth/password-reset/${token}"`
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    console.log('Email sent: ' + info.response);
                    }
                }); 
                res.status(200).json({message: "Email was sent"})
            }
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
        
    }
    async confirm(req,res) {
        console.log("LOX");
        const {confirm_token} = req.params
        const {password} = req.body
        if (!password || !confirm_token) {res.status(404).json({message:"Paste token and new password!"})}
        const decode = jwt.verify(confirm_token,process.env.SECRETKEY)
        const email = decode.email
        const Check = new check()
        const true_email = Check.checkEmail(email)
        const hash = await bcrypt.hash(password,10)
        await db.execute(`UPDATE users SET password="${hash}" WHERE email="${true_email}"`).then(resp=> {
            if(resp[0].affectedRows>0) {return res.status(200).json({message:"Your password was changed"})}
            else {return res.status(404).json({message:"Something went wrong"})}
        }).catch(err=>{return res.status(404).json({Eror:err.message})})
        
    }
}

module.exports = Authentication