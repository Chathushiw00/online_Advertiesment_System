//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//create main Model
const Category = db.categories
const Item = db.items
const Seller = db.sellers
const City = db.cities
const ItemCondition = db.item_conditions
const ItemImage = db.item_images


//main work 

//get all Items page-normal user/seller
const getAllItems = async (req,res) => {

    let name = req.query.name
    let category = req.query.category
    let city =req.query.city

    const cat = await Category.findAll()
    const cty = await City.findAll()

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    if(!category && !name && !city){
        //get all items

        const item = await Item.findAndCountAll({
            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],
            where: {
               itemStatus : 1 
            },
            order: [[ 'itemId', 'DESC' ]],
            limit, offset

        })

        const pagitem = getPagingData(item, page, limit)


        res.status(200).send({
            categories : cat,
            cities : cty,
            data : pagitem
        })

    }else if(category && !name && !city){

        //get items by category
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],

            where: {
                item_CatId : category,
                itemStatus : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(!category && name && !city){

        //get items by name
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],
            where: {
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                itemStatus : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(!category && !name && city){

        //get items by city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],
            where: {
                item_CityId : city, 
                itemStatus : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })

    }else if(category && name && !city){

        //get items by category and name
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],
            where: {
                item_CatId : category,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                itemStatus : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if (!category && name && city){

        //get items by name and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],
            where: {
                item_CityId : city,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                itemStatus : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(category && !name && city){

        //get items by category and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],
            where: {
                item_CatId: category,
                item_CityId : city,
                itemStatus : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })

    }else{
        //get items by category , name and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],
            where: {
                item_CatId: category,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                item_CityId : city,
                itemStatus : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }
}


//post searched Items-normal user/seller
const postSearchItems = (req,res) =>{
    let name =req.body.name
    let category = req.body.category
    let city = req.body.city

    
    if(!name && !category && !city)
        res.redirect(`/list`)

    else if(name && !category && !city)
        res.redirect(`/list?name=${name}`)

    else if(!name &&  category && !city)
        res.redirect(`/list?category=${category}`)

    else if(!name &&  !category && city)
        res.redirect(`/list?city=${city}`)

    else if(name &&  category && !city)
        res.redirect(`/list?name=${name}&category=${category}`)

    else if(name &&  !category && city)
        res.redirect(`/list?name=${name}&city=${city}`)

    else if(!name &&  category && city)
        res.redirect(`/list?category=${category}&city=${city}`)

    else
        res.redirect(`/list?name=${name}&category=${category}&city=${city}`)
}
    

//get items by seller-seller
const getAllItemsBySeller = async (req,res) => {

    const token = req.cookies.jwt
    let sellerEmail
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) =>{
            if(err){
                return res.status(400).json({'message' : 'jwt error'});
            }else{
                sellerEmail = decodedToken.email
            }
        })
    }else{
        res.redirect('/login');
    }

    if(!sellerEmail) return res.status(400).json({'message': 'user not logged in'});

    const sellerFound = await Seller.findOne({
        where:{
            sellerEmail : sellerEmail
        }
    })


    if(!sellerFound) return res.sendStatus(403); //forbidden //it logged in seller didn't have any items

    const item = await Item.findAll({
        include:[{
            model: Category,
            as: 'category',
            attributes:[
                'catName'
            ]
        },{
            model: City,
            as: 'city',
            attributes:[
                'cityName'
            ]
        },{
            model: ItemImage,
            as: 'item_Image',
            attributes:[
                'imgName' // in the front end split the string and get only the first image as the main image
            ],
            where: {
                imgStatus: 1
            }
        } ],
            attributes:{
                exclude: ['item_CatId','item_SellerId','item_ConditionId','item_CityId','itemDescription','itemStatus'] //here we not select this values
            },

        where: {
            itemStatus : 1,
            //item model-seller id    seller model-seller id
            item_SellerId : sellerFound.sellerId
        }
    })

    if(item.length>0){
        res.status(200).send({
            items : item
        })
    }else{
        return res.status(400).json({'message': 'No Listings'})
    }
}

