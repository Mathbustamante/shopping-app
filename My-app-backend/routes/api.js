const express = require("express");
const router = express.Router();
const Products = require('../models/products');
const Carts = require('../models/carts');
const Wishlists = require('../models/wishlists');
const Cards = require('../models/cards');
const Sales = require('../models/sales');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../authentification/register");
const validateLoginInput = require("../authentification/login");
// Load User model
const User = require("../models/user");
const Comments = require("../models/comments");
const Sugestions = require("../models/suggestions");

/*
PRODUCTS API
*/
//GET REQUEST TO THE DATABASE
router.get("/products", function (req, res) {
    Products.find({}).then(function (product) {
        res.send(product);
    });
});

//GET REQUEST TO THE DATABASE
router.get("/products/:id", function (req, res) {
    Products.findOne({_id: req.params.id}).then(function (product) {
        res.send(product);
    });
});

//POST REQUEST TO THE DATABASE
router.post("/products", function (req, res) {
    Products.create(req.body).then(function (product) {
        res.send(product);
        res.json(product);
    });
});

//PUT REQUEST TO THE DATABASE
router.put("/products/:id", function (req, res) {
    Products.findByIdAndUpdate({_id: req.params.id}, req.body).then(function () {
        Products.findOne({_id: req.params.id}).then(function (product) {
            res.send(product);
        });
    })
});

//DELETE REQUEST TO THE DATABASE
router.delete("/products/:id", function (req, res) {
    Products.findByIdAndRemove({_id: req.params.id}).then(function (product) {
        res.send(product);
    });
});

/*
CART API
*/
//GET REQUEST TO THE DATABASE
router.get("/cart", function (req, res) {
    Carts.find({}).then(function (product) {
        res.send(product);
    });
});

//GET REQUEST TO THE DATABASE
router.get("/cart/:id", function (req, res) {
    Carts.findOne({_id: req.params.id}).then(function (product) {
        res.send(product);
    });
});

//DELETE REQUEST TO THE DATABASE
router.delete("/cart/:id", function (req, res) {
    Carts.findByIdAndRemove({_id: req.params.id}).then(function (product) {
        res.send(product);
    });
});

//POST REQUEST TO THE DATABASE
router.post("/cart", function (req, res) {
    Carts.find({'userid': req.body.userid, 'id': req.body.id}).then((cart) => {
        if (cart.length >= 1) {
            let newQuantity = cart[0].quantity + 1;
            Carts.findOneAndUpdate({
                id: req.body.id,
                userid: req.body.userid
            }, {$set: {quantity: newQuantity}}, {new: true}, (err, doc) => {
                if (err) {
                    res.send({'status': 'error', 'message': 'Something went wrong while updating your cart'});
                } else {
                    res.send({'status': 'success', 'message': 'Product quantity has been updated'});
                }
            });
        } else {
            Carts.create(req.body).then(function (product) {
                res.send({'status': 'success', 'message': 'Product has been added in your cart'});
            });
        }
    });
});

//POST REQUEST TO THE DATABASE TO ADD IN WISHLIST
router.post("/wishlist", function (req, res) {
    Wishlists.findOne(req.body).then(function (wishlist) {
        if (wishlist) {
            res.send({'status': 'error', 'message': 'You already have this product in your wishlist'});
        } else {
            Wishlists.create(req.body).then(function (wishlist) {
                res.send({'status': 'success', 'message': 'Product added to wishlist'});
            })
        }
    })
});

