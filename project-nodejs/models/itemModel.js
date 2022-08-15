
//Defining Item Model

module.exports = (sequelize, DataTypes) =>{
    const Item = sequelize.define("item",{
       itemId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        itemDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        itemDateTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        itemStatus: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_CityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_CatId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_SellerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
       
        item_ConditionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }  
    },
    { 
        timestamps: false 
    })

    return Item
}