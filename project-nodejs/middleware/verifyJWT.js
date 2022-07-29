//import
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//get main model
const Seller = db.sellers


//main work

//check json token exists & is verfied

const verifyJWT =(req,res,next) => {
    const token = req.cookies.jwt

    //check if the seller login to the system
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decodedToken) => {
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
}

//current user
const currentUser = (req,res,next) => {
    const token = req.cookies.jwt
    
    if(token){
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.locals.user = null 
                next()
            }else{
                console.log(decodedToken)
                let seller = await Seller.findAll({
                    attributes:{
                        exclude: 'sellerPassword' //check correct value to sellerPassword
                    },where:{
                        sellerEmail : decodedToken.email
                    }
                })
                res.locals.user =seller
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }
}
 
module.exports = {
    verifyJWT,
    currentUser
}