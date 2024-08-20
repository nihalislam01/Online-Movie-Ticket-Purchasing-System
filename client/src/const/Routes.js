import React from "react";
import BoughtTicket from "../component/BoughtTicket/BoughtTicket";
import Dashboard from "../component/Dashboard/Dashboard";
import Login from "../component/Login/Login";
import MovieForm from "../component/Movie/MovieForm";
import ReviewForm from "../component/Review/ReviewForm";
import Signup from "../component/Signup/Signup";
import TicketForm from "../component/Ticket/TicketForm";

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
        path: "/notification",
        element: <Dashboard currentPage={6} />
    },
    {
        path: "/ticket/:id",
        element: <Dashboard currentPage={7} />
    },
    {
        path: "/buy-ticket/:id",
        element: <Dashboard currentPage={8} />
    },
    {
        path: "/my-ticket",
        element: <Dashboard currentPage={9} />
    },
    {
        path: "/add-ticket/:id",
        element: <TicketForm />
    },
    {
        path: "/pdf/:id",
        element: <BoughtTicket isPDF={true}/>
    },
    {
        path: "/refund/:id",
        element: <BoughtTicket isPDF={false}/>
    },
    {
        path: "/add-movie",
        element: <MovieForm isAdd={true}/>
    },
    {
        path: "/update-movie/:movie_id",
        element: <MovieForm isAdd={false}/>
    },
    {
        path: "/review/:id",
        element: <ReviewForm />
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