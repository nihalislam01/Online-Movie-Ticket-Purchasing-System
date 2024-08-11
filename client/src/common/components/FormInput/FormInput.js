function FormInput(props) {
    return (
        <div className="mb-3">
            { props.label && <label htmlFor={props.id} className="form-label">{props.label}</label> }

            <input className="form-control"
                   id={props.id}
                   name={props.name}
                   type={props.type}
                   placeholder={props.placeholder}
                   onChange={props.onChange}/>
        </div>
    );
}

export default FormInput;