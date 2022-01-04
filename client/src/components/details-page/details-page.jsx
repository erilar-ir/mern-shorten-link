import React from "react";
import './details-page.css'
import {useParams} from "react-router-dom";
import NoLink from "./no-link";
import LinkCard from "./link-card";
import {getDetailedClicks, selectLinkById} from '../../store/link-slice'
import {useDispatch, useSelector} from "react-redux";
import ErrorBoundary from "../error-boundary";

export const DetailsPage = () => {
    const dispatch = useDispatch()
    const linkId = useParams().id
    const link = useSelector(state => selectLinkById(state, linkId))
    console.log(link)
    const openInNewTab = async url => {
        const newWindow = window.open(url, '_blank', 'noopener noreferrer')
        if (newWindow) newWindow.opener = null
        //there is a spike below before i found how to make clicks ready to be properly fetched after redirect (now they are updating a little bit later then redux fetching updates)
        setTimeout(async () => {
            await dispatch(getDetailedClicks(linkId)).unwrap()
        }, 1000)
    }
    let content
    if (!link) {
        content = <NoLink />
    } else {
        content = <LinkCard openInNewTab={openInNewTab} link={link}/>

    }

    return (
        <ErrorBoundary>
            {content}
        </ErrorBoundary>
    )
}
