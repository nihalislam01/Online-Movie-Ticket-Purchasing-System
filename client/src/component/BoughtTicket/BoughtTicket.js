import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { errorMessage, serverLocation } from "../../const/Constants";
import PDF from "../PDF/PDF";
import Refund from "../Refund/Refund";

const ticketsUrl = `${serverLocation}/ticket/get-by-schedule/`;

function BoughtTicket(props) {

    const {id} = useParams();
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [tickets, setTickets] = useState([]);

    useEffect(()=>{
        axios.get(ticketsUrl+id+'/'+user_id, {
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
    },[user_id, id, token])

    return (
        <>
            <Toaster />
            {props.isPDF && <PDF tickets={tickets}/>}
            {!props.isPDF && <Refund tickets={tickets}/>}
        </>
    )

}

export default BoughtTicket;