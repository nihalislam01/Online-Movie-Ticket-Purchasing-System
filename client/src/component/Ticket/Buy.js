import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { errorMessage, serverLocation } from "../../const/Constants";

const updateTicketUrl = `${serverLocation}/ticket/update`;

function Buy({tickets, scheduleId}) {

    const [hasTicket, setHasTicket] = useState(false);
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("id");
    const unavailableSeats = ['B3', 'B12', 'C3', 'C12', 'D1', 'D2', 'D3', 'D12', 'D13', 'D14', 'E1', 'E2', 'E3', 'E12', 'E13', 'E14'];
    const [selectTickets, setSelectTickets] = useState([]);
    const [quantity, setQuantity] = useState([
        {
            type: 'Supreme',
            quantity: 0,
            price: 0
        },
        {
            type: 'Premium',
            quantity: 0,
            price: 0
        },
        {
            type: 'Regular',
            quantity: 0,
            price: 0
        }
    ])

    useEffect(()=>{
        if(tickets.length>0) {
            setHasTicket(true);
        }
    },[tickets])

    const buy = (ticket) => {
        if (!ticket.is_sold) {
            if (selectTickets.includes(ticket.seat_no)) {
                setSelectTickets(selectTickets.filter(selectticket => selectticket !== ticket.seat_no));
                setQuantity((prevQuantity) =>
                prevQuantity.map((item) =>
                item.type === ticket.type
                    ? { ...item, quantity: item.quantity-1, price: item.price-ticket.price }
                    : item
                )
            );
            } else {
                setSelectTickets([...selectTickets, ticket.seat_no]);
                setQuantity((prevQuantity) =>
                    prevQuantity.map((item) =>
                    item.type === ticket.type
                        ? { ...item, quantity: item.quantity+1, price: item.price+ticket.price }
                        : item
                    )
                );
            }
        }
    }

    const checkout = () => {
        axios.patch(updateTicketUrl, {tickets: selectTickets, schedule_id: scheduleId, user_id: user_id}, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            toast.success(response.data);
        }).catch(error=>{
            if (error.response.status===403) {
                window.location.href = "/login";
            } else {
                try {
                    if (error.response.status===403) {
                        window.location.href = '/login';
                    } else {
                        toast.error(error.response.data.error);
                    }
                } catch {
                    toast.error(errorMessage);
                    console.log(error);
                }
            }
        })
    }

    return (
        <>
            <Toaster />
            {!hasTicket && <h2 className="text-center m-4">Not Available</h2>}
            {[...Array(5)].map((_, index)=>(
                <div key={index} className="d-flex justify-content-center" >
                    {tickets.slice((index*14)+0, (index*14)+14).map((ticket, index)=>(
                        unavailableSeats.includes(ticket.seat_no) ? (<div key={index} style={{width: "40px", height: "30px"}} className="m-2"></div>
                        ) : (<button 
                            key={index} 
                            style={{width: "40px", height: "30px", 
                            backgroundColor: selectTickets.includes(ticket.seat_no) ? "green" : 
                            ticket.is_sold ? "gray": ticket.type==='Premium' ? "#90e0ef": 
                            ticket.type==='Supreme' ? "#e7c6ff": "#94d2bd", 
                            pointerEvents: ticket.is_sold ? "none": "auto"}} 
                            className="btn m-2 p-0" 
                            onClick={()=>buy(ticket)}>
                                {ticket.seat_no}
                            </button>)
                    ))}
                </div>
            ))}
            {hasTicket && <div className="m-4">
                <div className="d-flex justify-content-between">
                        <h6>Type</h6>
                        <h6>Quantity</h6>
                        <h6 className="text-end">Price</h6>
                </div>
                <hr />
                {quantity.map((type, index)=>(
                    <div key={index} className="d-flex justify-content-between">
                        <p>{type.type}</p>
                        <p>{type.quantity}</p>
                        <p className="text-end">{type.price}</p>
                    </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                    <h6>Total</h6>
                    <h6>{quantity.reduce((acc, item) => acc + item.quantity, 0)}</h6>
                    <h6>{quantity.reduce((acc, item) => acc + item.price, 0)}</h6>
                </div>
                <button className="btn btn-success form-control my-4" onClick={checkout}>Checkout</button>
            </div>}
        </>
    )
}

export default Buy;