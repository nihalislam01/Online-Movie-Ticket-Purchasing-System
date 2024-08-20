import axios from "axios";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";
import './TicketForm.css';
import TicketInput from "./TicketInput";

const pageTitle = "Add Ticket";
const addScheduleUrl = `${serverLocation}/schedule/add`;

function TicketForm() {

    const {id} = useParams();
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const [formValues, setFormValues] = useState({
        branch: "",
        hall: "",
        date: "",
        time: "",
        user_id: user_id,
        movie_id: id
    })

    const onFormSubmit = () => {
        let hasError = !Object.values(formValues).every(value => value.trim().length !== 0);
        if (hasError) {
            toast.error("Please fill out all the details");
            return;
        }
        axios.post(addScheduleUrl, formValues, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            window.location.href = `/ticket/${id}`;
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

    return  (
        <>
            <CommonHelmet title={pageTitle} />
            <Toaster />
            <div className="d-flex justify-content-center align-items-center w-100 min-vh-100">
                <div className="w-50">
                    <TicketInput formValues={formValues} setFormValues={setFormValues}/>
                    <button className="btn btn-primary form-control mt-4" onClick={onFormSubmit}>Add</button>
                </div>
            </div>
        </>
    )
}

export default TicketForm;