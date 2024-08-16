const connection = require('../connection');

const sendNotification = (report, user_id) => {
    const date = new Date();
    var query = "insert into notification(report, date, user_id) values(?,?,?)";
    connection.query(query,[report, date, user_id],(err,results)=>{
        console.log("Notification Sent");
    })
}

module.exports = sendNotification;