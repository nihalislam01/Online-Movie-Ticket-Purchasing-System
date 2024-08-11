import React from "react";
import Login from "../component/Login/Login";
import Signup from "../component/Signup/Signup";

export const routes = [
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/signup",
        element: <Signup/>
    }
];