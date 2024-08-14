import React from "react";
import Dashboard from "../component/Dashboard/Dashboard";
import Login from "../component/Login/Login";
import MovieForm from "../component/Movie/MovieForm";
import Signup from "../component/Signup/Signup";

export const routes = [
    {
        path: "/",
        element: <Dashboard currentPage={1} />
    },
    {
        path: "/profile",
        element: <Dashboard currentPage={2} />
    },
    {
        path: "/movie",
        element: <Dashboard currentPage={3} />
    },
    {
        path: "/details/:id",
        element: <Dashboard currentPage={4} />
    },
    {
        path: "/wishlist",
        element: <Dashboard currentPage={5} />
    },
    {
        path: "/add-movie",
        element: <MovieForm />
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/signup",
        element: <Signup/>
    }
];