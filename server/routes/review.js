const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const router = express.Router();
//const sendNotification = require('../service/notification');
require('dotenv').config();

router.post('/add', authenticated.authenticated, (req, res) =>{
    const review = req.body;
    var query = "select * from review where user_id=? and movie_id=?";
    connection.query(query,[review.user_id, review.movie_id],(err, results)=>{
        if (!err) {
            if(results.length > 0) {
                return res.status(400).json({error: "You have already reviewed this movie"});
            } else {
                var report = review.report;
                if (report.trim().length === 0) {
                    report = null
                }
                query = "insert into review(report, rate, user_id, movie_id) values(?,?,?,?)";
                connection.query(query,[report, review.rate, review.user_id, review.movie_id],(err, results)=>{
                    if(!err) {
                        return res.status(200).json("Review added");
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

router.get("/get-by-movie/:id", (req, res)=>{
    const id = req.params.id;
    var query = "select r.rate, r.report, u.username from review r inner join user u on r.user_id=u.user_id where r.movie_id=? order by r.review_id desc";
    connection.query(query,[id],(err,results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get("/get-by-user/:id", authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "select r.review_id, r.rate, r.report, m.name from review r inner join movie m on r.movie_id=m.movie_id where r.user_id=? order by r.review_id desc";
    connection.query(query,[id],(err,results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get("/get-analytics/:id", (req, res)=>{
    const id = req.params.id;
    var query = "select count(*) as rate_count, sum(rate) as rate_sum from review where movie_id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.delete("/delete/:id", authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "delete from review where review_id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err) {
            return res.status(200).json("Review deleted");
        } else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;