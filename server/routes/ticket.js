const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const sendNotification = require('../service/notification');
const setTicket = require('../service/ticket');
const addTicket = require('../service/ticket');
const router = express.Router();
require('dotenv').config();

router.get('/get/:id',authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "select * from ticket where schedule_id=? order by ticket_id";
    connection.query(query,[id],(err, results)=>{
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update',authenticated.authenticated, (req, res)=>{
    const body = req.body;
    var query = setTicket(body.schedule_id, body.user_id, body.tickets);
    connection.query(query,(err, results)=>{
        if (!err) {
            return res.status(200).json("Ticket bought successfully");
        } else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;