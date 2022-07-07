const express = require('express');
const router = express.Router();
const dbfunc = require('../func/dbfunc')
const adminFunc = require('../func/userdbFunc');
const verifyAdmin = (req, res, next) => {
    if (req.session.adminIn) next();

    else res.redirect('/admin/login');
}

router.get('/', verifyAdmin, (req, res) => {
    let admin = req.session.admin;
    dbfunc.getProducts().then((product) => {
        res.render('admin/products', { admin, product });
    })
})

router.get('/add-product', verifyAdmin, (req, res) => {
    let admin = req.session.admin;
    res.render('admin/add-product', { admin });
})
router.post('/add-product', (req, res) => {
    let img = req.files.image
    dbfunc.addProduct(req.body).then((data) => {

        img.mv('./public/product-image/' + data + '.jpg', (err, data) => {
            if (!err)
                res.redirect('/admin/add-product')
            else
                console.log(err);
        })
    })
})

router.get('/login', (req, res) => {
    res.render('admin/admin-login', {admin:true, 'idError': req.session.notAdmin });
    req.session.notAdmin = false;
})
router.post('/login', (req, res) => {
    adminFunc.adminLogin(req.body).then((response) => {
        if (response.status) {
            req.session.adminIn = true;
            req.session.admin = response.admin;
            res.redirect('/admin')
        } else {
            req.session.notAdmin = "invalid Admin Id or Passsword";
            res.redirect('/admin/login',{admin:true})
        }
    })
})
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
})
router.get("/signup", (req, res) => {
    res.render('admin/admin-signup',{admin:true,"idError":req.session.idError})
    req.session.idError=false;
})
router.post('/signup', (req, res) => {
    adminFunc.adminSignup(req.body).then((respone) => {
        res.redirect('/admin/login')
    }).catch((err)=>{
        req.session.idError=err;
        res.redirect('/admin/signup')
    })
})
router.get('/edit-product', verifyAdmin, (req, res) => {
    let id = req.query.id;
    let admin = req.session.adminIn
    adminFunc.getProduct(id).then((product) => {
        console.log(product);
        res.render('admin/edit-product', { admin, product })
    })

})
router.post('/edit-product', (req, res) => {
    let id = req.body.id;

    adminFunc.editProduct(req.body).then((response) => {
        res.redirect('/admin');
        if (req.files.image) {
            let img = req.files.image;
            img.mv("./public/product-image/" + id + ".jpg")
        }
    })
})
router.get('/delete-product/:id', (req, res) => {
    let id = req.params.id;
    adminFunc.deleteItem(id).then((status) => {
        res.redirect('/admin');
    })
})

router.get("/users",verifyAdmin,(req,res) => {
    let admin = req.session.admin;
    adminFunc.userDetails().then((userData)=> {
        res.render('admin/user-details',{admin,userData})
    })  
})

module.exports = router;