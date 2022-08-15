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

    //get all cities and categories
    const cat = await Category.findAll()
    const cty = await City.findAll()

    //pagination
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    //no req. values 
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
            order: [[ 'itemId', 'DESC' ]],  //list items in latest posted view
            limit, offset

        })

        const pagitem = getPagingData(item, page, limit)


        res.status(200).send({
            categories : cat,
            cities : cty,
            data : pagitem
        })

        //only give category request
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
            order: [[ 'itemId', 'DESC' ]],
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
        //only give name request
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
            order: [[ 'itemId', 'DESC' ]],
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
        //only give city request
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
            order: [[ 'itemId', 'DESC' ]],
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
            order: [[ 'itemId', 'DESC' ]],  //list items in latest posted view
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
            order: [[ 'itemId', 'DESC' ]],  
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
            order: [[ 'itemId', 'DESC' ]],  
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
            order: [[ 'itemId', 'DESC' ]],  
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

    //no form-data for this
    if(!name && !category && !city)
        res.redirect(`/list`)

    //below conditions have form-data
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

        //form-data given for name,city,category
    else
        res.redirect(`/list?name=${name}&category=${category}&city=${city}`)
}
    

//get items by seller-seller
const getAllItemsBySeller = async (req,res) => {

    const token = req.cookies.jwt
    let sellerEmail

    //get seller email form token
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

    //check for a user belong to the token
    const sellerFound = await Seller.findOne({
        where:{
            sellerEmail : sellerEmail
        }
    })


    if(!sellerFound) return res.sendStatus(403); //forbidden,if logged in seller didn't have any items

    //get items belong to the user
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
                'imgName' 
            ],
            where: {
                imgStatus: 1
            }
        } ],
            attributes:{
                exclude: ['item_CatId','item_SellerId','item_ConditionId','item_CityId','itemDescription','itemStatus'] //excluding this values
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

//get item by itemId to edit-seller
const getItemDetails = async(req,res) => {
    
    const itemId = req.query.itemId

    const token = req.cookies.jwt
    let sellerEmail

     //getting seller email from the token
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

     //checking for seller with the token
    const sellerFound = await Seller.findOne({
        where:{
            sellerEmail : sellerEmail
        }
    })

    if(!sellerFound) return res.sendStatus(403) //forbidden-->if logged user didn't list any item shows this

    //get the item that belongs to the seller
    const item = await Item.findOne({
        include:[
            {
                model: ItemImage,
                as: 'item_Image',
                attributes:[
                    'imgName' 
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

    
    if(!item) return res.sendStatus(403)

    //get categories,cities,itemconditions
    const category = await Category.findAll()
    const itmCondition = await ItemCondition.findAll()
    const city = await City.findAll()

    //get item-city name
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
            contact: item.itemContact, 
            city : foundCity.cityName
        }
    })

}

//get item information to normal user

const getItemInformation = async ( req,res) => {
    
    //request variable to get the item
    const itemId = req.query.itemId

    if(!itemId) return res.status(400).json({ 'message' : 'Specify an item id'})

    //get the relavent item
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
    //get the access token from cookies
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
   
//get seller details to put default values to the drop down lists
const sellerFound = await Seller.findOne({
    where: {
        sellerEmail : sellerEmail
    }
})


if(!sellerFound) return res.sendStatus(403) //Forbidden

  //getting the seller's city to put to the drop down as default value
const foundCity = await City.findOne({
    where: {
        cityId: sellerFound.seller_CityId
    }
})

//getting category, city and itemconditions to the drop down lists
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
    //request variable
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

    //getting item that belngs to the user
    const item =  await Item.findOne({
        where: {
            itemId : itemId,
            //item model-sellerid      seller model-sellerid
            item_SellerId : sellerFound.sellerId,
            itemStatus : 1 
        }
    })

    if(!item) return res.sendStatus(403)
    
     //removing item by updating the itemstatus as 0
    const remItem = await Item.update({
        itemStatus :0
    },{
        where: {
            itemId : itemId,
            item_SellerId : sellerFound.sellerId
        }
    })
    
    //res.redirect('/account')  
    return res.status(400).json({'message': 'Item successfully deleted!'})
}
    
    //add item-seller
    const AddItem = async (req,res) => {

        //requsting form-data and files
        const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity} = req.body  

        const itemImages = req.files

        let itemImgs = []

         //if itemImages exist
        if(itemImages){
            for(var count=0; count<itemImages.length; count++){
                itemImgs[count] = itemImages[count].path
            }
        }
        
        //if not all information are given
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

        //add new item
        const newItem = await Item.create({
            item_CatId: itemCategory,
            item_SellerId: sellerFound.sellerId,
            itemName: itemName,
            item_ConditionId: itemCondition,
            itemPrice: itemPrice,
            itemDateTime: dt,
            item_CityId: itemCity,
            itemDescription: itemDescription,
            itemStatus: 1

        },{fields : ['item_CatId','item_SellerId','itemName','item_ConditionId','itemPrice','itemDateTime','item_CityId','itemDescription','itemStatus'] })

            const getItemId = await Item.findOne({
                where: {
                    item_SellerId: sellerFound.sellerId
                },
                order: [[ 'itemId', 'DESC' ]]
            })

            //add itemImage to the item_image table in db
            const newImage = await ItemImage.create({

                img_ItemId: getItemId.itemId, 
                imgName: itemImgs.toString(),
                imgStatus: 1
            })

        res.json({ message: 'New Item successfully Added'})
        //res.redirect('/account')
    }


    //edit item post-seller
    const EditItem = async (req,res) => {

        //getting form-data and files
        const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity} = req.body 

        const itemImages = req.files

        let itemImgs = []

        //checking if any itemImages are uploaded
        if(itemImages){
            for(var count=0; count<itemImages.length; count++){
                itemImgs[count] = itemImages[count].path
            }
        }
//check all information are provided - validation
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

        if(!sellerFound) return res.sendStatus(403) 

         //get the existing item
        const foundItem= await Item.findOne({
            where: {
                itemId : itemId,
                item_SellerId : sellerFound.sellerId
            }
        })

        if(!foundItem) return res.sendStatus(403) 
        //updating the item details
        const updateItem = await Item.update({
            item_CatId: itemCategory,
            itemName: itemName,
            item_ConditionId: itemCondition,
            itemPrice: itemPrice,
            item_CityId: itemCity,
            itemDescription: itemDescription,
            itemStatus: 1
        },{
            where: {
                itemId : itemId,
                item_SellerId : sellerFound.sellerId
            }
        })
//updating the itemimages if there are new images
        if(itemImages){

            const findImg = await ItemImage.findOne({
                where:{
                    img_ItemId : foundItem.itemId,
                    imgName : '',
                    imgStatus: 1
                }
            })
            
            if(!findImg){
            const currImgs = await ItemImage.update({
                imgStatus: 0
            },{
               where: {
                img_ItemId : foundItem.itemId, 
                imgStatus : 1
               } 
            })

            const newImgs = await ItemImage.create({
                img_ItemId: foundItem.itemId, 
                imgName: itemImgs.toString(),
                imgStatus: 1
            })
        }else{
            const newImgs = await ItemImage.update({
                img_ItemId: foundItem.itemId,
                imgName: itemImgs.toString(),
                imgStatus: 1

                },{where:{
                    img_ItemId : foundItem.itemId,
                    imgName : '',
                    imgStatus: 1
                }
            })
       }
    }
    
        res.redirect('/account')
        //return res.status(400).json({'message': 'item edit success'})
}


    //remove item imgaes-seller
    const delImgs = async ( req,res) =>{

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

        const updImg = await ItemImage.create({
            img_ItemId: foundItem.itemId,
            imgName: '',
            imgStatus: 1
        })

        res.json({ message: 'Item Image successfully deleted'})
        //res.redirect('/account/edit?itemId='+foundItem.itemId) 
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

//pagination setup
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
