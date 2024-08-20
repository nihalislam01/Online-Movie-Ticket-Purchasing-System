import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { errorMessage, serverLocation } from "../../const/Constants";
import Buy from "../Ticket/Buy";
import TicketInput from "../Ticket/TicketInput";
import Info from "./Info";

const movieUrl = `${serverLocation}/movie/get/`;
const analyticsUrl = `${serverLocation}/review/get-analytics/`;
const getScheduleIdUrl = `${serverLocation}/schedule/get-id`;
const getTicketUrl = `${serverLocation}/ticket/get/`;

function Details(props) {

    let {id} = useParams();
    const token = localStorage.getItem("token");
    const [movie, setMovie] = useState({});
    const [analytics, setAnalytics] = useState({});
    const [rating, setRating] = useState(0);
    const [tickets, setTickets] = useState([]);
    const [scheduleId, setScheduleId] = useState(0);

    const [formValues, setFormValues] = useState({
        branch: "",
        hall: "",
        date: "",
        time: "",
        movie_id: id
    })

    const getMovie = (id) => {
        axios.get(movieUrl+id).then(response=>{
            setMovie(response.data);
        }).catch(error=>{
            toast.error(errorMessage);
            console.log(error);
        })
    }

    const getAnalytics = (id) => {
        axios.get(analyticsUrl + id).then(response=>{
            setAnalytics(response.data);
            if (response.data.rate_count===0) {
                setRating(0);
            } else {
                setRating(response.data.rate_sum/response.data.rate_count);
            }
        }).catch(error => {
            toast.error(errorMessage);
            console.log(error);
        })
    }

    useEffect(()=>{
        getMovie(id);
        getAnalytics(id);
    },[id])

    const getSchedule = () => {
        axios.post(getScheduleIdUrl, formValues, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            setScheduleId(response.data.schedule_id);
            axios.get(getTicketUrl+response.data.schedule_id, {
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
                        toast.error(error.response.data.error);
                    }
                } catch {
                    toast.error(errorMessage);
                    console.log(error);
                }
            })
        }).catch(error=>{
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
        })
    }

    return(
        <div className="container mt-4">
            <div className="row text-start">
                <div className="col-md-4">
                    {props.isInfo && <img src={movie.image_url} alt={movie.name} />}
                    <div className="d-flex mb-4">
                        <h2>{movie.name}</h2>
                        <h2 className="mx-4">{rating}({analytics.rate_count})</h2>
                    </div>
                    {!props.isInfo && <TicketInput formValues={formValues} setFormValues={setFormValues}/>}
                    {!props.isInfo && <button className="btn btn-secondary form-control my-4" onClick={getSchedule}>Check</button>}
                </div>
                <div className="col-md-8">
                    {props.isInfo && <Info movie={movie} id={id} />}
                    {!props.isInfo && <Buy tickets={tickets} scheduleId={scheduleId} />}
                </div>
            </div>
        </div>
    )
}

export default Details;