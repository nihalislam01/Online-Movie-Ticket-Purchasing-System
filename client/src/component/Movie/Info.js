import { Link } from "react-router-dom";
import Review from "../Review/Review";

function Info({movie, id}) {

    return(
        <>
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
        </>
    )
}

export default Info;