import {serverLocation, errorMessage} from '../../const/Constants';
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import FormInput from "../../common/components/FormInput/FormInput";
import { toast, Toaster } from 'react-hot-toast';
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const authenticateUrl = `${serverLocation}/user/authenticate`;
const pageTitle = "Login Page";

const userInputs = [
    {
        id: "usernameInput",
        name: "username",
        type: "text",
        label: "Username"
    },
    {
        id: "passwordInput",
        name: "password",
        type: "password",
        label: "Password"
    },
];

function Login() {

    const [formValues, setFormValues] = useState({
        username: "",
        password: ""
    });

    const onChangeHandler = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    const onFormSubmit = e => {
        e.preventDefault();

        let hasError = !Object.values(formValues).every(value => value.trim().length !== 0);

        if (hasError) {
            toast.error("Please fill out all the details");
            return;
        }
        axios.post(authenticateUrl, {
            ...formValues
        }).then((response)=>{
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("id", response.data.id);
            window.location.href = "/";
        }).catch((error)=>{
            try {
                toast.error(error.response.data.error);
            } catch {
                toast.error(errorMessage);
            }
        })
    }

    return (
        <>
            <CommonHelmet title={pageTitle}/>

            <Toaster />
            <div className="d-flex justify-content-center align-items-center min-vh-100 w-100">
                <div className="w-50">
                    <div>
                        <h4 className={`text-center`}>Log In</h4>
                    </div>

                    <form className={`d-flex flex-column`} onSubmit={onFormSubmit} method="POST">

                        {userInputs.map(e => (
                            <FormInput key={e.id} onChange={onChangeHandler} {...e}/>
                        ))}

                        <button type="submit" className="btn btn-primary mt-2">Log In</button>
                    </form>
                    <div className={`d-flex justify-content-center mt-4`}>
                        <p >Don't have an account? <Link to={`/signup`} className={`fw-bold`}>Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;