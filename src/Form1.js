import { Button, Container, Form } from 'react-bootstrap';
import Chart from './Chart';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function Form1() {


    //get date in y-m-d format in js?
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var [from_date, setFrom_date] = useState(today);
    var [to_date, setTo_date] = useState(today);
    var [max_speed, setMax_speed] = useState(0);
    var [max_speed_id, setMax_speed_id] = useState(0);
    var [min_distance, setMin_distance] = useState(0);
    var [min_distance_id, setMin_distance_id] = useState(0);
    var [avg_size, setAvg_size] = useState(0);
    var [astroid_count, setAstroid_count] = useState([]);
    var [astroid_date, setAstroid_date] = useState([])

    useEffect(() => {
        toast("Data Loading.......");
        fetch("http://127.0.0.1/chart-app/get_data.php")
            .then(response => response.json())
            .then(
                result => {

                    setMax_speed(result.max_speed);
                    setMax_speed_id(result.max_id);
                    setMin_distance(result.min_distance);
                    setMin_distance_id(result.min_distance_id);
                    setAvg_size(result.average_size);
                    setAstroid_count(astroid_count => [...astroid_count, result.astroid_count]);
                    setAstroid_date(astroid_date => [...astroid_date, result.astroid_date]);
                }
            )
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        const date1 = new Date(from_date);
        const date2 = new Date(to_date);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 7) {
            toast("Date range greater than Seven days");
            return
        }
        toast("Data Loading.......");
        fetch("http://127.0.0.1/chart-app/get_data.php?fdate=" + from_date + "&tdate=" + to_date)
            .then(response => response.json())
            .then(
                result => {
                    setMax_speed(result.max_speed);
                    setMax_speed_id(result.max_id);
                    setMin_distance(result.min_distance);
                    setMin_distance_id(result.min_distance_id);
                    setAvg_size(result.average_size);
                    setAstroid_count(astroid_count => [result.astroid_count]);
                    setAstroid_date(astroid_date => [result.astroid_date]);
                }
            )
    }

    return (
        <>
            <h4 className="center" style={{ backgroundColor: "#259ded", padding: "0.5%" }}>Astroid: Neo-Statistics</h4>
            <Container className="m-6" style={{ marginTop: "2%", marginBottom: "5%" }}>
                <ToastContainer />
                <Form className=" center" onSubmit={handleSubmit}>
                    <Form.Group className="col-2 m-6 p-2" controlId="formBasicEmail">
                        <Form.Label>From Date</Form.Label>
                        <Form.Control type="date" onChange={e => setFrom_date(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="col-2 mb-3 p-2" controlId="formBasicPassword">
                        <Form.Label>To Date</Form.Label>
                        <Form.Control type="date" onChange={e => setTo_date(e.target.value)} />
                    </Form.Group>
                    <Button className="btn m-4" variant="secondary" type="submit">
                        Submit
                    </Button>
                </Form>
                <hr>
                </hr>
                <div className="center">
                    <span className='mx-3'><h4>Max-Speed Astroid </h4><h6>[Astroid-Id-{max_speed_id}, Astroid-Speed-{max_speed} KMPH]</h6></span>
                    <span className='mx-3'><h4>Min-Distance Astroid </h4><h6>[Astroid-Id-{min_distance_id}, Astroid-Distance-{min_distance} KM]</h6></span>
                    <span className='mx-3'><h4>Average Size Astroid </h4><h6>[Astroid Average Size-{avg_size} KM]</h6></span>
                </div>
                <Chart dates={[astroid_count, astroid_date]} />
            </Container >
        </>
    );
}

export default Form1;