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

Router.get('/:id', (req, res, next) => {

    var error = false;
    Tw.findById({_id: req.params.id})
        .exec()
        .then(tw => {
            res.render('edit', {
                tw: tw,
                error: error
            });
        })
        .catch(err => {
            res.status(500).json({error: err});    
        })
});

Router.delete('/:id', (req, res, next) => {
    Tw.deleteOne({_id: req.params.id})
            .exec()
            .then(response => {
                var error = false;
                Tw.find()
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
            })
            .catch(err => {
                res.status(500).json({error: err});    
            })

});

module.exports = Router;