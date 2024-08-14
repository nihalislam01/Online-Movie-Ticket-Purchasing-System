import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import FormInput from "../../common/components/FormInput/FormInput";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";
import Review from "../Review/Review";

const pageTitle = "Profile";
const getUserUrl = `${serverLocation}/user/get-user/`;
const changePasswordUrl = `${serverLocation}/user/change-password`;
const updateUserUrl = `${serverLocation}/user/update-user`;

const passwordInputs = [
    {
        id: "oldPasswordInput",
        name: "old_password",
        type: "password",
        label: "Old Password"
    },
    {
        id: "newPasswordInput",
        name: "new_password",
        type: "password",
        label: "New Password"
    },
    {
        id: "matchPasswordInput",
        name: "match_password",
        type: "password",
        label: "Match Password"
    }
];

function Profile() {

    let id = localStorage.getItem("id");
    let token = localStorage.getItem("token");
    const [user, setUser] = useState({});
    const [openPassword, setOpenPassword] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    const [formValues, setFormValues] = useState({
        id: id,
        old_password: "",
        new_password: "",
        match_password: ""
    });

    const getUser = (token, id) => {
        axios.get(getUserUrl + id, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            setUser(response.data);
            setName(response.data.name);
            setUsername(response.data.username);
        }).catch(error=>{
            if(error.status===401) {
                window.location.href = '/login';
            }
        })
    }

    useEffect(()=>{
        getUser(token, id);
    },[token, id])

    const onChangeHandler = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    const userNameChangeHandler = e => {
        setName(e.target.value);
    }

    const userUsernameChangeHandler = e => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = () => {
        axios.patch(changePasswordUrl, formValues, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            toast.success(response.data);
            setOpenPassword(false);
        }).catch(error=>{
            if (error.status===401) {
                window.location.href = "/login";
            }
            try {
                toast.error(error.response.data.error);
            } catch {
                toast.error(errorMessage);
            }
        })
    }

    const updateUser = () => {
        const userFormValues = {
            id: id,
            name: name,
            username: username
        }
        axios.patch(updateUserUrl, userFormValues,  {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            console.log(response)
            toast.success("User info updated");
            setOpenUpdate(false);
        }).catch(error=>{
            try {
                toast.error(error.response.data.error)
            } catch {
                toast.error(errorMessage)
            }
            console.log(error)
        })
    }

    return (
        <>
            <CommonHelmet title={pageTitle} />
            <Toaster />
            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-4">
                    <h2>Profile</h2>
                    {openUpdate && 
                    <div className="d-flex">
                        <button className="btn btn-success px-3 mx-2" onClick={updateUser}>Save</button>
                        <button className="btn btn-secondary mx-2" onClick={()=>setOpenUpdate(false)}>Cancel</button>
                    </div>}
                    {!openUpdate && !openPassword && <button className="btn btn-primary px-4" onClick={()=>setOpenUpdate(true)}>Edit</button>}
                </div>
                <hr />
                <div className="d-flex justify-content-center w-100">
                    <div className="w-50">
                        {!openUpdate && <><h4>Name</h4>
                        <div className="form-control mb-2">{user.name}</div>
                        <h4>Username</h4>
                        <div className="form-control mb-2">{user.username}</div></>}
                        {openUpdate && <>
                            <label htmlFor="nameInput">Name</label>
                            <input id="nameInput" type="text" name="name" value={name} onChange={userNameChangeHandler} className="form-control" />
                            <label htmlFor="nameInput">Username</label>
                            <input id="usernameInput" type="text" name="username" value={username} onChange={userUsernameChangeHandler} className="form-control" />
                        </>}
                        <hr />
                        {openPassword && <>
                            {passwordInputs.map(e => (
                            <FormInput key={e.id} onChange={onChangeHandler} {...e}/>
                        ))}
                        <hr />
                        <button className="btn btn-success form-control mb-2" onClick={handlePasswordChange}>Change Password</button>
                        <button className="btn btn-secondary form-control" onClick={() => setOpenPassword(false)}>Close</button>
                        </>}
                        {!openPassword && !openUpdate && <button className="btn btn-secondary form-control" onClick={() => setOpenPassword(true)}>Change Password</button>}
                        {!openUpdate && !openPassword && <>
                            <h4 className="mt-4">My Reviews</h4>
                            <hr />
                            <Review isMovie={false} id={id} />
                        </>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;