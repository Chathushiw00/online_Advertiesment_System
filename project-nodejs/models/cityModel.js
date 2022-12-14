
//Defining City Model

module.exports = (sequelize, DataTypes) =>{
    const City = sequelize.define("city",{
        cityId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        cityName: {
            type: DataTypes.STRING,
            allowNull: false
        }  
    },
    {
        timestamps: false
    })

    return City
}