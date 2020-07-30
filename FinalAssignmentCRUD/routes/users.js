'use strict';
var express = require('express');
var router = express.Router();
var articlesModel = require('../models/user');
var passport = require('passport');
var bcrypt = require('bcryptjs');


/* GET users listing. */
router.get('/', function (req, res) {
    try {

        //Retrieve all articles if there is any 
        articlesModel.find({}, function (err, foundArticles) {
            //Pass found articles from server to pug file
            res.render('users', { articles: foundArticles, user: req.user });
        });
    } catch (err) {
        console.log(err);
        res.render('index', { title: 'Express' });
    }

});
module.exports = router;
