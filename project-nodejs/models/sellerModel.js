//Defining Seller Model

module.exports = (sequelize, DataTypes) =>{
    const Seller = sequelize.define("seller",{
       sellerId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        sellerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sellerEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sellerPW: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sellerContact: {
            type: DataTypes.STRING,
            allowNull: false
        },
        seller_CityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    { 
        timestamps: false     
    })

    return Seller
}