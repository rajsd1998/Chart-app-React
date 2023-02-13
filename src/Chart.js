import { CChart } from "@coreui/react-chartjs";

const Chart = (props) => {
    return (
        <div>
            <CChart
                type="bar"
                data={{
                    labels: props.dates[1][0],
                    datasets: [
                        {
                            label: 'Astroid Count',
                            backgroundColor: '#f87979',
                            data: props.dates[0][0],
                        },
                    ],
                }}
                labels="Atroids"
            />
        </div>
    );
}

export default Chart;