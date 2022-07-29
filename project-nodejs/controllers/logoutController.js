//imports

const db = require('../models')
const {sequelize,Sequelize} = require('../models')

//create main model
const Seller = db.sellers

//main work

//handling logout
const handleLogout = async (req,res)=>{
  
    res.cookie('jwt','',{maxAge: 1})
    res.redirect('/')
}

module.exports = {

    handleLogout
}