import React from 'react'
import './link-stat.css'
import {DateTime} from "luxon";
import randomColor from "randomcolor"
import {Doughnut} from "react-chartjs-2";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const LinkStats = ({link}) => {
    const {title, to, from, clicks, date, clicksCollection} = link
    const luxonDate = DateTime.fromMillis(+date)

    const prepareCityData = () => {
        let cityList = []
        clicksCollection.clicks.forEach(({city}) => {
            const existingCity = cityList.find(cityItem => cityItem.name === city)
            if (!existingCity) {
                cityList.push({name: city, count: 1})
            } else {
                existingCity.count++
            }
        })
        const labels = cityList.map(cityItem => cityItem.name)
        const data = cityList.map(cityItem => cityItem.count)
        return {
            labels,
            data
        }
    }
    const prepareCountryData = () => {
        let countryList = []
        clicksCollection.clicks.forEach(({country}) => {
            const existingCountry = countryList.find(countryItem => countryItem.name === country)
            if (!existingCountry) {
                countryList.push({name: country, count: 1})
            } else {
                existingCountry.count++
            }
        })
        const labels = countryList.map(countryItem => countryItem.name)
        const data = countryList.map(countryItem => countryItem.count)
        return {
            labels,
            data
        }
    }

    const cities = prepareCityData()
    const countries = prepareCountryData()
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        },
        layout: {
            padding: 10
        },

    }

    const cityData = {
        labels: cities.labels,
        datasets: [{
            label: 'Cities',
            data: cities.data,
            backgroundColor: cities.labels.map(_ => randomColor({hue: 'orange', format: 'rgb'})),
            cutout: 80,
            circumference: 180,
            rotation: 270
        }],
        hoverOffset: 7
    }
    const countryData = {
        labels: countries.labels,
        datasets: [{
            label: 'Countries',
            data: countries.data,
            backgroundColor: countries.labels.map(_ => randomColor({hue: 'orange', format: 'rgb'})),
            cutout: 80,
            circumference: 180,
            rotation: 270
        }],
        hoverOffset: 7

    }
    return (
        <div className="link-stats">
            <p className={'created grey-text'}> created {luxonDate.toISODate()}</p>
            <h4 className={'link-title'}>{title ? title : from}</h4>
            <p className={'teal-text text-darken-1 link-short'}>{to}</p>
            <p className={'clicks'}><span className={'grey-text'}>Total Clicks: </span> {clicks}</p>
            <div className="divider" />
            <div className={'link-stats-charts'}>
                <div className="row">
                    <div className={'countries-chart col l6 m6 s12'}>
                        <h5>Countries</h5>
                        <Doughnut
                            type={'doughnut'}
                            data={countryData}
                            options={options}
                        />
                    </div>
                    <div className={'cities-chart col l6 m6 s12'}>
                        <h5>Cities</h5>
                        <Doughnut
                            type={'doughnut'}
                            data={cityData}
                            options={options}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
