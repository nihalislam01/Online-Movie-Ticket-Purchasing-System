import { useEffect, useState } from 'react';
import axios from "axios";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import {errorMessage, serverLocation} from '../../const/Constants';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const getMyTicketUrl = `${serverLocation}/payment/get/`;
const refundUrl = `${serverLocation}/ticket/refund`;
const pagetitle = "My Ticket";

function MyTicket() {

    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [tickets, setTickets] = useState([]);

    useEffect(()=>{
        const getTicket = () => {
            axios.get(getMyTicketUrl+user_id, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            }).then(response=>{
                setTickets(response.data);
            }).catch(error=>{
                try {
                    if (error.response.status===403) {
                        window.location.href = '/login';
                    } else {
                        toast.error(error.response.data.error.errorMessage);
                    }
                } catch {
                    toast.error(errorMessage);
                    console.log(error);
                }
            })
        }
        getTicket();
    },[user_id, token])

    const refundTicket = (id) => {
        const refundBody = {
            id: id,
            user_id: user_id
        }
        axios.patch(refundUrl,refundBody,{
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            const toastId = toast.loading('Validating...');

            setTimeout(() => {
              toast.success(response.data, {
                id: toastId,
              });
            }, 4000);
        }).catch(error=>{
            try {
                if (error.response.status===403) {
                    window.location.href = '/login';
                } else {
                    toast.error(error.response.data.error.errorMessage);
                }
            } catch {
                toast.error(errorMessage);
                console.log(error);
            }
        })
    }
    return (
        <>
            <CommonHelmet title={pagetitle} />
            <Toaster />
            <div className='container mt-4'>
                <h2>My Tickets</h2>
                <hr />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Branch</th>
                            <th>Hall</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Purchase Value</th>
                            <th className='text-end'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket, index)=>(
                            <tr key={index}>
                                <td>{ticket.name}</td>
                                <td>{ticket.branch}</td>
                                <td>{ticket.hall}</td>
                                <td>{ticket.date.substring(0, 10)}</td>
                                <td>{ticket.time}</td>
                                <td>{ticket.amount}</td>
                                <td className='text-end'>
                                    <Link to={`/pdf/${ticket.payment_id}`}><button className='btn btn-outline-primary mx-2'>PDF</button></Link>
                                    <button className='btn btn-outline-success mx-2' onClick={()=>refundTicket(ticket.payment_id)}>Refund</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default MyTicket;