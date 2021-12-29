import React from 'react'
import Loader from "../../loader";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    TimeSeriesScale,
    Title,
    Tooltip,
} from 'chart.js';
import {Bar} from "react-chartjs-2";
import 'chartjs-adapter-luxon'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    TimeScale,
    TimeSeriesScale,
    Title,
    Tooltip,
    Legend
);

export const GlobalChart = ({data = null}) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: true
        },
        stacked: true,
        plugins: {
            title: {
                display: false,
                text: 'Last two weeks statistics',
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                startFromZero: true,
                stacked: true,
                min: 0,
                suggestedMax: 50,
                ticks: {
                    // forces step size to be 50 units
                    stepSize: 10
                }
            },
            x: {
                display: 'auto',
                stacked: true,
            }
        },
    }
    if (!data) {
        return <Loader/>
    }
    return (
        <div className={'two-weeks-stat show-on-large hide-on-small-and-down'}>
            <Bar data={data} type={'bar'} options={options}/>
        </div>
    )
}
