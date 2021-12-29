import React, {useEffect, useState} from 'react'
import './one-link-stats.css'
import {useMessage} from "../../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {getDetailedClicks, selectLinkById, selectLinkStatisticsStatus} from "../../../store/link-slice";
import LinkStats from "./link-stats";
import Loader from "../../loader";

export const OneLinkStats = ({linkList}) => {
    const message = useMessage()
    const linkStatisticsStatus = useSelector(selectLinkStatisticsStatus)
    const dispatch = useDispatch()
    const startLink = linkList[0]._id
    const [activeLinkId, setActiveLinkId] = useState(startLink)
    const getDetails = async () => {
        try {
            await dispatch(getDetailedClicks(activeLinkId)).unwrap()
        } catch (e) {
            // console.log(e)
            message(e.message, 'warn')
        }
    }
    const link = useSelector(state => selectLinkById(state, activeLinkId))

    useEffect(async () => {
       await getDetails()
    }, [activeLinkId])
    // if () {
    //     return <Loader />
    // }
  return (
      <div className={'row one-link-stats'}>
          <div className={'col s12 m4 l2'}>
              <div className={'link-selector'}>
                  <ul className={'collection'}>
                      {linkList.map(({title, _id, to}) => {
                          const cardClasses = activeLinkId === _id ? 'collection-item active' : 'collection-item'
                            return (
                                <li key={_id} id={_id} className={cardClasses} >
                                    <button className={'btn btn-flat link-stat-btn'} onClick={() => setActiveLinkId(_id)} disabled={linkStatisticsStatus === 'loading'}>{title ? title : to}</button>
                                </li>
                            )
                      })}
                  </ul>
              </div>
          </div>
          <div className={'col s12 m8 l10'}>
              {link.clicksCollection.clicks ? <LinkStats link={link} /> : <Loader /> }
          </div>
      </div>
  )
}
