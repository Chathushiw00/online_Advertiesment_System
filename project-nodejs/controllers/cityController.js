//imports
const db = require('../models')
const {  sequelize, Sequelize } = require('../models')


//create main Model
const City = db.cities


//main work 

//get All Cities
const getAllCities = async (req,res) => {

    const city =  await City.findAll()
    res.status(200).send({
        cities:city
       })

}
//pass city data to registerRouter
module.exports = {
    getAllCities
}