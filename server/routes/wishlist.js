const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const router = express.Router();
const sendNotification = require('../service/notification');
require('dotenv').config();

router.post('/add', authenticated.authenticated, (req, res)=>{
    const body = req.body;
    var query = "select * from wishlist where user_id=? and movie_id=?";
    connection.query(query,[body.user_id, body.movie_id],(err, results)=>{
        if(!err) {
            if(results.length > 0) {
                return res.status(200).json("Moive Already added");
            } else {
                query = "insert into wishlist(user_id, movie_id) values(?, ?)";
                connection.query(query,[body.user_id, body.movie_id],(err, results)=>{
                    if(!err) {
                        const message = "Movie added to wishlist";
                        sendNotification(message, body.user_id);
                        return res.status(200).json(message);
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
    const search = req.query.search;
    const value = search;
    var query = `select * from movie m inner join wishlist w on m.movie_id=w.movie_id where w.user_id=? and (m.name like '%${value}%' or m.release_date like '%${value}%' or m.description like '%${value}%' or m.genre like '%${value}%')`;
    connection.query(query,[id],(err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:user_id/:movie_id', authenticated.authenticated, (req, res)=>{
    const user_id = req.params.user_id;
    const movie_id = req.params.movie_id;
    var query = "delete from wishlist where user_id=? and movie_id=?";
    connection.query(query,[user_id, movie_id],(err, results)=>{
        if (!err) {
            const message = "Movie removed from wishlist";
            sendNotification(message, user_id);
            return res.status(200).json(message);
        } else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;