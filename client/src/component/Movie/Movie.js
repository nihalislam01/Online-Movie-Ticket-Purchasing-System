import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";

const pageTitle = "Movie";
const getMovieUrl = `${serverLocation}/movie/get-all`;
const deleteMovieUrl = `${serverLocation}/movie/delete/`;

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
            try {
                if (error.response.status===403) {
                    window.location.href = '/login';
                } else {
                    toast.error(error.response.data.error.errorMessage);
                }
            } catch {
                toast.error(errorMessage);
                console.log(error);
            }
        })
    }

    useEffect(()=>{
        getMovie(token);
    },[token])

    const addMovie = () => {
        window.location.href = "/add-movie";
    }

    const deleteMovie = (id) => {
        axios.delete(deleteMovieUrl+id, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            toast.success(response.data);
        }).catch(error=>{
            try {
                if (error.response.status===403) {
                    window.location.href = '/login';
                } else {
                    toast.error(error.response.data.error.errorMessage);
                }
            } catch {
                toast.error(errorMessage);
                console.log(error);
            }
        })
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie, index)=> (
                            <tr key={index}>
                                <td>{movie.movie_id}</td>
                                <td>{movie.name}</td>
                                <td>{movie.release_date.substring(0, 10)}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.is_available}</td>
                                <td className="text-end">
                                    <Link to={`/update-movie/${movie.movie_id}`}><button className="btn btn-outline-primary mx-2">Edit</button></Link>
                                    <Link to={`/ticket/${movie.movie_id}`}><button className="btn btn-outline-success mx-2">Manage Ticket</button></Link>
                                    <button className="btn btn-outline-danger mx-2" onClick={() => deleteMovie(movie.movie_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Movie;