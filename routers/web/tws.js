const express = require('express');

const mongoose = require('mongoose');

const Router = express.Router();

const Tw = require('../../models/Tw');

var list = (req, res, msg = '', data = '') => {
    
    var error = false;
    Tw.find()
        .sort({'createdAt': -1})
        .lean()
        .exec()
        .then(tws => {
            res.render('tws', {
                tws: tws,
                msg: msg,
                error: error,
                data: data
            });
        })
        .catch(err => {
            error = err;
            console.error(error);
        });
};

Router.get('/', (req, res) => {
    list(req, res);
});

Router.get('/msg/:type/:msg', (req, res) => {
    var msg = {
        type: req.params.type,
        message: req.params.msg
    };
    list(req, res, msg);
});

Router.post('/', (req, res) => {

    var error = false;
    if (req.body.message && req.body.message != "") {

        const tw = new Tw({
            _id: new mongoose.Types.ObjectId(),
            message: req.body.message
        })

        tw.save()
            .then(tw => {
               res.redirect('/tws/msg/success/Added Successfully');
            })
            .catch(err => {
                console.log(err);
                res.redirect('/tws/msg/danger/Could not add');
            })

    } else {
        res.redirect('/tws/msg/warning/Please put some value');  
    }
});


Router.get('/action/:type/:id', (req, res) => {
    
    Tw.findById({_id: req.params.id})
        .exec()
        .then(tw => {
            var data = {
                type: req.params.type,
                id: req.params.id
            }
            list(req, res, msg = '', data);
        })
        .catch(err => {
            res.status(500).json({error: err});    
        })
});

Router.post('/:id', (req, res, next) => {
    if (req.body.message && req.body.message != "") {

        Tw.updateOne({_id: req.params.id}, {$set: req.body})
            .exec()
            .then(response => {
                res.redirect('/tws/msg/success/Updated Successfully');
            })
            .catch(err => {
                console.log(err)  
                res.redirect('/tws/msg/danger/Could not update');  
            })

    } else {

        res.redirect('/tws/msg/warning/Please put some value');     

    }
});

Router.get('/delete/:id', (req, res) => {

    Tw.remove({_id: req.params.id})
            .exec()
            .then(response => {
                res.redirect('/tws/msg/success/Deleted Successfully');
            })
            .catch(err => {
                console.log(err);
                res.redirect('/tws/msg/danger/Could not delete');    
            });

});

Router.get('/api/consume', (req, res) => {
    res.render('api');
});

module.exports = Router;