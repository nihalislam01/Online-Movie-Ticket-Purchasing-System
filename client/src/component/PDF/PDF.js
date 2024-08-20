import { useRef } from "react";
import CommonHelmet from "../../common/components/Head/CommonHelmet";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const pageTitle = "PDF";

function PDF({tickets}) {

    const printRef = useRef();

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');
    
        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    
        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('ticket.pdf');
      };

    return (
        <>
            <CommonHelmet title={pageTitle} />
            <div ref={printRef} className="container m-4">
                {tickets.map(ticket=>(
                    <div key={ticket.ticket_id}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>{ticket.name}</h2>
                            <h4>Ticket ID: {ticket.ticket_id}</h4>
                        </div>
                        <hr />
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Branch</th>
                                    <th>Hall</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Seat No</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{ticket.branch}</td>
                                    <td>{ticket.hall}</td>
                                    <td>{ticket.date.substring(0,10)}</td>
                                    <td>{ticket.time}</td>
                                    <td>{ticket.type}</td>
                                    <td>{ticket.seat_no}</td>
                                    <td>{ticket.price}</td>
                                </tr>
                            </tbody>
                        </table>
                        <hr />
                        <p>This ticket is valid only for the specified movie, date, time, and seat, and is non-transferable and non-refundable. Please arrive at least 15 minutes before showtime; latecomers may be denied entry. Age restrictions may apply, and ID may be required. Outside food, beverages, and recording devices are prohibited, and disruptive behavior may result in removal without a refund. The theater is not responsible for lost items, and management reserves the right to refuse admission or cancel screenings without notice.</p>
                        <hr />
                    </div>
                ))}
            </div>
            <button className="btn btn-primary m-4 text-end" onClick={handleDownloadPdf}>Download PDF</button>
        </>
    )
}

export default PDF;