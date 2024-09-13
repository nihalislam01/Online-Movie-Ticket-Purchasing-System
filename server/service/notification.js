const connection = require('../connection');

const sendNotification = (description, user_id) => {
    const date = new Date();
    var query = "insert into notification(description, date, user_id) values(?,?,?)";
    connection.query(query,[description, date, user_id],(err,results)=>{
        console.log("Notification Sent");
    })
}

module.exports = sendNotification;