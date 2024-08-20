import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import './Notification.css';

import {errorMessage, serverLocation} from '../../const/Constants';

const notificationUrl = `${serverLocation}/notification/get/`;
const deleteNotificatioUrl = `${serverLocation}/notification/delete/`;
const pageTitle = "Notification";

function Notification() {

    let id = localStorage.getItem("id");
    let token = localStorage.getItem("token");
    const [notifications, setNotifications] = useState([]);

    const getNotification = (id, token) =>{
        axios.get(notificationUrl+id, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            setNotifications(response.data);
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

    useEffect(()=>{
        getNotification(id, token);
    },[id, token])

    const deleteNotification = (id) =>{
        axios.delete(deleteNotificatioUrl+id, {
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
            <div className="container mt-4">
                <h2>Notification</h2>
                <hr />
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map((notification, index)=>(
                            <tr key={index}>
                                <td className="text-start">{notification.report}</td>
                                <td className="d-flex justify-content-end">
                                    <p className="my-0 mx-2">{notification.date.substring(0, 10)}</p>
                                    <p className="my-0 mx-2 cancel" onClick={()=>deleteNotification(notification.notification_id)}>&times;</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Notification;