//get item by itemId-seller
const getItemDetails = async(req,res) => {
    
    const itemId = req.query.itemId

    const token = req.cookies.jwt
    let sellerEmail

    if(token){
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) =>{
                if(err){
                    return res.status(400).json({ 'message' : 'jwt error'})
                }else{
                    sellerEmail = decodedToken.email
                }
        })
    }else{
        res.redirect('/login');
    }

    if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})

    const sellerFound = await Seller.findOne({
        where:{
            sellerEmail : sellerEmail
        }
    })

    if(!sellerFound) return res.sendStatus(403) //forbidden-->if logged user didn't list any item shows this

    const item = await Item.findOne({
        include:[
            {
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName' // in the front end split the string to an array and seperately get the images
                ],
                where:{
                    imgStatus: 1
                }
            } 
        ],
        where: {
            itemId : itemId,
            item_SellerId : sellerFound.sellerId,
            itemStatus : 1
        }
    })

    const category = await Category.findAll()
    const itmCondition = await ItemCondition.findAll()
    const city = await City.findAll()


    if(!item) return res.sendStatus(403)

    const foundCity = await City.findOne({
        where: {
            cityId : item.item_CityId
        }
    })

    res.status(200).send({ 
        categories : category,
        item_conditions : itmCondition,
        cities : city,
        item : item,
        details: {
            contact: item.itemContact, //here shows logged seller contact and city
            city : foundCity.cityName
        }
    })

}

//get item information to normal user

const getItemInformation = async ( req,res) => {
    const itemId = req.query.itemId

    if(!itemId) return res.status(400).json({ 'message' : 'Specify an item id'})

    const item = await Item.findOne({
         include: [{
            model: Seller,
            as: 'seller',
            attributes: [
                'sellerName',
                'sellerContact'
            ]
         },{
            model: ItemImage,
            as: 'item_Image',
            attributes:[
                'imgName' //can split and get the images seperately to put into the slider
            ],
            where:{
                imgStatus:1
            }
        }],
         where: {
            itemId : itemId,
            itemStatus : 1
         }
    })

    if(!item) return res.status(400).json({'message': 'No such item'})

    res.status(200).send({
        item : item,
    })
}



//get-add item page necessary data-seller

const getAddItemNecessary = async (req,res) => {
    const token = req.cookies.jwt
    let sellerEmail

    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error'})
            }else{
                sellerEmail = decodedToken.email
            }
    })
}else{
    res.redirect('/login');
}

if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})
   
const sellerFound = await Seller.findOne({
    where: {
        sellerEmail : sellerEmail
    }
})


if(!sellerFound) return res.sendStatus(403) //Forbidden

const foundCity = await City.findOne({
    where: {
        cityId: sellerFound.seller_CityId
    }
})

const category = await Category.findAll()
const itmCondition = await ItemCondition.findAll()
const city = await City.findAll()

res.status(200).send({
    categories : category,
    item_Conditions : itmCondition,
    cities : city,
    details : {
        contact: sellerFound.sellerContact,
        city : foundCity.cityName
    }
    })    

}


//get unpublished item by itemid-seller

