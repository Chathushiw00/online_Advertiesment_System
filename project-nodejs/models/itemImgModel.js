//Defining Item Image Model

module.exports = (sequelize, DataTypes) =>{
    const ItemImage = sequelize.define("item_Image",{
       imgId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: true
        },
        imgName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imgStatus: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        img_ItemId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }          
    },
    {
        timestamps: false
    })

    return ItemImage
}