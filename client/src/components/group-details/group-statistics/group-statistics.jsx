import React from 'react'
import './group-statistics.css'
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import {Doughnut} from "react-chartjs-2";
import RandomColor from 'randomcolor'

const color = RandomColor

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export const GroupStatistics = ({assignedLinks}) => {
    const links = assignedLinks
    if (links.length === 0) {
        return (
            <div className={'group-stat empty'}>
                {/*<h2>Group statistics</h2>*/}
               <i className={'medium material-icons grey-text'}>pie_chart</i>

                <p className={''}>Add some links to this group to see statistics</p>
            </div>
        )
    }
    const labels = links.map(link => link.title ? link.title : link.to)
    const dataSets = [{
        label: 'All links set',
        data: links.map(link => +link.clicks),
        backgroundColor: labels.map(() => color({hue: 'orange' ,format: 'rgb'})),
        // circumference: 180,
        // rotation: 270,
        // spacing: 5,
        hoverOffset: 7,
        weight: 1
    }]
    // console.log(dataSets)

    const data = {
        labels: labels,
        datasets: dataSets
    }
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        },
        layout: {
            // autoPadding: true,
            padding: 10
        }

    };
    return (
        <div className={'group-stat'}>
            {/*<h3>Group statistics</h3>*/}
            <Doughnut
                type={'doughnut'}
                data={data}
                options={options}
            />
        </div>
    )
}
