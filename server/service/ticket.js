const addTicket = (schedule_id, hall) => {
    var price = 400;
    if (hall==='Hall 01 (VIP)') {
        price = 1000;
    } else if (hall==='Hall 03 (Regular)') {
        price = 300;
    }
    query = `insert into ticket(seat_no, is_sold, type, price, schedule_id) values('A1', 0, 'Premium', ${price}, ${schedule_id})`;

    const row = ["A", "B", "C", "D", "E"];
    var type = 'Premium';

    row.forEach(r=>{
        for(i=1;i<15;i++) {
            if(r==="A" && i===1) {
                console.log('Pass');
            } else if ((r==="B" || r==="C") && (i===1 || i===2 || i===13 || i===14)) {
                var temp_price = 400;
                if (hall==='Hall 01 (VIP)') {
                    temp_price = 1000;
                } else if (hall==='Hall 03 (Regular)') {
                    temp_price = 300;
                }
                var temp = `, ('${r}${i}', 0, 'Premium', ${temp_price}, ${schedule_id})`;
                query = query + temp;
            } else {
                var temp = `, ('${r}${i}', 0, '${type}', ${price}, ${schedule_id})`;
                query = query + temp;
            }
        }
        if (r==="A") {
            if (hall==='Hall 01 (VIP)') {
                price = 1200;
            } else if (hall==='Hall 03 (Regular)') {
                price = 350;
            } else {
                price = 500;
            }
            type = 'Supreme';
        } else if (r==="C") {
            if (hall==='Hall 01 (VIP)') {
                price = 900;
            } else if (hall==='Hall 03 (Regular)') {
                price = 250;
            } else {
                price = 350;
            }
            type = 'Regular';
        }
    })
    return query;
}

const setTicket = (schedule_id, payment_id, tickets) => {
    var query = `update ticket set is_sold=1, payment_id=${payment_id} where schedule_id=${schedule_id} and (seat_no='0'`;
    tickets.forEach(seat=>{
        var temp = ` or seat_no='${seat}'`;
        query = query + temp;
    })
    query = query + ")";
    return query;
}

module.exports = {
    addTicket, 
    setTicket
};