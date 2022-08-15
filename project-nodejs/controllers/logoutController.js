//imports

const db = require('../models')
const {sequelize,Sequelize} = require('../models')
//const jwt = require('jsonwebtoken')
//const jwtblack = require('jwt-blacklist')(jwt)


//create main model
const Seller = db.sellers

//main work

//handling logout
const handleLogout = async (req,res)=>{
  
    res.cookie('jwt','',{maxAge: 1})

   //jwtblack.blacklist(token)
    return res.status(400).json({'message': 'Logged Out'})

}

module.exports = {

    handleLogout
}