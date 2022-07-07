const db = require('../config/dbconnect')
const collection = require('../config/collections')
const bcrypt = require('bcrypt')
const  objectId = require('mongodb').ObjectId

module.exports = {
    
    userSignup: (signupData) =>{
        let Error ="Id already Exists";
        return new Promise(async (resolve, reject) => {
            let userData = await db.get().collection(collection.USER_COLLECTION).findOne({email: signupData.email})
            if(!userData){
                signupData.password = await bcrypt.hash(signupData.password,10);
                db.get().collection(collection.USER_COLLECTION).insertOne(signupData).then((data) => {
                    resolve(data);
                })
            }else reject(Error);
        }) 
    },
    userLogin: (loginData) => {
        let response = {};
        return new Promise(async (resolve, reject) => {
            let user =await db.get().collection(collection.USER_COLLECTION).findOne({email: loginData.email});
            if(user){
                bcrypt.compare(loginData.password, user.password).then((status) => {
                    if(status){
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    }else{
                        resolve({status:false});
                    }
                })
            }else{
                resolve({status:false});
            }
        })
    },
    userDetails: () => {
        return new Promise( async (resolve, reject) => {
            await db.get().collection(collection.USER_COLLECTION).find().toArray().then((data)=>{
                resolve(data);
            })
        })
    },

    adminSignup: (signupData) => {

        return new Promise( async (resolve, reject) => {
            let admin =await db.get().collection(collection.ADMIN_COLLECTION).findOne({adminId: signupData.adminId});
            if(!admin){
                signupData.password = await bcrypt.hash(signupData.password,10);
                 db.get().collection(collection.ADMIN_COLLECTION).insertOne(signupData).then((data) => {
                    resolve(data);
                    console.log(data);
                })

            }else{
                let Error ="Id already Exists";
                reject(Error);
            }
        })
    },
    adminLogin: (loginData) => {
        let response = {};
        return new Promise( async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({adminId: loginData.adminId});
            if(admin){
                await bcrypt.compare(loginData.password,admin.password).then((status) => {
                    if(status){
                        response.admin = admin;
                        response.status = true;
                        resolve(response)
                    }else
                        resolve({status:false});
                })
            }else
            resolve({status:false});
        })
    },
    deleteItem: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: objectId(id)}).then((response) => {
                resolve(response);
            })
        })
    },
    getProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: objectId(id)}).then((data) => {
                resolve(data);
            })
        })
    },
    editProduct: (prodData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id: objectId(prodData.id)},
            {$set:{
                prodName: prodData.prodName,
                category: prodData.category,
                price: prodData.price,
                description: prodData.description
            }}).then((response) =>{
                resolve(response);
            })
        })
    }
    
}