const UnpublishItem = async (req,res ) => {

    const itemId = req.query.itemId

    const token =req.cookies.jwt

    let sellerEmail

    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error'})
            }else{
                sellerEmail = decodedToken.email
            }
        })
    }else{
        res.redirect('/login'); 
    }

    if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})
   
    const sellerFound = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!sellerFound) return res.sendStatus(403) //Forbidden

    const item =  await Item.findOne({
        where: {
            itemId : itemId,
            //item model-sellerid      seller model-sellerid
            item_SellerId : sellerFound.sellerId,
            itemStatus : 1 
        }
    })

    if(!item) return res.sendStatus(403)
    
    const remItem = await Item.update({
        itemStatus :0
    },{
        where: {
            itemId : itemId,
            item_SellerId : sellerFound.sellerId
        }
    })
    
    res.redirect('/account')  
}
    
    //add item-seller
    const AddItem = async (req,res) => {

        const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity} = req.body  //itemContact not in my item table

        const itemImages = req.files

        let itemImgs = []

        if(itemImages){
            for(var count=0; count<itemImages.length; count++){
                itemImgs[count] = itemImages[count].path
            }
        }

    if(!itemName || !itemCategory || !itemCondition || !itemPrice || !itemDescription || !itemCity)
        return res.status(400).json({'message': 'All Details are required'})

        const token = req.cookies.jwt
        let sellerEmail

        if(token){
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
                if(err){
                    return res.status(400).json({ 'message' : 'jwt error'})
                }else{
                    sellerEmail = decodedToken.email
                }
            })
        }else{
            res.redirect('/login');
        }

        
        if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})
       
        const sellerFound = await Seller.findOne({
            where: {
                sellerEmail : sellerEmail
            }
        })

        if(!sellerFound) return res.sendStatus(403) //forbidden

        const dt = formatDate(new Date()).toString() //set the date of item listed

        const newItem = await Item.create({
            item_CatId: itemCategory,
            item_SellerId: sellerFound.sellerId,
            itemName: itemName,
            item_ConditionId: itemCondition,
            itemPrice: itemPrice,
            itemDateTime: dt,
            item_CityId: itemCity,
            //itemContact: itemContact,
            itemDescription: itemDescription,
            itemStatus: 1

        },{fields : ['item_CatId','item_SellerId','itemName','item_ConditionId','itemPrice','itemDateTime','item_CityId','itemDescription','itemStatus'] })

            const getItemId = await Item.findOne({
                where: {
                    item_SellerId: sellerFound.sellerId
                },
                order: [[ 'itemId', 'DESC' ]]
            })

            const newImage = await ItemImage.create({

                img_ItemId: getItemId.itemId, //ask which id used here second one item table item id (guess)
                imgName: itemImgs.toString(),
                imgStatus: 1
            })

        res.redirect('/account')
    }


    //edit item post-seller
    const EditItem = async (req,res) => {

        const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity} = req.body //itemContact not in my item table

        const itemImages = req.files

        let itemImgs = []

        if(itemImages){
            for(var count=0; count<itemImages.length; count++){
                itemImgs[count] = itemImages[count].path
            }
        }

    if(!itemName || !itemCategory || !itemCondition || !itemPrice || !itemDescription || !itemCity)
        return res.status(400).json({'message': 'All details are required'})

        const itemId = req.query.itemId
        const token = req.cookies.jwt
        let sellerEmail 
        
        if(token){
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
                if(err){
                    return res.status(400).json({ 'message' : 'jwt error'})
                }else{
                    sellerEmail = decodedToken.email
                }
            })
        }else{
            res.redirect('/login');
        }

        if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})
       
        const sellerFound = await Seller.findOne({
            where: {
                sellerEmail : sellerEmail
            }
        })

        if(!sellerFound) return res.sendStatus(403) //Forbidden

        const foundItem= await Item.findOne({
            where: {
                itemId : itemId,
                item_SellerId : sellerFound.sellerId
            }
        })

        if(!foundItem) return res.sendStatus(403) //Forbidden

        const updateItem = await Item.update({
            item_CatId: itemCategory,
            itemName: itemName,
            item_ConditionId: itemCondition,
            itemPrice: itemPrice,
            item_CityId: itemCity,
            //itemContact: itemContact,
            itemDescription: itemDescription,
            itemStatus: 1
        },{
            where: {
                itemId : itemId,
                item_SellerId : sellerFound.sellerId
            }
        })

        if(itemImages){
            const currImgs = await ItemImage.update({
                imgStatus: 0
            },{
               where: {
                img_ItemId : foundItem.itemId, //ask correct itemid
                imgStatus : 1
               } 
            })

            const newImgs = await ItemImage.create({
                img_ItemId: foundItem.itemId, 
                imgName: itemImgs.toString(),
                imgStatus: 1
            })
        }
    
        res.redirect('/account')
    }

    //remove item imgaes-seller

    const delImgs = async ( req,res) =>{

        const itemId = req.query.itemId //chek here used itemid/img tble itemid
        const token = req.cookies.jwt
        let sellerEmail 

        if(token){
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
                if(err){
                    return res.status(400).json({ 'message' : 'jwt error'})
                }else{
                    sellerEmail = decodedToken.email
                }
            })
        }else{
            res.redirect('/login');
        }

        if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})

        const foundItem = await Item.findOne({
            where: {
                itemId : itemId,
                itemStatus: 1
            }
        })

        if(!foundItem) return res.sendStatus(403) //Forbidden

        const remImg = await ItemImage.update({
            imgStatus: 0
        },{
            where:{
                img_ItemId: foundItem.itemId,
                imgStatus: 1
            }
        })
        res.redirect('/account/edit?itemId='+foundItem.itemId) //check img_ItemId='+foundItem.itemId
    }


    //dateTime formatting
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
      
    function formatDate(date) {
        return (
          [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
          ].join('-') +
          ' ' +
          [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
          ].join(':')
        );  

}

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, items, totalPages, currentPage };
  };


//pass item data to listRouter & account router
module.exports = {
    getAllItems,
    postSearchItems,
    getAllItemsBySeller,
    getItemDetails,
    getItemInformation,
    UnpublishItem,
    getAddItemNecessary,
    AddItem,
    EditItem,
    delImgs
}
