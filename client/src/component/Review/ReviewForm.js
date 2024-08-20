import axios from "axios";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";

const pageTitle = "Review";
const addReviewUrl = `${serverLocation}/review/add`;

function ReviewForm() {

    const {id} = useParams();
    const user_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [rating, setRating] = useState(0);
    const [report, setReport] = useState("");

    const onChangeHandler = (event) => {
      setRating(parseInt(event.target.value, 10));
    };

    const reportChangeHandler = (event) => {
        setReport(event.target.value);
    };

    const addReview = () => {
        const values = {
            report: report,
            rate: rating,
            user_id: user_id,
            movie_id: id
        }
        axios.post(addReviewUrl, values, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response=>{
            window.location.href = `/details/${id}`;
        }).catch(error=>{
            if (error.response.status===403) {
                window.location.href = "/login";
            }
            try {
                toast.error(error.response.data.error);
            } catch{
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

    return (
        <>     
        <CommonHelmet title={pageTitle} />
        <Toaster />   
        <div className="d-flex justify-content-center align-items-center w-100 min-vh-100">
            <div className="w-50">
                <div className="d-flex justify-content-center">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value}>
                        <input
                            type="radio"
                            name="rating"
                            value={value}
                            checked={rating === value}
                            onChange={onChangeHandler}
                            style={{ display: 'none' }}
                        />
                        <span
                            style={{
                            fontSize: '2rem',
                            cursor: 'pointer',
                            color: rating >= value ? 'gold' : 'lightgray',
                            transition: 'color 0.3s',
                            }}
                        >
                            &#9733;
                        </span>
                        </label>
                    ))}
                </div>
                <textarea className="form-control" type="text" name="report" placeholder="Describe your opinion (Optional)" value={report} onChange={reportChangeHandler} />
                <button className="btn btn-success w-100 mt-2" onClick={addReview}>Submit</button>
                <Link to="/"><button className="btn btn-secondary w-100 mt-2">Cancel</button></Link>
            </div>
        </div>
        </>

    )
}

export default ReviewForm;