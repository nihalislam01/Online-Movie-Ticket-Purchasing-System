import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";

const getMovieUrl = `${serverLocation}/movie/get-movie?search=`;
const pageTitle = "Home";

function Home() {

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

    useEffect(()=>{
        getMovie(search);
    },[search])

    function handleSearchChange(event) {
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

    return (
        <>
            <CommonHelmet title={pageTitle} />
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
                                    <button className="btn btn-outline-warning form-control mb-2">Add To Wishlist</button>
                                    <button className="btn btn-warning form-control mb-2">Buy Ticket</button>
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