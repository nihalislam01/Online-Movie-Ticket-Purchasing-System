import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverLocation } from "../../const/Constants";

const movieUrl = `${serverLocation}/movie/get-movie/`;

function Details() {

    let {id} = useParams();
    const [movie, setMovie] = useState({});

    const getMovie = (id) => {
        axios.get(movieUrl+id).then(response=>{
            setMovie(response.data)
        })
    }

    useEffect(()=>{
        getMovie(id);
    },[id])

    return(
        <div className="container mt-4">
            <div className="row text-start">
                <div className="col-md-4">
                    <img src={movie.image_url} alt={movie.name} />
                    <h5>{movie.name}</h5>
                </div>
                <div className="col-md-8">
                    <h5>Description</h5>
                    <p>{movie.description}</p>
                    <h5>Release Date</h5>
                    <p>{movie.release_date}</p>
                    <h5>Genre</h5>
                    <p>{movie.genre}</p>
                    <a href={movie.trailer_url}><button className="btn btn-danger">Watch Trailer</button></a>
                </div>
            </div>
        </div>
    )
}

export default Details;