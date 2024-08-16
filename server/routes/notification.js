const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const router = express.Router();
require('dotenv').config();

router.get('/get/:id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "select * from notification where user_id=?";
    connection.query(query,[id],(err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "delete from notification where notification_id=?";
    connection.query(query,[id],(err, results)=>{
        if(!err) {
            return res.status(200).json("Notification deleted");
        } else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;