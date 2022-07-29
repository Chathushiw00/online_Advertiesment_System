
//imports
const database = require('../config/database');

const {Sequelize, DataTypes} = require('sequelize');


//assigning Db configuration to Sequelize
const sequelize = new Sequelize(
    database.DB,
    database.USER,
    database.PASSWORD, {
        host: database.HOST,
        dialect: database.dialect,
        operatorsAliases: false,

        pool: {
            max: database.pool.max,
            min: database.pool.min,
            acquire: database.pool.acquire,
            idle: database.pool.idle
        }
    }
)


//authentication to the DB through Sequelize
sequelize.authenticate()
.then(() => {
    console.log('database connected..')
})
.catch(err => {
    console.log(`Error ${err}`)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

//assinging the relevant models to the DB tables
db.categories = require('./categoryModel.js')(sequelize, DataTypes)
db.cities = require('./cityModel.js')(sequelize, DataTypes)
db.sellers = require('./sellerModel.js')(sequelize, DataTypes)
db.items = require('./itemModel.js')(sequelize, DataTypes)
db.item_conditions = require('./itemConditionModel.js')(sequelize, DataTypes)
db.item_images = require('./itemImgModel.js')(sequelize, DataTypes)


//syncronize DB tables
db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})


//associations or relationships (foreignkey)

//categories has many items
db.categories.hasMany(db.items,{
    foreignKey: 'item_CatId', 
    as: 'item'
})

db.items.belongsTo(db.categories,{
    foreignKey: 'item_CatId',
    as:'category'
})

//cities has many sellers
db.cities.hasMany(db.sellers,{
    foreignKey: 'seller_CityId',
    as: 'seller'
})

db.sellers.belongsTo(db.cities,{
    foreignKey: 'seller_CityId',
    as:'city'
})

//cities has many items

db.cities.hasMany(db.items,{
    foreignKey: 'item_CityId', //add forign key to items table in cities->cityId
    as: 'item'
})
db.items.belongsTo(db.cities,{
    foreignKey: 'item_CityId',
    as: 'city'
})

//itemCondition has many items
db.item_conditions.hasMany(db.items,{
    foreignKey: 'item_ConditionId',
    as: 'item'
})

db.items.belongsTo(db.item_conditions,{
    foreignKey: 'item_ConditionId',
    as: 'item_condition'
})

//sellers has many items
db.sellers.hasMany(db.items,{
    foreignKey: 'item_SellerId',
    as: 'item'
})

db.items.belongsTo(db.sellers,{
    foreignKey: 'item_SellerId',
    as: 'seller'
})

//Item has many item images
db.items.hasMany(db.item_images,{
    foreignKey: 'img_ItemId',
    as: 'item_Image'
})

db.item_images.belongsTo(db.items,{
    foreignKey: 'img_ItemId',
    as: 'item'
})


module.exports = db


