'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');
var articlesModel = require('../models/articles');
var bcrypt = require('bcryptjs');
var formidable = require('formidable');

/*POST for login*/
//Try to login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/*POST for register*/
router.post('/register', function (req, res) {
    //Insert user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            password: hash
        }
        //Check if user already exists
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err) console.log(err);
            if (user.length) console.log('Username already exists please login.');
            const newUser = new userModel(registerUser);
            newUser.save(function (err) {
                console.log('Inserting');
                if (err) console.log(err);
                req.login(newUser, function (err) {
                    console.log('Trying to login');
                    if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    })
});

/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
});

/* GET Register page. */
router.get('/register', function (req, res) {
    res.render('register', { title: 'register' });
}); 

/* GET read page. */
router.get('/', function (req, res) {
    try {
        //Retrieve all articles if there is any 
        articlesModel.find({}, function (err, foundArticles) {
            console.log(foundArticles);
            //Pass found articles from server to pug file
            res.render('index', { user: req.user, articles: foundArticles });
        });
    } catch (err) {
        console.log(err);
        res.render('login', { title: 'Login' });
    }
});

/* GET insert page. */
router.get('/insert', function (req, res) {
    res.render('insert', { user: req.user });
});

router.get('/update', function (req, res) {
    res.render('update', { user: req.user });
});


/* POST insert page */
router.post('/insert', function (req, res) {
    //Create a new article using the Articles Model Schema
    const article = new articlesModel({ name: req.body.name, description: req.body.description, price: req.body.price });
    //Insert article into DB
    article.save(function (err) {
        console.log(err);
    });
    res.redirect('/');
});

/* GET update page */
router.get('/update/:id', function (req, res) {
    articlesModel.findById(req.params.id, function (err, foundArticle) {
        if (err) console.log(err);
        //Render update page with specific article
        res.render('update', { user: req.user, article: foundArticle })
    })
});

/* POST update page */
router.post('/update', function (req, res) {
    console.log(req.body);
    //Find and update by id
    articlesModel.findByIdAndUpdate(req.body.id, { name: req.body.name, description: req.body.description, price: req.body.price }, function (err, model) {
        console.log(err);
        res.redirect('/');
    });
});

/* POST delete page */
router.post('/delete/:id', function (req, res) {
    //Find and delete article
    articlesModel.findByIdAndDelete(req.params.id, function (err, model) {
        res.redirect('/')
    });
});

/* Get for search page */
router.get('/search', function (req, res) {
    res.render('search', { user: req.user });
});

/* Post for search */
router.post('/search', function (req, res) {
    var form = new formidable.IncomingForm();
    var name = req.body.str;
    articlesModel.find({ name: name }, function (err, foundArticles) {
        console.log(err);
        console.log(foundArticles);
        //Passing found articles from server to search.pug file
        res.render('search', { articles: foundArticles, user: req.user });
    });
});

module.exports = router;
