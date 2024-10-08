import {serverLocation, errorMessage} from '../../const/Constants';
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import FormInput from "../../common/components/FormInput/FormInput";
import { toast, Toaster } from 'react-hot-toast';
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const registrationUrl = `${serverLocation}/user/register`;
const pageTitle = "Signup Page";

const userInputs = [
    {
        id: "nameInput",
        name: "name",
        type: "text",
        label: "Name"
    },
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
    {
        id: "matchPasswordInput",
        name: "matchPassword",
        type: "password",
        label: "Match Password"
    },
];

function Signup() {

    const [formValues, setFormValues] = useState({
        name: "",
        username: "",
        password: "",
        matchPassword: ""
    });

    const onChangeHandler = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    const onFormSubmit = e => {
        e.preventDefault();

        let hasError = !Object.values(formValues).every(value => value.trim().length !== 0);

        let isPasswordMatched = formValues.password===formValues.matchPassword;

        if (hasError) {
            toast.error("Please fill out all the details");
            return;
        }

        if (!isPasswordMatched) {
            toast.error("Password did not match");
            return;
        }
        axios.post(registrationUrl, {
            ...formValues
        }).then((response)=>{
            toast.success(response.data);
        }).catch((error)=>{
            try {
                toast.error(error.response.data.error.errorMessage);
            } catch {
                toast.error(errorMessage);
                console.log(error);
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
                        <h4 className={`text-center`}>Sign Up</h4>
                    </div>

                    <form className={`d-flex flex-column`} onSubmit={onFormSubmit} method="POST">

                        {userInputs.map(e => (
                            <FormInput key={e.id} onChange={onChangeHandler} {...e}/>
                        ))}

                        <button type="submit" className="btn btn-success mt-2">Sign Up</button>
                    </form>
                    <div className={`d-flex justify-content-center mt-4`}>
                        <p >Already signed up? <Link to={`/login`} className={`fw-bold`}>Log In</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup;