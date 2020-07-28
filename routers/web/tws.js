const express = require('express');

const mongoose = require('mongoose');

const Router = express.Router();

const Tw = require('../../models/Tw');

Router.get('/', (req, res, next) => {

    var error = false;
    Tw.find()
        .sort({'createdAt': -1})
        .lean()
        .exec()
        .then(tws => {
            res.render('tws', {
                tws: tws,
                error: error
            });
        })
        .catch(err => {
            error = err;
            console.error(error);
        });
});

Router.post('/', (req, res, next) => {

    var error = false;
    if (req.body.message && req.body.message != "") {

        const tw = new Tw({
            _id: new mongoose.Types.ObjectId(),
            message: req.body.message
        })

        tw.save()
            .then(tw => {
               res.redirect('/')
            })
            .catch(err => {
                res.status(500).json({error: err});    
            })

    } else {

        res.status(500).json({error: "Please put some values"});   

    }
});


Router.get('/edit/:id', (req, res, next) => {

    var error = false;
    Tw.findById({_id: req.params.id})
        .exec()
        .then(tw => {
            res.render('edit', {id: req.params.id});
        })
        .catch(err => {
            res.status(500).json({error: err});    
        })
});

Router.post('/delete', (req, res, next) => {
    Tw.deleteOne({_id: req.body.id})
            .exec()
            .then(response => {
                var error = false;
                Tw.find()
                    .lean()
                    .exec()
                    .then(tws => {
                        res.redirect('/');
                    })
                    .catch(err => {
                        error = err;
                        console.error(error);
                    });
            })
            .catch(err => {
                res.status(500).json({error: err});    
            })

});

module.exports = Router;