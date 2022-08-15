
//Defining ItemCondition Model

module.exports = (sequelize, DataTypes) =>{
    const ItemCondition = sequelize.define("item_Condition",{
        conditionId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        conditionType: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
        { 
            timestamps: false 
        })

    return ItemCondition
}