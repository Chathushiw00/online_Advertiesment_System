 //imports
const db = require('../models')

const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

//create main Model
const Seller = db.sellers
const City = db.cities
const Item = db.items
const Category = db.categories
const ItemImage= db.item_images


//time for cookie to be saved(3 days)
const maxAge = 3 * 24 * 60 * 60


//main work


//register new seller
const addNewSeller = async (req,res) => {
    const {sellerName,sellerEmail,sellerPassword,sellerCity,sellerContact} = req.body
    

    //check all data is available
    if(!sellerName || !sellerEmail || !sellerPassword || !sellerCity || !sellerContact)

        return res.status(400).json({'message': 'All details are required!'})

        //check for duplicate sellers
        const duplicate = await Seller.findAll({
            where:{
                sellerEmail : sellerEmail
            }
        })
    
    if(duplicate.length>0)
    
        return res.send({'message': 'Seller already Registerd!'});
    
    else{
        try{
            //encrpt password
            const hashPW = await bcrypt.hash(sellerPassword,10)

            //add new seller details
            const newSeller = await  Seller.create({
                //user leftside values=sellerModel column names
                sellerName: sellerName,
                sellerEmail: sellerEmail,
                sellerPW:hashPW,
                seller_CityId: sellerCity,
                sellerContact: sellerContact
            },{fields : ['sellerName','sellerEmail','sellerPW','seller_CityId','sellerContact']})
            res.redirect('/login?success='+ encodeURIComponent('yes'))
        }catch (err)
        {
            res.status(500).json({'message': err.message})
        }
    }
}

//seller Login
const SellerLogin = async (req,res) => {
    const {sellerEmail,sellerPassword} = req.body

    if(!sellerEmail || !sellerPassword) return res.status(400).json({'message': 'Email & Password are required'})

    const sellerFound = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!sellerFound)
        //return res.redirect('/login?avail='+ encodeURIComponent('no'))
        return res.status(400).json({'message': 'Not Registered'})

        else{
            //evaluate password
            
            const matchPW = await bcrypt.compare(sellerPassword,sellerFound.sellerPW);
            if(matchPW)
            {
                const token = accessToken(sellerFound.sellerEmail)
                res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000})
                res.redirect('/account')
                
            }else{
                //res.redirect('/login?success='+ encodeURIComponent('no'))
                res.status(400).json({'message': 'Email and Password not match'})
            }
        }
    }
                
        //generate access token
        const accessToken =(email) => {
            return jwt.sign({email},process.env.ACCESS_TOKEN_SECRET,{expiresIn : maxAge })
        }

//get seller details by sellerEmail-seller 
const getSellerDetails = async (req,res) =>{

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
            include:[{
                model: City,
                as: 'city',
                attributes: [
                    'cityName'
                ]
            }],
            attributes: {
                exclude: ['sellerPassword'] 
            },
            where: {
                sellerEmail : sellerEmail
            }
        })

        if(!sellerFound) return res.sendStatus(403) //Forbidden if seller not logged in

    const city =  await City.findAll()
    
    res.status(200).send({
        cities : city,
        seller : sellerFound
        })   
    }


    //get seller details to the seller profile-normal user clicked item-seller details

    const getSellerInfo = async (req,res) => {
        
        const sellerId = req.query.sellerId

        if(!sellerId) return res.status(400).json({'message' : 'provide aaa sellerId'})

        const sellerFound = await Seller.findOne({
            include:[{
                model: City,
                as: 'city',
                attributes:[
                    'cityName'
                ]
            }],
            attributes: {
                exclude: ['sellerId','seller_CityId','sellerEmail','sellerPW']
            },
            where: {
                sellerId : sellerId
            }
        })

        if(!sellerFound) return res.status(400).json({ 'message' : 'No such seller'})
    
        const item =  await Item.findAll({
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
                attributes: [
                    'imgName'
                ],
                where: {
                    imgStatus: 1
                }
            }],
            attributes:{
                exclude: ['item_CatId','sellerId','item_ConditionId','item_CityId','itemDescription','itemStatus']
            },
            where: {
                itemStatus : 1,
                item_SellerId : sellerId
                  //sellerId : sellerId 
            }
        })


        if(item.length>0){
            res.status(200).send({
                seller : sellerFound,
                items : item
                })   
        }else{
            res.status(200).send({
                seller : sellerFound,
                message : 'no listings'
                })   
        }
    }



    //update sellerDetails
    const UpdateSellerDetails = async (req,res) => {

        const {sellerName,sellerContact,sellerCity,sellerEmail,sellerConfirmPassword,sellerCurrentPassword} = req.body


        if(!sellerName || !sellerContact || !sellerCity ||  !sellerEmail || !sellerCurrentPassword  )
            return res.status(400).json({'message': 'All information are required'})
    
        const token = req.cookies.jwt
        let sellerEML 

        if(token){
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
                if(err){
                    return res.status(400).json({ 'message' : 'jwt error'})
                }else{
                    sellerEML = decodedToken.email
                }
        })

    }else{
        res.redirect('/login');
    }


    if(!sellerEML) return res.status(400).json({ 'message' : 'User not logged in'})

    const sellerFound = await Seller.findOne({
        where: {
            sellerEmail : sellerEML
        }
    })

    if(!sellerConfirmPassword) {
        if(!sellerFound)
        return res.status(400).json({'message': 'No such seller in the System'})
        else{
            //evalutae password
            const matchPW = await bcrypt.compare(sellerCurrentPassword, sellerFound.sellerPW);
            if(matchPW){
                const updateSeller = await Seller.update({
                    sellerName : sellerName,
                    sellerContact : sellerContact,
                    seller_CityId: sellerCity,
                    sellerEmail: sellerEmail
                },{
                    where: {
                        sellerId : sellerFound.sellerId
                    }
                })

                const tkn = accessToken(sellerEmail)
                res.cookie('jwt', tkn, {httpOnly: true, maxAge: maxAge*1000})
                res.status(400).json({'message': ' seller Details Updated'}) 
            }else{
                res.status(400).json({'message': 'Current Password is incorrect'})
            }
        }
    }else{
        if(!sellerFound)
        return res.status(400).json({'message': 'No such seller'})

        else{
            //evaluate password
            const matchPW = await bcrypt.compare(sellerCurrentPassword, sellerFound.sellerPW);
            if(matchPW){
                const hashedPW = await bcrypt.hash(sellerConfirmPassword, 10)

                const updateSeller = await Seller.update({
                    sellerName : sellerName,
                    sellerContact : sellerContact,
                    seller_CityId: sellerCity,
                    sellerEmail: sellerEmail,
                    sellerPW : hashedPW
                },{
                   where: {
                    sellerId : sellerFound.sellerId
                   } 
                })

                const tkn = accessToken(sellerEmail)
                res.cookie('jwt', tkn, {httpOnly: true, maxAge: maxAge*1000})
                res.status(400).json({'message': 'Seller Details Updated'})
            }else{
                res.status(400).json({'message': 'Current Password is incorrect'})
            }
        }
    }
    
}

module.exports = {
    addNewSeller,
    SellerLogin,
    getSellerDetails,
    UpdateSellerDetails,
    getSellerInfo
} 




