import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";

const pageTitle = "Movie";
const getMovieUrl = `${serverLocation}/movie/get-all-movie`;

function Movie() {

    let token = localStorage.getItem("token");
    const [movies, setMovies] = useState([]);

    const getMovie = (token) => {
        axios.get(getMovieUrl, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response => {
            setMovies(response.data);
        }).catch(error => {
            toast.error(errorMessage);
            console.log(error)
        })
    }

    useEffect(()=>{
        getMovie(token);
    },[token])

    const addMovie = () => {
        window.location.href = "/add-movie";
    }

    return(
        <>
            <CommonHelmet title={pageTitle}/>

            <Toaster />

            <div className="container mt-4">
                <div className="d-flex justify-content-between mb-4">
                    <h2>Movies</h2>
                    <button className="btn btn-primary" onClick={addMovie}>Add New Movie</button>
                </div>
                <hr />
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Release Date</th>
                            <th>Genre</th>
                            <th>Availability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie, index)=> (
                            <tr key={index}>
                                <td>{movie.movie_id}</td>
                                <td>{movie.name}</td>
                                <td>{movie.release_date}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.is_available}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Movie;