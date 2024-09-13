const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const router = express.Router();
const sendNotification = require('../service/notification');
require('dotenv').config();

router.post('/add', authenticated.authenticated, (req, res) => {
    let movie = req.body;
    var query = "insert into movie(name, release_date, genre, image_url, trailer_url, is_available, description, admin_user_id) values(?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query,[movie.name, movie.release_date, movie.genre, movie.image_url, movie.trailer_url, movie.is_available, movie.description, movie.user_id], (err, results)=>{
        if(!err) {
            const message = "You have just added a new movie";
            sendNotification(message, movie.user_id);
            return res.status(200).json(message);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get-all', authenticated.authenticated, (req, res) => {
    var query = "select * from movie order by movie_id desc";
    connection.query(query, (err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', (req, res) => {
    const search = req.query.search;
    const value = search;
    var query = `select * from (select * from movie where is_available=1) T where T.name like '%${value}%' or T.release_date like '%${value}%' or T.description like '%${value}%' or T.genre like '%${value}%' order by T.movie_id desc`;
    connection.query(query, (err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get/:id', (req, res) => {
    const id = req.params.id;
    var query = "select * from movie where movie_id=?";
    connection.query(query, [id], (err, results)=>{
        if(!err) {
            results[0].release_date = results[0].release_date.toISOString().substring(0, 10);
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', authenticated.authenticated, (req, res) => {
    let movie = req.body;
    var query = "update movie set name=?, release_date=?, genre=?, image_url=?, trailer_url=?, is_available=?, description=? where movie_id=?";
    connection.query(query,[movie.name, movie.release_date, movie.genre, movie.image_url, movie.trailer_url, movie.is_available, movie.description, movie.movie_id], (err, results)=>{
        if(!err) {
            if (!movie.is_available) {
                query = "delete from wishlist where movie_id=?";
                connection.query(query,[movie.movie_id], (err, results)=>{
                    if (!err) {
                        const message = "You have just updated a movie";
                        sendNotification(message, movie.user_id);
                        return res.status(200).json(message);
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                const message = "You have just updated a movie";
                sendNotification(message, movie.user_id);
                return res.status(200).json(message);
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "delete from review where movie_id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err) {
            query = "delete from wishlist where movie_id=?";
            connection.query(query,[id],(err,results)=>{
                if(!err) {
                    query = "delete from movie where movie_id=?";
                    connection.query(query,[id],(err,results)=>{
                        if(!err) {
                            const message = "You have just deleted a movie";
                            return res.status(200).json(message);
                        } else {
                            return res.status(400).json({error: {errorMessage: "Movie has already tickets"}});
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

module.exports = router;