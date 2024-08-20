const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const sendNotification = require('../service/notification');
const {addTicket} = require('../service/ticket');
const router = express.Router();
require('dotenv').config();

router.post('/add', authenticated.authenticated, (req, res)=>{
    const schedule = req.body;
    var query = "select schedule_id from schedule where branch=? and hall=? and date=? and time=?";
    connection.query(query,[schedule.branch, schedule.hall, schedule.date, schedule.time],(err, results)=>{
        if(!err) {
            if(results.length > 0) {
                return res.status(400).json({error: {errorMessage: "Hall already booked"}});
            } else {
                query = "insert into schedule(branch, hall, date, time, admin_user_id, movie_id) values(?,?,?,?,?,?)";
                connection.query(query,[schedule.branch, schedule.hall, schedule.date, schedule.time, schedule.user_id, schedule.movie_id],(err, results)=>{
                    if(!err) {
                        query = "select * from schedule order by schedule_id desc limit 1";
                        connection.query(query,(err, results)=>{
                            if(!err) {
                                const schedule_id = results[0].schedule_id;
                                query = addTicket(schedule_id);
                                connection.query(query,(err, results)=>{
                                    if(!err) {
                                        const message = "You have just added a new schedule and tickets";
                                        sendNotification(message, schedule.user_id);
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
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get/:id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "select * from schedule s inner join movie m on s.movie_id=m.movie_id where s.movie_id=? order by s.date desc";
    connection.query(query,[id],(err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.post('/get-id', authenticated.authenticated, (req, res)=>{
    const schedule = req.body;
    var query = "select schedule_id from schedule where branch=? and hall=? and date=? and time=? and movie_id=?";
    connection.query(query,[schedule.branch, schedule.hall, schedule.date, schedule.time, schedule.movie_id],(err, results)=>{
        if(!err) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "select ticket_id from ticket where schedule_id=? and is_sold=1";
    connection.query(query,[id],(err, results)=>{
        if (!err) {
            if(results.length > 0) {
                return res.status(400).json({error: {errorMessage: "Tickets already been sold"}});
            } else {
                query = "delete from ticket where schedule_id=?";
                connection.query(query,[id],(err, results)=>{
                    if(!err) {
                        query = "delete from schedule where schedule_id=?";
                        connection.query(query,[id],(err, results)=>{
                            if(!err) {
                                return res.status(200).json("Schedule deleted");
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