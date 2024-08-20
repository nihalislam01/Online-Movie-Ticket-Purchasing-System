import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";

const pageTitle = "Schedule";
const getScheduleUrl = `${serverLocation}/schedule/get/`;
const deleteScheduleUrl = `${serverLocation}/schedule/delete/`;

function Ticket() {

    const {id} = useParams();
    const token = localStorage.getItem("token");
    const [schedules, setSchedules] = useState([]);

    useEffect(()=>{
        const getSchedule = (id) => {
            axios.get(getScheduleUrl+id, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            }).then(response=>{
                setSchedules(response.data);
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
        getSchedule(id);
    },[token, id])

    const deleteSchedule = (schedule_id) =>{
        axios.delete(deleteScheduleUrl+schedule_id, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            toast.success(response.data)
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

 return(
    <>
        <CommonHelmet title={pageTitle} />
        <Toaster />
        <div className="container mt-4">
            <div className="d-flex justify-content-between">
                <h4>{schedules[0] && schedules[0].name} Schedule</h4>
                <Link to={`/add-ticket/${id}`}><button className="btn btn-primary">Add New Tickets</button></Link>
            </div>
            <hr />
            <table className="table">
                <thead>
                    <tr>
                        <th>Branch</th>
                        <th>Hall</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(schedule=>(
                        <tr key={schedule.schedule_id}>
                            <td>{schedule.branch}</td>
                            <td>{schedule.hall}</td>
                            <td>{schedule.date.substring(0, 10)}</td>
                            <td>{schedule.time}</td>
                            <td className="text-end"><button className="btn btn-outline-danger" onClick={()=>deleteSchedule(schedule.schedule_id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
 )
}

export default Ticket;