import React from 'react'
import './top-performers.css'

export const TopPerformers = ({topPerformersData}) => {
    const {topCity, topCountry, totalClicks} = topPerformersData

    return (
        <div className={'top-performers row'}>
            <div className="total col m4 s12 l12">
                <i className={'medium material-icons'}>insert_chart</i>
                <p className={'top-content'}>
                    <span className={'top-data'}>{totalClicks}</span>
                    <span className={'top-header grey-text'}>Total clicks</span>
                </p>
            </div>
            <div className="top-country col m4 s12 l12">
                <i className={'medium material-icons '}>location_on</i>
                <p className={'top-content'}>
                    <span className={'top-data'}>{topCountry}</span>
                    <span className={'top-header grey-text'}>Top Country </span>
                </p>
            </div>
            <div className="top-city col m4 s12 l12">
                <i className={'medium material-icons'}>location_city</i>
                <p className={'top-content'}>
                    <span className={'top-data'}>{topCity}</span>
                    <span className={'top-header grey-text'}>Top City</span>
                </p>
            </div>
        </div>
    )
}
