import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Home from "../Home/Home";
import Menu, { Page } from "../Menu/Menu";
import Details from "../Movie/Details";
import Movie from "../Movie/Movie";

function Dashboard(props) {

    let token = localStorage.getItem("token");
    let role = localStorage.getItem("role");
    const [isAuthorized, setAuthorized] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
      if (token) {
        setAuthorized(true);
      }
      if (role==='ADMIN') {
        setAdmin(true);
      }
    }, [token, role]);

    return(
        <>
            <section className={`min-vh-100 w-100`}>
                <div className={`d-flex justify-content-around align-items-center border-bottom border-5 p-2 my-2`}>
                    <Link to={`/`} style={{textDecoration: "none", color: "black"}}><h4>Online Movie Ticket Purchasing System</h4></Link>
                    <div style={{width: "50%"}}>
                        <Menu currentPage={props.currentPage} isAuthorized={isAuthorized} isAdmin={isAdmin} />
                    </div>
                </div>
                {props.currentPage === Page.home && <Home />}
                {props.currentPage === Page.movie && <Movie />}
                {props.currentPage === Page.details && <Details />}
            </section>
        </>
    )
}

export default Dashboard;