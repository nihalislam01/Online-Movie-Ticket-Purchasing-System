import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { errorMessage, serverLocation } from "../../const/Constants";
import './Review.css';

const reviewByMovieUrl = `${serverLocation}/review/get-by-movie/`;
const reviewByUserUrl = `${serverLocation}/review/get-by-user/`;
const deleteReviewUrl = `${serverLocation}/review/delete/`;

function Review(props) {

    const id = props.id;
    const isMovie = props.isMovie;
    const token = localStorage.getItem("token");

    const [reviews, setReviews] = useState([]);

    const getReviewByMovie = (id) => {
        axios.get(reviewByMovieUrl+id).then(response=>{
            setReviews(response.data);
        }).catch(error=>{
            toast.error(errorMessage);
            console.log(error);
        })
    }

    const getReviewByUser = (id, token) => {
        axios.get(reviewByUserUrl+id, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            setReviews(response.data);
        }).catch(error=>{
            toast.error(errorMessage);
            console.log(error);
        })
    }

    useEffect(()=>{
        if (isMovie) {
            getReviewByMovie(id);
        } else {
            getReviewByUser(id, token)
        }
    },[isMovie, id, token])

    const deleteReview = (review_id) => {
        axios.delete(deleteReviewUrl + review_id, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            toast.success(response.data);
        }).catch(error=>{
            toast.error(errorMessage);
            console.log(error);
        })
    }

    return (
        <>
            {reviews.map((review, index)=> (
                <div key={index} className="my-4">
                    <div className="review-header">
                        {isMovie && <h5 className="m-0">{review.username}</h5>}
                        {!isMovie && <h5 className="m-0">{review.name}</h5>}
                        <div>
                            {[...Array(5)].map((_, index) => (
                                <span key={index} style={{color: index < review.rate ? 'gold' : 'lightgray',}}>&#9733;</span>
                            ))}
                            {!isMovie && <button className="btn btn-danger mx-2" onClick={()=>deleteReview(review.review_id)}>Delete</button>}
                        </div>
                    </div>
                    <div className="review-body container">
                        <p>{review.report}</p>
                    </div>
                </div>
            ))}
        </>
    )
}

export default Review;