
//define category model

module.exports = (sequelize, DataTypes) =>{
    //define models should be singulars
    const Category = sequelize.define("category",{
        catId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        catName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps:false
     
    })

    return Category
}
