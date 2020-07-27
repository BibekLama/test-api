const express = require('express');

const mongoose = require('mongoose');

const Router = express.Router();

const Tw = require('../../models/Tw');


Router.get('/', (req, res, next) => {

    Tw.find()
        .lean()
        .exec()
        .then(tws => {
            res.status(200).send(tws);
        })
        .catch(err => {
            res.status(500).json({error: err});    
        })
});

Router.get('/:id', (req, res, next) => {
    console.log(req.params.id);
    // data = users.filter(item => item.id == req.params.id);
    Tw.findById({_id: req.params.id})
        .exec()
        .then(tw => {
            res.status(200).send(tw);
        })
        .catch(err => {
            res.status(500).json({error: err});    
        })
});


Router.post('/', (req, res, next) => {
    if (req.body.message && req.body.message != "") {

        const tw = new Tw({
            _id: new mongoose.Types.ObjectId(),
            message: req.body.message
        })

        tw.save()
            .then(tw => {
                res.status(200).send(tw);
            })
            .catch(err => {
                res.status(500).json({error: err});    
            })

    } else {

        res.status(500).json({error: "Please put some values"});   

    }
});

Router.patch('/:id', (req, res, next) => {
    if (req.body.message && req.body.message != "") {

        Tw.updateOne({_id: req.params.id}, {$set: req.body})
            .exec()
            .then(response => {
                res.status(200).send({
                    message:"Update success",
                    data: req.body
                });
            })
            .catch(err => {
                res.status(500).json({error: err});    
            })

    } else {

        res.status(500).json({error: "Please put some values"});   

    }
});

Router.delete('/:id', (req, res, next) => {
    Tw.deleteOne({_id: req.params.id})
            .exec()
            .then(response => {
                res.status(200).send({
                    message:"Delete success"
                });
            })
            .catch(err => {
                res.status(500).json({error: err});    
            })

});

module.exports = Router;