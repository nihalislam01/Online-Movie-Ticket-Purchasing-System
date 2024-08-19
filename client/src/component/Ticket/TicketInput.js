import FormInput from '../../common/components/FormInput/FormInput';
import './TicketForm.css';

const branchInputs = [
    {
        id: "branch1Input",
        name: "branch",
        type: "radio",
        label: "Bashundhara City",
        value: "Bashundhara City"
    },
    {
        id: "branch2Input",
        name: "branch",
        type: "radio",
        label: "SKS Tower",
        value: "SKS Tower"
    },
    {
        id: "branch3Input",
        name: "branch",
        type: "radio",
        label: "Sony Square",
        value: "Sony Square"
    },
    {
        id: "branch4Input",
        name: "branch",
        type: "radio",
        label: "Shimanto Square",
        value: "Shimanto Square"
    }
];

const hallInputs = [
    {
        id: "hall1Input",
        name: "hall",
        type: "radio",
        label: "Hall 01 (VIP)",
        value: "Hall 01 (VIP)"
    },
    {
        id: "hall2Input",
        name: "hall",
        type: "radio",
        label: "Hall 02 (Premium)",
        value: "Hall 02 (Premium)"
    },
    {
        id: "hall3Input",
        name: "hall",
        type: "radio",
        label: "Hall 03 (Regular)",
        value: "Hall 03 (Regular)"
    }
];

const timeInputs = [
    {
        id: "time1Input",
        name: "time",
        type: "radio",
        label: "10:00",
        value: "10:00"
    },
    {
        id: "time2Input",
        name: "time",
        type: "radio",
        label: "10:30",
        value: "10:30"
    },
    {
        id: "time3Input",
        name: "time",
        type: "radio",
        label: "11:00",
        value: "11:00"
    },
    {
        id: "time4Input",
        name: "time",
        type: "radio",
        label: "02:30",
        value: "02:30"
    },
    {
        id: "time5Input",
        name: "time",
        type: "radio",
        label: "03:00",
        value: "03:00"
    },
    {
        id: "time6Input",
        name: "time",
        type: "radio",
        label: "03:30",
        value: "03:30"
    },
    {
        id: "time7Input",
        name: "time",
        type: "radio",
        label: "04:00",
        value: "04:00"
    },
    {
        id: "time8Input",
        name: "time",
        type: "radio",
        label: "04:30",
        value: "04:30"
    },
    {
        id: "time9Input",
        name: "time",
        type: "radio",
        label: "05:00",
        value: "05:00"
    },
    {
        id: "time10Input",
        name: "time",
        type: "radio",
        label: "05:30",
        value: "05:30"
    },
    {
        id: "time11Input",
        name: "time",
        type: "radio",
        label: "06:00",
        value: "06:00"
    },
    {
        id: "time12Input",
        name: "time",
        type: "radio",
        label: "06:30",
        value: "06:30"
    },
    {
        id: "time13Input",
        name: "time",
        type: "radio",
        label: "07:00",
        value: "07:00"
    },
    {
        id: "time14Input",
        name: "time",
        type: "radio",
        label: "07:30",
        value: "07:30"
    },
    {
        id: "time15Input",
        name: "time",
        type: "radio",
        label: "08:00",
        value: "08:00"
    },
    {
        id: "time16Input",
        name: "time",
        type: "radio",
        label: "08:30",
        value: "08:30"
    },
    {
        id: "time17Input",
        name: "time",
        type: "radio",
        label: "09:00",
        value: "09:00"
    },
];

function TicketInput({formValues, setFormValues}) {

    const onChangeHandler = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    return(
        <>
            <p className="m-0">Branch</p>
            <div className="d-flex" style={{overflow: "auto"}}>
                {branchInputs.map(e=>(
                    <div key={e.id} className={`choice ${formValues.branch === e.value && (`choice-selected`)}`}>
                        <FormInput onChange={onChangeHandler} {...e} display={false} />
                    </div>
                ))}
            </div>
            <p className="m-0">Hall</p>
            <div className="d-flex" style={{overflow: "auto"}}>
                {hallInputs.map(e=>(
                    <div key={e.id} className={`choice ${formValues.hall === e.value && (`choice-selected`)}`}>
                        <FormInput onChange={onChangeHandler} {...e} display={false} />
                    </div>
                ))}
            </div>
            <p className="m-0">Time</p>
            <div className="d-flex" style={{overflow: "auto"}}>
                {timeInputs.map(e=>(
                    <div key={e.id} className={`choice ${formValues.time === e.value && (`choice-selected`)}`}>
                        <FormInput onChange={onChangeHandler} {...e} display={false} />
                    </div>
                ))}
            </div>
            <label htmlFor="dateInput">Date</label>
            <input id="dateInput" type="date" value={formValues.date} name="date" className="form-control" onChange={onChangeHandler} />
        </>
    )
}

export default TicketInput;