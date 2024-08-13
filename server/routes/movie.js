const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const router = express.Router();
//const sendNotification = require('../service/notification');
require('dotenv').config();

router.post('/add-movie', authenticated.authenticated, (req, res) => {
    let movie = req.body;
    var query = "insert into movie(name, release_date, genre, image_url, trailer_url, is_available, description, user_id) values(?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query,[movie.name, movie.release_date, movie.genre, movie.image_url, movie.trailer_url, movie.is_available, movie.description, movie.user_id], (err, results)=>{
        if(!err) {
            return res.status(200).json("Movie added");
        } else {
            return res.status(500);
        }
    })
})

router.get('/get-all-movie', authenticated.authenticated, (req, res) => {
    var query = "select * from movie";
    connection.query(query, (err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500);
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
            return res.status(500);
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
            return res.status(500);
        }
    })
})

module.exports = router;