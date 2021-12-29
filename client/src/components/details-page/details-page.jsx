import React from "react";
import './details-page.css'
import {useParams} from "react-router-dom";

import LinkCard from "./link-card";
import {getDetailedClicks, selectLinkById} from '../../store/link-slice'
import {useDispatch, useSelector} from "react-redux";

export const DetailsPage = () => {
    const dispatch = useDispatch()
    const linkId = useParams().id
    const link = useSelector(state => selectLinkById(state, linkId))

    const openInNewTab = async url => {
        const newWindow = window.open(url, '_blank', 'noopener noreferrer')
        if (newWindow) newWindow.opener = null
        //there is a spike below before i found how to make clicks ready to be fetched after redirect (now they are updating a little bit later then redux fetching updates)
        setTimeout(async () => {
            await dispatch(getDetailedClicks(linkId)).unwrap()
        }, 1000)
    }


    return (
        <>
            {link && <LinkCard openInNewTab={openInNewTab} link={link}/>}
        </>
    )
}
