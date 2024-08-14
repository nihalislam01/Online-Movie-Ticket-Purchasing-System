import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { errorMessage, serverLocation } from "../../const/Constants";
import Review from "../Review/Review";

const movieUrl = `${serverLocation}/movie/get-movie/`;
const analyticsUrl = `${serverLocation}/review/get-analytics/`;

function Details() {

    let {id} = useParams();
    const [movie, setMovie] = useState({});
    const [analytics, setAnalytics] = useState({});
    const [rating, setRating] = useState(0);

    const getMovie = (id) => {
        axios.get(movieUrl+id).then(response=>{
            setMovie(response.data)
        })
    }

    const getAnalytics = (id) => {
        axios.get(analyticsUrl + id).then(response=>{
            setAnalytics(response.data);
            if (response.data.rate_count===0) {
                setRating(0);
            } else {
                setRating(response.data.rate_sum/response.data.rate_count);
            }
        }).catch(error => {
            toast.error(errorMessage);
            console.log(error);
        })
    }

    useEffect(()=>{
        getMovie(id);
        getAnalytics(id);
    },[id])

    return(
        <div className="container mt-4">
            <div className="row text-start">
                <div className="col-md-4">
                    <img src={movie.image_url} alt={movie.name} />
                    <div className="d-flex">
                        <h5>{movie.name}</h5>
                        <p className="mx-4">{rating}({analytics.rate_count})</p>
                    </div>
                </div>
                <div className="col-md-8">
                    <h5>Description</h5>
                    <p>{movie.description}</p>
                    <h5>Release Date</h5>
                    <p>{movie.release_date}</p>
                    <h5>Genre</h5>
                    <p>{movie.genre}</p>
                    <a href={movie.trailer_url}><button className="btn btn-danger mx-2">Watch Trailer</button></a>
                    <Link to={`/review/${id}`}><button className="btn btn-warning mx-2">Write a review</button></Link>
                    <h4 className="mt-4">Reviews</h4>
                    <hr />
                    <Review isMovie={true} id={id}/>
                </div>
            </div>
        </div>
    )
}

export default Details;