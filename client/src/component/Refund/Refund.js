import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";

const pageTitle = "Refund";
const refundUrl = `${serverLocation}/ticket/refund`;

function Refund({tickets}) {
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const refund = (id) => {
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
            toast.success(response.data);
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
            <CommonHelmet title={pageTitle} />
            <Toaster />
            <div className="container m-4">
                <h2>Refund Ticket</h2>
                <hr />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Hall</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Seat No</th>
                            <th>Price</th>
                            <th className="text-end"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {tickets.map(ticket=>(
                        <tr key={ticket.ticket_id}>
                            <td>{ticket.ticket_id}</td>
                            <td>{ticket.name}</td>
                            <td>{ticket.branch}</td>
                            <td>{ticket.hall}</td>
                            <td>{ticket.date.substring(0,10)}</td>
                            <td>{ticket.time}</td>
                            <td>{ticket.type}</td>
                            <td>{ticket.seat_no}</td>
                            <td>{ticket.price}</td>
                            <td className="text-end"><button className="btn btn-outline-danger" onClick={()=>refund(ticket.ticket_id)}>Refund</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Refund;