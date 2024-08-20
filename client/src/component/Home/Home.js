import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";

const getMovieUrl = `${serverLocation}/movie/get?search=`;
const getMovieForWishlistUrl = `${serverLocation}/wishlist/get/`;
const addMovieForWishlistUrl = `${serverLocation}/wishlist/add`;
const removeMovieForWishlistUrl = `${serverLocation}/wishlist/delete/`;
const homeTitle = "Home";
const wishlistTitle = "Wishlist";

function Home(props) {

    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState('');

    const getMovie = (search) => {
        axios.get(getMovieUrl + search).then(response => {
            setMovies(response.data);
        }).catch(error => {
            toast.error(errorMessage);
            console.log(error)
        })
    }

    const getMovieForWishlist = (search, id, token) => {
        axios.get(getMovieForWishlistUrl + id + "?search=" + search, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response => {
            setMovies(response.data);
        }).catch(error => {
            if (error.response.status===403) {
                window.location.href = "/login";
            } else {
                try {
                    if (error.response.status===403) {
                        window.location.href = '/login';
                    } else {
                        toast.error(error.response.data.error);
                    }
                } catch {
                    toast.error(errorMessage);
                    console.log(error);
                }
            }
        })
    }

    useEffect(()=>{
        if (props.isHome) {
            getMovie(search);
        } else {
            getMovieForWishlist(search, id, token);
        }
    },[props.isHome, search, id, token])

    const  handleSearchChange = (event) => {
        setSearch(event.target.value)
        axios.get(getMovieUrl + event.target.value)
            .then((response) => {
                setMovies(response.data);
            })
            .catch((error) => {
                toast.error(errorMessage);
                console.log(error);
            })
    }

    const addToWishlist = (movie_id) => {
        const wishlist = {
            user_id: id,
            movie_id: movie_id
        }
        axios.post(addMovieForWishlistUrl, wishlist, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            window.location.href = "/wishlist";
        }).catch(error=>{
            if (error.response.status===403) {
                window.location.href = "/login";
            } else {
                toast.error(errorMessage);
                console.log(error)
            }
        })
    }

    const removeWishlist = (movie_id) => {
        axios.delete(removeMovieForWishlistUrl + id + '/' + movie_id, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            window.location.href = "/wishlist";
        }).catch(error=>{
            if (error.response.status===403) {
                window.location.href = "/login";
            } else {
                toast.error(errorMessage);
                console.log(error)
            }
        })
    }

    return (
        <>
            {props.isHome && <CommonHelmet title={homeTitle} />}
            {!props.isHome && <CommonHelmet title={wishlistTitle} />}
            <Toaster />
            <div className="container pt-4">
                <input type="text" placeholder="search for Movies" className="form-control text-center bg-light" value={search} onChange={handleSearchChange} />
                <hr />
                <div className="row g-2 justify-content-center">
                    {movies.map(
                            movie => (
                                <div className="col-12 col-md-2 m-1 text-center p-2" key={movie.movie_id} style={{ backgroundColor: "#e2eafc", borderRadius: "10px" }}>
                                    <Link to={`/details/${movie.movie_id}`}><img src={movie.image_url} alt={movie.name} className="mt-4"/></Link>
                                    <p>{movie.name}</p>
                                    {props.isHome && <button className="btn btn-outline-warning form-control mb-2" onClick={()=>addToWishlist(movie.movie_id)}>Add To Wishlist</button>}
                                    {!props.isHome && <button className="btn btn-outline-warning form-control mb-2" onClick={()=>removeWishlist(movie.movie_id)}>Remove From Wishlist</button>}
                                    <Link to={`/buy-ticket/${movie.movie_id}`}><button className="btn btn-warning form-control mb-2">Buy Ticket</button></Link>
                                </div>
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Home;