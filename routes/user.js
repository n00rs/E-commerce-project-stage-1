const express = require('express');
const router = express.Router();
const dbfunc = require('../func/dbfunc');
const userdbFunc = require('../func/userdbFunc');

router.get('/',(req,res)=>{
    let user = req.session.user;
    
    dbfunc.getProducts().then((products) =>{
        res.render('user/view-product',{user,products});
    })

})

router.get('/login', (req,res) => {
    if(req.session.loggedIn)
        res.redirect('/');
     else {  
    res.render('user/user-login',{"Error":req.session.loginError});
    req.session.loginError = false ;
     }
})
router.post('/login',(req,res) =>{

userdbFunc.userLogin(req.body).then((response)=>{
    if(response.status){
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect('/');
    }else{
        req.session.loginError="invalid Id or Password";
        res.redirect('/login')
    }

})
})
router.get("/logout",(req,res) => {
req.session.destroy();
res.redirect('/')
})

router.get('/signup',(req,res)=>{
    res.render('user/user-signup',{"idError":req.session.idError})
    req.session.idError = false;
})
router.post('/signup',(req,res)=>{
    userdbFunc.userSignup(req.body).then(()=>{
        res.redirect('/login');
    }).catch((err)=>{
        req.session.idError = err;
        res.redirect('/signup')
    })
})

router.get('/cart',(req,res) =>{
    res.render('user/cart');
})
module.exports = router;