import {Link, Navigate} from "react-router-dom";
import {useState} from "react";
import "./Menu.css";

function Menu(props) {

    const [isSignedOut, setSignedOut] = useState(false);

    const doSignOut = (e) => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        setSignedOut(true);
    };

    if (isSignedOut) {
        return <Navigate to={"/login"}/>;
    }

    return (
        <>
            <ul className={`d-flex justify-content-end`}>
                <li className={`d-flex align-items-center mx-2`}>
                    <Link to="/" className={`${props.currentPage === Page.home && (`selected`)}`}>Home</Link>
                </li>
                {!props.isAdmin && props.isAuthorized && <>                    
                </>}
                {props.isAdmin && props.isAuthorized && <>
                    <li className={`d-flex align-items-center mx-2`}>
                        <Link to="/movie" className={`${props.currentPage === Page.movie && (`selected`)}`}>Movie</Link>
                    </li>
                </>}
                {props.isAuthorized && <>
                    <li className={`d-flex align-items-center mx-2`}>
                        <Link to="/wishlist" className={`${props.currentPage === Page.wishlist && (`selected`)}`}>Wishlist</Link>
                    </li>
                    <li className={`d-flex align-items-center mx-2`}>
                        <Link to="/profile" className={`${props.currentPage === Page.profile && (`selected`)}`}>Profile</Link>
                    </li>
                    <li className={`d-flex align-items-center mx-2`}>
                        <Link onClick={doSignOut}>Sign Out</Link>
                    </li>
                    </>
                }
                {!props.isAuthorized && <>
                    <li className={`d-flex align-items-center mx-2`}>
                        <Link to="/login">Log In</Link>
                    </li>

                    <li className={`d-flex align-items-center mx-2`}>
                        <Link to="/signup">Sign Up</Link>
                    </li>
                </>}
            </ul>
        </>
    );
}

export const Page = {
    home: 1,
    profile: 2,
    movie: 3,
    details: 4,
    wishlist: 5
};

export default Menu;