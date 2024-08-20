const addTicket = (schedule_id) => {
    query = `insert into ticket(seat_no, is_sold, type, price, schedule_id) values('A1', 0, 'Premium', 400, ${schedule_id})`;
    const row = ["A", "B", "C", "D", "E"];
    var price = 400;
    var type = 'Premium';
    row.forEach(r=>{
        for(i=1;i<15;i++) {
            if(r==="A" && i===1) {
                console.log('Pass');
            } else if ((r==="B" || r==="C") && (i===1 || i===2 || i===13 || i===14)) {
                var temp = `, ('${r}${i}', 0, 'Premium', 400, ${schedule_id})`;
                query = query + temp;
            } else {
                var temp = `, ('${r}${i}', 0, '${type}', ${price}, ${schedule_id})`;
                query = query + temp;
            }
        }
        if (r==="A") {
            price = 500;
            type = 'Supreme';
        } else if (r==="C") {
            price = 350;
            type = 'Regular';
        }
    })
    return query;
}

const setTicket = (schedule_id, user_id, tickets) => {
    var query = `update ticket set is_sold=1, user_id=${user_id}, date=? where schedule_id=${schedule_id} and (seat_no='0'`;
    tickets.forEach(seat=>{
        var temp = ` or seat_no='${seat}'`;
        query = query + temp;
    })
    query = query + ")";
    return query;
}

module.exports = addTicket;
module.exports = setTicket;