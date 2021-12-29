import React, {useLayoutEffect, useState} from 'react'
import './dashboard-page.css'
import {
    getManyLinksDetailedClicks,
    linksSliceStatus,
    selectAllClickedLinks,
    selectDashBoardStats,
    selectStatsStatus
} from "../../store/link-slice";
import {useDispatch, useSelector} from "react-redux";
import ErrorBoundary from "../error-boundary";
import {useMessage} from "../../hooks";
import {selectGroupSliceStatus} from "../../store/group-slice";
import GlobalChart from "./global-chart";
import Loader from "../loader";
import TopPerformers from "./top-performers";
import OneLinkStats from "./one-link-stats";


export const DashboardPage = () => {
    const message = useMessage()
    const dispatch = useDispatch()
    const groupsStatus = useSelector(selectGroupSliceStatus)
    const linksStatus = useSelector(linksSliceStatus)
    const linkList = useSelector(selectAllClickedLinks)
    const statisticsStatus = useSelector(selectStatsStatus)
    const statisticsData = useSelector(selectDashBoardStats)
    const [xPeriod, setXPeriod] = useState(13)

    if (linksStatus !== 'succeeded' || groupsStatus !== 'succeeded') {
        return <Loader/>
    }
    if (linkList.length === 0) {
        return <p>To view dashboard and statistics make some links with clicks</p>
    }
    const getDashboardData = async () => {
        try {
            if (linksStatus === 'succeeded' && groupsStatus === 'succeeded') {
               await dispatch(getManyLinksDetailedClicks({period: xPeriod})).unwrap()
            }
        } catch (e) {
            console.log(e)
            message(e.message, 'warn')
        }
    }
    useLayoutEffect(() => {
        getDashboardData()
    }, [xPeriod])
    if (!statisticsData) {
        return <Loader/>
    }
    const {dashBoardChartData, topPerformersData} = statisticsData

    const data = {
        labels: dashBoardChartData.labels,
        datasets: dashBoardChartData.datasets
    }
    const selectDashboardPeriod = event => {
        setXPeriod(event.target.value)
    }

    return (
        <div className={'dashboard-page'}>
            <div className="row dashboard-heading ">
                <h4>Statistics for</h4>
                <div className={'period-selector'}>
                    <select className={'browser-default select-wrapper'} onChange={selectDashboardPeriod}
                            value={xPeriod} disabled={statisticsStatus === 'loading'}>
                        <option value="6">Week</option>
                        <option value="13">Two Weeks</option>
                        <option value="30">Month</option>
                    </select>
                </div>
            </div>
            <div className={'row section dashboard-stats'}>
                <div className={'col s12 m12 l2'}>
                    <ErrorBoundary>
                        {statisticsStatus === 'loading' ? <Loader/> :
                            <TopPerformers topPerformersData={topPerformersData}/>}
                    </ErrorBoundary>
                </div>
                <div className={'col s12 m12 l10'}>
                    <ErrorBoundary>
                        {statisticsStatus === 'loading' ? <Loader/> : <GlobalChart data={data}/>}
                    </ErrorBoundary>
                </div>
            </div>
            <div className={'divider'} />
            <div className={'row section individual-stats'}>
                <ErrorBoundary>
                    {linkList && <OneLinkStats linkList={linkList}/>}
                </ErrorBoundary>
            </div>

        </div>

    )
}
