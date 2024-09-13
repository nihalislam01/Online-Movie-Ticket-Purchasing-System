const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const sendNotification = require('../service/notification');
const {setTicket, getSum} = require('../service/ticket');
const router = express.Router();
require('dotenv').config();

router.get('/get-all/:id',authenticated.authenticated, (req, res)=>{
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

router.get('/get/:id/:user_id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    const user_id = req.params.user_id;
    var query = 'select t.ticket_id, t.seat_no, t.type, t.price, s.branch, s.hall, s.date, s.time, m.name from ticket t inner join schedule s on t.schedule_id=s.schedule_id inner join movie m on s.movie_id=m.movie_id where t.payment_id=?';
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
    query = "insert into payment(date, amount, user_id) values(?, ?, ?)";
    connection.query(query, [date, body.amount, body.user_id], (err, results) => {
        if(!err) {
            query = "select payment_id from payment order by payment_id desc limit 1";
            connection.query(query, (err, results)=>{
                if (!err) {
                    const payment_id = results[0].payment_id;
                    query = setTicket(body.schedule_id, payment_id, body.tickets);
                    connection.query(query,(err, results)=>{
                        if (!err) {
                            const message = "You have just bought ticket";
                            sendNotification(message, body.user_id);
                            return res.status(200).json(message);
                        } else {
                            return res.status(500).json(err);
                        }
                    })
                } else {
                    return res.status(500).json(err);
                }
            })
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/refund',authenticated.authenticated, (req, res)=>{
    const body = req.body;
    var query = "select date from payment where payment_id=?";
    connection.query(query,[body.id],(err, results)=>{
        if (!err) {
            const expiryDate = new Date(results[0].date);
            const currentDate = new Date();
            const diffTime = currentDate - expiryDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            if (diffDays > 3) {
                return res.status(400).json({error: {errorMessage: "You cannot make refund after 72 hours of buying ticket"}});
            } else {
                query = "update ticket set payment_id=null, is_sold=0 where payment_id=?";
                connection.query(query,[body.id],(err, results)=>{
                    if(!err) {
                        query = "delete from payment where payment_id=?";
                        connection.query(query, [body.id],(err, results)=>{
                            if(!err) {
                                if (diffDays>2) {
                                    sendNotification(`You got 25% refund for refunding after 48 hours`, body.user_id);
                                    return res.status(200).json("You get 25% refund");
                                } else if (diffDays<1) {
                                    sendNotification(`You got 75% refund for refunding before 24 hours`, body.user_id);
                                    return res.status(200).json("You get 75% refund");
                                } else {
                                    sendNotification(`You got 50% refund for refunding after 24 hours`, body.user_id);
                                    return res.status(200).json("You get 50% refund");
                                }
                            } else {
                                return res.status(500).json(err);
                            }
                        })
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