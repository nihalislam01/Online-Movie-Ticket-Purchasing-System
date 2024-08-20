const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const sendNotification = require('../service/notification');
const setTicket = require('../service/ticket');
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

router.get('/get-by-user/:id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = 'select t.schedule_id, s.branch, s.hall, s.date, s.time, m.movie_id, m.name from (select distinct schedule_id from ticket where user_id=?) t inner join schedule s on t.schedule_id=s.schedule_id inner join movie m on s.movie_id=m.movie_id';
    connection.query(query, [id], (err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get-by-schedule/:id/:user_id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    const user_id = req.params.user_id;
    var query = 'select t.ticket_id, t.type, t.price, t.seat_no, s.date, s.time, s.branch, s.hall, m.name from ticket t inner join schedule s on t.schedule_id=s.schedule_id inner join movie m on s.movie_id=m.movie_id where t.schedule_id=? and t.user_id=? and t.is_sold=1';
    connection.query(query, [id, user_id], (err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update',authenticated.authenticated, (req, res)=>{
    const body = req.body;
    const date = new Date();
    var query = setTicket(body.schedule_id, body.user_id, body.tickets);
    connection.query(query,[date],(err, results)=>{
        if (!err) {
            const message = "You have just bought ticket";
            sendNotification(message, body.user_id);
            return res.status(200).json(message);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/refund',authenticated.authenticated, (req, res)=>{
    const body = req.body;
    var query = "select date from ticket where ticket_id=?";
    connection.query(query,[body.id],(err, results)=>{
        if (!err) {
            const expiryDate = new Date(results[0].date);
            const currentDate = new Date();
            const diffTime = currentDate - expiryDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            if (diffDays > 3) {
                return res.status(400).json({error: "You cannot make refund after 72 hours of buying ticket"});
            } else {
                query = "update ticket set user_id=null, date=null, is_sold=0 where ticket_id=?";
                connection.query(query,[body.id],(err, results)=>{
                    if(!err) {
                        if (diffDays>2) {
                            sendNotification(`You got 25% refund for ticket ${body.id} for refunding after 48 hours`, body.user_id);
                            return res.status(200).json("You get 25% refund after 48 hours");
                        } else if (diffDays<1) {
                            sendNotification(`You got 75% refund for ticket ${body.id} for refunding before 24 hours`, body.user_id);
                            return res.status(200).json("You get 75% refund before 24 hours");
                        } else {
                            sendNotification(`You got 50% refund for ticket ${body.id} for refunding after 24 hours`, body.user_id);
                            return res.status(200).json("You get 50% refund after 24 hours");
                        }
                    } else {
                        return res.status(500).json(err);
                    }
                })
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;