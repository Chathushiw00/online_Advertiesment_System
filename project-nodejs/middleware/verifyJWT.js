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

    const authHeader = req.headers['authorization']
    const acctoken = authHeader && authHeader.split(' ')[1]  

    if(token != acctoken) return res.sendStatus(401)       //return res.redirect('/login')

    //check if the seller login to the system
    if(token != null){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decodedToken) => {
            if(err){
                 //if there's an error with the token, redirecting to login page
                console.log(err.message)

                return res.sendStatus(403)
                //res.redirect('/login')

            }else{
                console.log(decodedToken)

                //req.email = decodedToken
                next()
            }
        })
    }else{
        //if no token exist, redirecting to login page
        
        return res.sendStatus(401)
    }
}

//Getting Current logged in user details
const currentUser = (req,res,next) => {
    const token = req.cookies.jwt
    
    if(token){
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                //if there's error with the token, the current logged in user details will be null
                console.log(err.message)
                res.locals.user = null 
                next()
            }else{
                console.log(decodedToken)
                let seller = await Seller.findAll({
                    attributes:{
                        exclude: 'sellerPassword' 
                    },where:{
                        sellerEmail : decodedToken.email
                    }
                })
                  //if the token is available, send current logged in user details
                res.locals.user =seller
                next()
            }
        })
    }else{
        //if there's no available token, the current logged in user details will be null
        res.locals.user = null
        next()
    }
}
 //pass data to sever.js and other jwt verification pages
module.exports = {
    verifyJWT,
    currentUser
}