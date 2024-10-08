import axios from "axios";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import FormInput from "../../common/components/FormInput/FormInput";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import { errorMessage, serverLocation } from "../../const/Constants";

const pageTitle = "Add Movie";
const addMovieUrl = `${serverLocation}/movie/add`;
const updateMovieUrl = `${serverLocation}/movie/update`;
const movieUrl = `${serverLocation}/movie/get/`;

const movieInputs = [
    {
        id: "nameInput",
        name: "name",
        type: "text",
        label: "Name"
    },
    {
        id: "releaseDateInput",
        name: "release_date",
        type: "date",
        label: "Release Date"
    },
    {
        id: "genreInput",
        name: "genre",
        type: "text",
        label: "Genre"
    },
    {
        id: "imageUrlInput",
        name: "image_url",
        type: "text",
        label: "Image URL"
    },
    {
        id: "trailerUrlInput",
        name: "trailer_url",
        type: "text",
        label: "Trailer URL"
    }
];

function MovieForm(props) {

    let token = localStorage.getItem("token");
    let user_id = localStorage.getItem("id");
    const {movie_id} = useParams();

    const [formValues, setFormValues] = useState({
        name: "",
        release_date: "",
        genre: "",
        image_url:  "",
        trailer_url: "",
        is_available: 0,
        description: "",
        user_id: user_id
    });

    const getMovie = (id) => {
        axios.get(movieUrl+id).then(response=>{
            setFormValues(response.data);
        }).catch(error=>{
            toast.error(errorMessage);
            console.log(error);
        })
    }

    useEffect(()=>{
        if (!props.isAdd) {
            getMovie(movie_id);
        }
    },[props.isAdd, movie_id])

    const onChangeHandler = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    const checkboxCheckHandler = e => {
        const isChecked = e.target.checked;
        setFormValues({...formValues, is_available: isChecked ? 1 : 0})
    }

    const onFormSubmit = e => {
        axios.post(addMovieUrl, formValues, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response => {
            window.location.href = "/movie";
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

    const onUpdateSubmit = e => {
        axios.patch(updateMovieUrl, formValues, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        }).then(response => {
            window.location.href = "/movie";
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

    const cancel = () => {
        window.location.href = "/movie";
    }

    return(
        <>
            <CommonHelmet title={pageTitle}/>

            <Toaster />
            <div className="d-flex justify-content-center align-items-center min-vh-100 w-100">
                <div className="w-50">
                    <div>
                        {props.isAdd && <h4 className={`text-center`}>Add A Movie</h4>}
                        {!props.isAdd && <h4 className={`text-center`}>Update Movie</h4>}
                    </div>
                    <div className={`d-flex flex-column`}>
                        {movieInputs.map((e, index) => (
                            <FormInput key={e.id} onChange={onChangeHandler} {...e} value={formValues[e.name]}/>
                        ))}
                        <label htmlFor="descriptionInput">Description</label>
                        <textarea id="descriptionInput" name="description" type="text" className="form-control" value={formValues.description} onChange={onChangeHandler}/>
                        <div>
                            <label htmlFor="availableInput" style={{marginRight: "10px"}}>Is Available</label>
                            <input id="availableInput" type="checkbox" checked={formValues.is_available===1} onChange={checkboxCheckHandler} />
                        </div>
                        {props.isAdd && <button className="btn btn-primary mt-2 w-100" onClick={onFormSubmit} >Add</button>}
                        {!props.isAdd && <button className="btn btn-primary mt-2 w-100" onClick={onUpdateSubmit} >Update</button>}
                    </div>
                    <button className="btn btn-outline-secondary mt-2 w-100" onClick={cancel}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default MovieForm;