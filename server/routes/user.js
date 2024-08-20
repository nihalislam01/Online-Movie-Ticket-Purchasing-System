const express = require('express');
const connection = require('../connection');
const encoder = require('../service/encode');
const authenticated = require('../service/authentication');
const jwt = require('jsonwebtoken');
const router = express.Router();
const sendNotification = require('../service/notification');
require('dotenv').config();

router.post('/register', (req, res) => {
    let user = req.body;
    var query = "select username from user where username=?";
    connection.query(query,[user.username],(err,results)=> {
        if (!err) {
            if(results.length <= 0) {
                query = "insert into user(name, username, password, role) values(?,?,?,'USER')";
                connection.query(query,[user.name,user.username,encoder(user.password)],(err, results) => {
                    if (!err) {
                        query = "select user_id from user where username=?";
                        connection.query(query,[user.username],(err, results)=>{
                            if(!err){
                                sendNotification('Welcome to Online Movie Ticket Purchasing System', results[0].user_id);
                                return res.status(200).json("Signup successful");
                            } else {
                                return res.status(500).json(err);
                            }
                        })
                    } else {
                        return res.status(500).json(err);
                    }
                });
            }
            else {
                return res.status(400).json({error: {errorMessage: "Username already exists"}});
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.post('/authenticate', (req, res) => {
    let user = req.body;
    var query = "select user_id, username, password, role from user where username=?";
    connection.query(query,[user.username],(err,results) => {
        if(!err) {
            if (results.length > 0) {
                const bcrypt = require('bcrypt');
                bcrypt.compare(user.password, results[0].password, (err, result) => {
                    if (!err) {
                        if (result) {
                            const user = {
                                user_id: results[0].user_id,
                                username: results[0].username,
                                role: results[0].role
                              };
                            const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'8h'});
                            return res.status(200).json({token: accessToken, role: results[0].role, id: results[0].user_id});
                        } else {
                            return res.status(400).json({error: {errorMessage: "Password did not match"}})
                        }
                    } else {
                        return res.status(500).json(err);
                    }
                })
            } else {
                return res.status(400).json({error:{errorMessage:  "Username does not exists"}});
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get("/get/:id", authenticated.authenticated, (req, res)=>{
    const id = req.params.id;
    var query = "select user_id, name, username from user where user_id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch("/update", authenticated.authenticated, (req, res)=>{
    const user = req.body;
    var query = "update user set name=?, username=? where user_id=?";
    connection.query(query,[user.name, user.username, user.id],(err, results)=>{
        if(!err) {
            const message = "Your have just updated your profile";
            sendNotification(message, user.id);
            return res.status(200).json(message);
        } else {
            if(err.code==="ER_DUP_ENTRY") {
                return res.status(400).json({error: {errorMessage: "Try a different username"}});
            } else {
                return res.status(500).json(err);
            }
        }
    })
})

router.patch("/change-password", authenticated.authenticated, (req, res)=>{
    const user = req.body;
    var query = "select password from user where user_id=?";
    connection.query(query,[user.id],(err, results)=>{
        if(!err) {
            const bcrypt = require('bcrypt');
            bcrypt.compare(user.old_password, results[0].password, (err, result) => {
                if(!err) {
                    if(result) {
                        query = "update user set password=? where user_id=?";
                        connection.query(query, [encoder(user.new_password), user.id], (err, results)=>{
                            if(!err) {
                                const message = "You have just changed your password";
                                sendNotification(message, user.id);
                                return res.status(200).json(message);
                            } else {
                                return res.status(500).json(err);
                            }
                        })
                    } else {
                        return res.status(400).json({error: {errorMessage: "Old Password did not match"}});
                    }
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