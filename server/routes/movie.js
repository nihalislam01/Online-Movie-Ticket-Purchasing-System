const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const router = express.Router();
//const sendNotification = require('../service/notification');
require('dotenv').config();

router.post('/add-movie', authenticated.authenticated, (req, res) => {
    let movie = req.body;
    var query = "insert into movie(name, release_date, genre, image_url, trailer_url, is_available, description, admin_user_id) values(?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query,[movie.name, movie.release_date, movie.genre, movie.image_url, movie.trailer_url, movie.is_available, movie.description, movie.user_id], (err, results)=>{
        if(!err) {
            return res.status(200).json("Movie added");
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get-all-movie', authenticated.authenticated, (req, res) => {
    var query = "select * from movie";
    connection.query(query, (err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get-movie', (req, res) => {
    const search = req.query.search;
    const value = search;
    var query = `select * from (select * from movie where is_available=1) T where T.name like '%${value}%' or T.release_date like '%${value}%' or T.description like '%${value}%' or T.genre like '%${value}%'`;
    connection.query(query, (err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get-movie/:id', (req, res) => {
    const id = req.params.id;
    var query = "select * from movie where movie_id= ? ";
    connection.query(query, [id], (err, results)=>{
        if(!err) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.post('/add-to-wishlist', authenticated.authenticated, (req, res)=>{
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
                        return res.status(200).json("Moive added");
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

router.get('/get-wishlist/:id', authenticated.authenticated, (req, res)=>{
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

router.delete('/remove-wishlist/:user_id/:movie_id', authenticated.authenticated, (req, res)=>{
    const user_id = req.params.user_id;
    const movie_id = req.params.movie_id;
    var query = "delete from wishlist where user_id=? and movie_id=?";
    connection.query(query,[user_id, movie_id],(err, results)=>{
        if (!err) {
            return res.sendStatus(200);
        } else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;