const express = require('express');
const connection = require('../connection');
const authenticated = require('../service/authentication');
const router = express.Router();
require('dotenv').config();

router.get('/get/:id', authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = 'select distinct t.payment_id, p.amount, s.hall, s.branch, s.date, s.time, m.name from payment p inner join ticket t on p.payment_id=t.payment_id inner join schedule s on t.schedule_id=s.schedule_id inner join movie m on s.movie_id=m.movie_id where p.user_id=? order by t.payment_id desc';
    connection.query(query, [id], (err, results)=>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;