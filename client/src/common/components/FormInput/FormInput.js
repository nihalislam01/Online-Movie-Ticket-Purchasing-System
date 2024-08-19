function FormInput(props) {

    return (
        <div className="mb-3">
            { props.label && <label htmlFor={props.id} className="form-label" style={{cursor: "pointer"}}>{props.label}</label> }

            <input className="form-control"
                   id={props.id}
                   name={props.name}
                   type={props.type}
                   placeholder={props.placeholder}
                   checked={props.checked}
                   value={props.value}
                   onChange={props.onChange}
                   style={{display : props.display===false && "none"}}
                   />
        </div>
    );
}

export default FormInput;