router.post("/checkout", function (req, res) {
    /*
    * first validate that the card provided exists in our database
    * and also it has specific balance.this is the role of a
    * payment gateway
    * */

    let amount = 0;
    req.body.products.forEach(function (value) {
        amount += (value.price * value.quantity);
    });

    exp_date = req.body.card.expiry.split('/');
    exp_month = exp_date[0];
    exp_year = exp_date[1];

    let cardDetails = {
        card_number: req.body.card.number,
        cvv: req.body.card.cvv,
        expiry_month: exp_month,
        expiry_year: exp_year
    };

    Cards.find({
        $and: [
            cardDetails
        ]
    }, function (error, card) {
        if (card.length >= 1) {
            if (card[0].balance >= amount) {
                let balance = card[0].balance - amount;
                Cards.findOneAndUpdate({
                    card_number: card[0].card_number
                }, {$set: {balance: balance}}, {new: true}, (err, doc) => {
                    req.body.products.forEach(function (product) {
                        let sales = {
                            product_id: product._id,
                            user_id: product.userid,
                            quantity: product.quantity
                        };
                        Sales.create(sales);
                        let cart = {
                            id: product.id,
                            userid: product.userid
                        };

                        //remove product from cart
                        Carts.remove({id: product.id, 'userid': product.userid}, function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
                    res.send({'status': 'success', 'message': 'Purchase has been successful'});
                });
            } else {
                res.send({'status': 'error', 'message': 'Low balance'});
            }
        } else {
            res.send({'status': 'error', 'message': 'Invalid card details'});
        }
    });
});

router.get('/wishlist/:id', function (req, res) {
    Wishlists.find({'user_id': req.params.id}).populate('Products').exec(function (err, products) {
        let matchingProducts = [];
        //the following isn't a very good idea to find matching records but can't think of anything else
        products.forEach(function (value) {
            matchingProducts.push(value.product_id);
        });
        Products.find({
            '_id': {$in: matchingProducts}
        }, function (err, results) {
            res.send(results);
        });
    });
});

//DELETE REQUEST TO THE DATABASE
router.delete("/wishlist/:product_id/:user_id", function (req, res) {
    Wishlists.findOneAndRemove({
        product_id: req.params.product_id,
        user_id: req.params.user_id
    }).then(function (product) {
        res.send({'status': 'success', 'product_id': req.params.product_id});
    });
});


/*
COMMENTS API
*/
router.get("/comments", function (req, res) {
    Comments.find({}).then(function (product) {
        res.send(product);

    });
});

//GET REQUEST TO THE DATABASE
router.get("/comments/:id", function (req, res) {
    Comments.findOne({_id: req.params.id}).then(function (product) {
        res.send(product);
    });
});

//DELETE REQUEST TO THE DATABASE
router.delete("/comments/:id", function (req, res) {
    Comments.findByIdAndRemove({_id: req.params.id}).then(function (product) {
        res.send(product);
    });
});

//POST REQUEST TO THE DATABASE
router.post("/comments", function (req, res) {
    Comments.create(req.body).then(function (product) {
        res.send(product);
        res.json(product);
    });
});

/*
SUGGESTIONS API
*/
//GET REQUEST TO THE DATABASE
router.get("/suggestions", function (req, res) {
    Sugestions.find({}).then(function (product) {
        res.send(product);
    });
});

//GET REQUEST TO THE DATABASE
router.get("/suggestions/:id", function (req, res) {
    Sugestions.findOne({_id: req.params.id}).then(function (product) {
        res.send(product);
    });
});

//DELETE REQUEST TO THE DATABASE
router.delete("/suggestions/:id", function (req, res) {
    Sugestions.findByIdAndRemove({_id: req.params.id}).then(function (product) {
        res.send(product);
    });
});

//POST REQUEST TO THE DATABASE
router.post("/suggestions", function (req, res) {
    Sugestions.create(req.body).then(function (product) {
        res.send(product);
        res.json(product);
    });
});


/*
USERS API
*/
router.post("/register", (req, res) => {
    // Form validation
    const {errors, isValid} = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            return res.status(400).json({email: "Email already exists"});
        }
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
            });
        });
    });
});

router.post("/login", (req, res) => {
    // Form validation
    const {errors, isValid} = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({email}).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({emailnotfound: "Email not found"});
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 3600 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({passwordincorrect: "Password incorrect"});
            }
        });
    });
});

module.exports = router;